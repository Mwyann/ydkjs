#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Serveur WebSocket YDKJ (Tornado)
Relais aveugle et séquenceur d'actions pour le multijoueur.
"""

import os
import sys
import time
import json
import random
import signal
import secrets
from datetime import datetime
from tornado.options import options, define, parse_command_line
import tornado.httpserver
import tornado.ioloop
import tornado.web
import tornado.websocket

PORT_MAPPING = {
    'fr': 8990,
    'uk': 8991,
    'de': 8992,
    'us': 8993,
}

def parse_port(value):
    if isinstance(value, int):
        return value
    val_str = str(value).strip().lower()
    if val_str in PORT_MAPPING:
        return PORT_MAPPING[val_str]
    try:
        return int(val_str)
    except ValueError:
        raise ValueError(
            f"Port invalide : '{value}'. Spécifiez un numéro de port ou l'un des alias : {', '.join(PORT_MAPPING.keys())}"
        )


define('port', type=parse_port, default=8889, help="Port d'écoute du serveur WebSocket (numéro ou alias : fr=8890, uk=8891, de=8892, us=8893)")
define('log_dir', type=str, default='logs', help="Dossier de stockage des logs de session")
define('deadlock_recovery', type=bool, default=True, help="Restaurer le dernier checkpoint (game_state) en cas de deadlock au lieu de fermer la session")

ALPHABET = "ABCDEFGHJKLMNPQRTUVWXY346789"  # Sans 0, O, 1, I, 2, Z, 5, S pour éviter les confusions

is_shutting_down = False

class YDKJWebSocket(tornado.websocket.WebSocketHandler):
    sessions = {}     # code -> dict de session
    all_sockets = set()  # ensemble de toutes les sockets actives

    def check_origin(self, origin):
        return True

    def open(self):
        YDKJWebSocket.all_sockets.add(self)
        self.session_code = None
        self.client_info = None

    def get_timestamp(self):
        return datetime.now().strftime("%Y-%m-%d %H:%M:%S.%f")[:-3]

    def log_session(self, session, message):
        line = f"[{self.get_timestamp()}] {message}\n"
        if session and session.get('log_file') and not session['log_file'].closed:
            try:
                session['log_file'].write(line)
                session['log_file'].flush()
            except Exception as e:
                print(f"Log write error: {e}")
        print(f"[{session.get('code', '----') if session else '----'}] {line.strip()}")

    def generate_session_code(self):
        log_dir = options.log_dir
        os.makedirs(log_dir, exist_ok=True)
        while True:
            code = ''.join(random.choice(ALPHABET) for _ in range(4))
            if code in YDKJWebSocket.sessions:
                continue
            log_path = os.path.join(log_dir, f"session_{code}.log")
            if os.path.exists(log_path):
                continue
            return code

    def log_replay(self, session, packet):
        if not session or not session.get('replay_file') or session['replay_file'].closed:
            return
        entry = {
            "ts": datetime.now().strftime("%Y-%m-%d %H:%M:%S.%f")[:-3],
            "t": round(time.time(), 3),
            "packet": packet
        }
        try:
            session['replay_file'].write(json.dumps(entry, ensure_ascii=False) + "\n")
            session['replay_file'].flush()
        except Exception as e:
            print(f"Replay write error: {e}")

    def broadcast(self, session, msg_dict, exclude_self=False):
        if session.get('is_recording_replay'):
            self.log_replay(session, msg_dict)
        payload = json.dumps(msg_dict)
        for sock in list(session['clients'].keys()):
            if exclude_self and sock == self:
                continue
            try:
                sock.write_message(payload)
            except Exception as e:
                print(f"Socket send error: {e}")

    def send_lobby_state(self, session):
        client_data = [
            {
                "client_id": info["client_id"],
                "nick": info["nick"],
                "is_host": info["is_host"],
                "spectator": info["spectator"]
            }
            for info in session['clients'].values()
        ]
        self.broadcast(session, {
            "event": "lobby_state",
            "clients": client_data,
            "nb_questions": session.get('nb_questions', 7)
        })

    def create_session(self, msg=None):
        self.leave_session(intentional=True)
        code = self.generate_session_code()
        log_dir = options.log_dir
        log_path = os.path.join(log_dir, f"session_{code}.log")
        log_file = open(log_path, "a", encoding="utf-8")

        token = secrets.token_hex(6)
        client_info = {
            "client_id": 1,
            "nick": "",
            "is_host": True,
            "spectator": False,
            "token": token
        }

        is_public = bool(msg.get('public', False)) if msg else False

        session = {
            "code": code,
            "created_at": time.time(),
            "status": "lobby",  # 'lobby' ou 'in_game'
            "nb_questions": 7,
            "public": is_public,
            "host_socket": self,
            "clients": {self: client_info},
            "disconnected_clients": {},
            "host_disconnect_timer": None,
            "action_sequence": 0,
            "sync_clients": set(),
            "sync_timeout": None,
            "grace_timer": None,
            "log_file": log_file,
            "replay_file": None,
            "is_recording_replay": False,
            "last_game_state": None,
            "game_start_packet": None,
            "active_in_game_players": set(),
            "waiting_players": set(),
            "reconnect_deadlock_timer": None
        }

        YDKJWebSocket.sessions[code] = session
        self.session_code = code
        self.client_info = client_info

        ip = getattr(self.request, 'remote_ip', 'unknown')
        self.log_session(session, f"[SESSION_CREATED] Code: {code} by IP {ip} (client_id: 1, public: {is_public})")

        self.write_message(json.dumps({
            "event": "session_created",
            "session": code,
            "client_id": 1,
            "is_host": True,
            "token": token
        }))
        self.send_lobby_state(session)

    def join_session(self, code):
        code = (code or "").strip().upper()
        if code not in YDKJWebSocket.sessions:
            self.write_message(json.dumps({"event": "error", "message": "Session inexistante"}))
            return

        session = YDKJWebSocket.sessions[code]
        if self in session['clients']:
            info = session['clients'][self]
            if session.get('status') == 'in_game':
                start_pkt = session.get('game_start_packet') or {}
                self.write_message(json.dumps({
                    "event": "game_init",
                    "session": code,
                    "client_id": info["client_id"],
                    "is_host": info.get("is_host", False),
                    "status": "in_game",
                    "spectator": info.get("spectator", True),
                    "nb_questions": start_pkt.get('nb_questions', 7),
                    "clients": start_pkt.get('clients', []),
                    "token": info.get("token", "")
                }))
            else:
                self.write_message(json.dumps({
                    "event": "session_joined",
                    "session": code,
                    "client_id": info["client_id"],
                    "is_host": info.get("is_host", False),
                    "status": "lobby",
                    "spectator": info.get("spectator", True),
                    "token": info.get("token", "")
                }))
                self.send_lobby_state(session)
            return

        self.leave_session(intentional=True)
        # Annuler le timer de grâce si tous les clients s'étaient déconnectés
        if session.get('grace_timer'):
            tornado.ioloop.IOLoop.current().remove_timeout(session['grace_timer'])
            session['grace_timer'] = None

        # Calcul dynamique du prochain client_id
        all_ids = [c['client_id'] for c in session['clients'].values()] + [c['client_id'] for c in session.get('disconnected_clients', {}).values()]
        client_id = max(all_ids or [0]) + 1
        is_spectator = True  # Spectateur par défaut, l'hôte active les participants manuellement
        token = secrets.token_hex(6)

        client_info = {
            "client_id": client_id,
            "nick": "",
            "is_host": False,
            "spectator": is_spectator,
            "token": token
        }

        session['clients'][self] = client_info
        self.session_code = code
        self.client_info = client_info

        ip = getattr(self.request, 'remote_ip', 'unknown')
        role_label = "spectator"
        self.log_session(session, f"[CLIENT_JOINED] from IP {ip} (client_id: {client_id}, {role_label})")

        if session.get('status') == 'in_game':
            start_pkt = session.get('game_start_packet') or {}
            self.write_message(json.dumps({
                "event": "game_init",
                "session": code,
                "client_id": client_id,
                "is_host": False,
                "status": "in_game",
                "spectator": True,
                "nb_questions": start_pkt.get('nb_questions', 7),
                "clients": start_pkt.get('clients', []),
                "token": token
            }))
        else:
            self.write_message(json.dumps({
                "event": "session_joined",
                "session": code,
                "client_id": client_id,
                "is_host": False,
                "status": "lobby",
                "spectator": is_spectator,
                "token": token
            }))
            self.send_lobby_state(session)

    def game_init(self, msg):
        code = (msg.get('session') or "").strip().upper()
        client_id = msg.get('client_id')
        token = msg.get('token')

        if not code or code not in YDKJWebSocket.sessions:
            self.write_message(json.dumps({"event": "error", "message": "Session inexistante"}))
            return

        # Si cette socket était techniquement rattachée à une autre session, la détacher d'abord
        if self.session_code and self.session_code != code:
            self.log_session(None, f"[CLIENT_SWITCH_SESSION] Socket attached to {self.session_code}, switching to {code}")
            self.leave_session(intentional=True)

        session = YDKJWebSocket.sessions[code]
        target_info = None
        is_reconnecting_player = False

        if client_id and token:
            # 1. Vérifier dans les clients déconnectés de CETTE session
            if client_id in session.get('disconnected_clients', {}):
                candidate = session['disconnected_clients'][client_id]
                if candidate.get('token') == token:
                    target_info = session['disconnected_clients'].pop(client_id)
                    is_reconnecting_player = True
            # 2. Vérifier si l'ancienne socket n'était pas encore fermée
            elif self in session['clients']:
                target_info = session['clients'][self]
            else:
                for old_sock, info in list(session['clients'].items()):
                    if info.get('client_id') == client_id and info.get('token') == token:
                        target_info = info
                        session['clients'].pop(old_sock, None)
                        is_reconnecting_player = True
                        break
                # 3. Vérifier dans game_players si la partie est déjà lancée
                if not target_info and session.get('game_players'):
                    for gp in session['game_players']:
                        if gp.get('client_id') == client_id and gp.get('token') == token:
                            target_info = dict(gp)
                            is_reconnecting_player = True
                            break

        if not target_info:
            if session.get('status') == 'in_game':
                # Connexion directe à une partie en cours : admission immédiate en spectateur
                all_ids = [c['client_id'] for c in session['clients'].values()] + [c['client_id'] for c in session.get('disconnected_clients', {}).values()]
                if session.get('game_players'):
                    all_ids += [c['client_id'] for c in session['game_players']]
                client_id = max(all_ids or [0]) + 1
                token = secrets.token_hex(6)
                target_info = {
                    "client_id": client_id,
                    "nick": "Spectateur",
                    "is_host": False,
                    "spectator": True,
                    "token": token
                }
                self.log_session(session, f"[SPECTATOR_JOINED_IN_GAME] client_id: {client_id}")
            else:
                # La session demandée est encore en phase de lobby et les credentials ne correspondent pas
                # (ex: changement de session). On admet immédiatement le client dans le lobby !
                self.log_session(session, f"[RECONNECT_FALLBACK_JOIN] Unknown credentials for {code}. Admitted to lobby.")
                self.join_session(code)
                return

        session['clients'][self] = target_info
        self.session_code = code
        self.client_info = target_info

        # Si c'était l'hôte pendant le lobby, annuler le timer de déconnexion hôte
        if target_info.get('is_host') and session.get('host_disconnect_timer'):
            tornado.ioloop.IOLoop.current().remove_timeout(session['host_disconnect_timer'])
            session['host_disconnect_timer'] = None
            self.log_session(session, f"[HOST_RECONNECTED] Host (client_id: {client_id}) reconnected successfully. Timer cancelled.")
        elif is_reconnecting_player:
            self.log_session(session, f"[CLIENT_RECONNECTED] client_id: {client_id} (nick: \"{target_info.get('nick')}\") reconnected.")

        if session.get('status') == 'in_game':
            if not target_info.get('spectator') and (client_id not in session.get('active_in_game_players', set())):
                session.setdefault('waiting_players', set()).add(client_id)
                self.log_session(session, f"[CLIENT_WAITING_SYNC] client_id: {client_id} is waiting for next turn (temporarily excluded from sync).")

            # Vérifier si tous les joueurs actifs sont en attente / déconnectés (deadlock F5)
            self.check_game_deadlock(session)

            start_pkt = session.get('game_start_packet') or {}
            self.write_message(json.dumps({
                "event": "game_init",
                "session": code,
                "client_id": client_id,
                "is_host": target_info.get('is_host', False),
                "status": "in_game",
                "spectator": target_info.get('spectator', False),
                "nb_questions": start_pkt.get('nb_questions', 7),
                "clients": start_pkt.get('clients', []),
                "token": target_info.get('token', '')
            }))
        else:
            client_data = [
                {
                    "client_id": info["client_id"],
                    "nick": info["nick"],
                    "is_host": info["is_host"],
                    "spectator": info["spectator"]
                }
                for info in session['clients'].values()
            ]
            self.write_message(json.dumps({
                "event": "game_init",
                "session": code,
                "client_id": client_id,
                "is_host": target_info.get('is_host', False),
                "status": "lobby",
                "spectator": target_info.get('spectator', False),
                "nb_questions": session.get('nb_questions', 7),
                "clients": client_data,
                "token": target_info.get('token', '')
            }))

    def find_public_session(self):
        found_code = None
        for code, sess in YDKJWebSocket.sessions.items():
            if sess.get('public') and sess.get('status') == 'lobby':
                found_code = code
                break
        self.write_message(json.dumps({
            "event": "public_session_found",
            "session": found_code
        }))

    def check_sync_barrier(self, session):
        # Clients actifs devant synchroniser
        if session.get('status') == 'in_game':
            # Seuls les joueurs actifs qui sont connectés ET en jeu (non en attente de game_state)
            # sont requis pour franchir la barrière de synchronisation
            active_configured_ids = {c['client_id'] for c in session.get('game_players', [])}
            connected_client_ids = {
                info['client_id'] for info in session['clients'].values()
                if info.get('client_id') in active_configured_ids and not info.get('spectator')
            }
            active_client_ids = connected_client_ids & session.get('active_in_game_players', set())
        else:
            active_client_ids = {c['client_id'] for c in session['clients'].values() if not c.get('spectator')}

        if not active_client_ids:
            return

        if active_client_ids.issubset(session['sync_clients']):
            if session.get('sync_timeout'):
                tornado.ioloop.IOLoop.current().remove_timeout(session['sync_timeout'])
                session['sync_timeout'] = None

            session['sync_clients'].clear()
            session['action_sequence'] += 1
            seq_id = session['action_sequence']

            self.log_session(session, f"[SYNC_COMPLETE] All active in-game clients ready -> issued id #{seq_id}")
            self.broadcast(session, {"event": "sync_complete", "id": seq_id})

    def handle_sync_timeout(self, code):
        if is_shutting_down or code not in YDKJWebSocket.sessions:
            return
        session = YDKJWebSocket.sessions[code]
        session['sync_timeout'] = None
        session['sync_clients'].clear()
        session['action_sequence'] += 1
        seq_id = session['action_sequence']

        self.log_session(session, f"[SYNC_TIMEOUT] Safety 20s reached -> forced sync_complete #{seq_id}")
        self.broadcast(session, {"event": "sync_complete", "id": seq_id})

    def check_game_deadlock(self, session):
        if session.get('status') != 'in_game':
            return
        active_configured_ids = {c['client_id'] for c in session.get('game_players', [])}
        connected_active_ids = {
            info['client_id'] for info in session['clients'].values()
            if info.get('client_id') in active_configured_ids and not info.get('spectator')
        }
        in_game_ids = connected_active_ids & session.get('active_in_game_players', set())

        # Si des joueurs actifs sont connectés mais qu'aucun n'est en jeu
        if connected_active_ids and not in_game_ids:
            disconnected_active_ids = {
                cid for cid in session.get('disconnected_clients', {})
                if cid in active_configured_ids
            }
            # Si plus aucun joueur actif n'est déconnecté (tous sont connectés et en attente)
            if not disconnected_active_ids:
                if options.deadlock_recovery and session.get('last_game_state'):
                    self.recover_from_deadlock(session)
                else:
                    self.abandon_session(session, "La partie a été interrompue car tous les joueurs actifs sont en attente de synchronisation.")
            elif not session.get('reconnect_deadlock_timer'):
                code = session['code']
                session['reconnect_deadlock_timer'] = tornado.ioloop.IOLoop.current().call_later(
                    15.0, lambda: self.handle_reconnect_deadlock_timeout(code)
                )

    def abandon_session(self, session, reason):
        code = session['code']
        self.log_session(session, f"[SESSION_ABANDONED] {reason}")
        self.broadcast(session, {
            "event": "session_closed",
            "reason": reason
        })
        for sock in list(session['clients'].keys()):
            try:
                sock.close(code=1000, reason="Session abandoned")
            except Exception:
                pass
        self.destroy_session(code)

    def recover_from_deadlock(self, session):
        last_state = session.get('last_game_state')
        if not last_state:
            self.log_session(session, "[DEADLOCK_RECOVERY_FAILED] No checkpoint (last_game_state) available. Closing session.")
            self.abandon_session(session, "La partie a été interrompue car tous les joueurs actifs sont en attente de synchronisation et aucun point de sauvegarde n'est disponible.")
            return

        mode_label = last_state.get('modedata', {}).get('mode', 'unknown')
        self.log_session(session, f"[DEADLOCK_RECOVERY] Restoring checkpoint for mode '{mode_label}'. Broadcasting last_game_state to all clients.")

        # Réinitialiser la barrière de synchronisation et les timers
        session['sync_clients'].clear()
        if session.get('sync_timeout'):
            tornado.ioloop.IOLoop.current().remove_timeout(session['sync_timeout'])
            session['sync_timeout'] = None
        if session.get('reconnect_deadlock_timer'):
            tornado.ioloop.IOLoop.current().remove_timeout(session['reconnect_deadlock_timer'])
            session['reconnect_deadlock_timer'] = None

        # Reclasser tous les joueurs actifs connectés comme en jeu
        connected_players = {
            info['client_id'] for info in session['clients'].values()
            if not info.get('spectator') and (info.get('nick') or "").strip()
        }
        session.setdefault('active_in_game_players', set()).update(connected_players)
        session.setdefault('waiting_players', set()).difference_update(connected_players)

        # Diffuser le dernier checkpoint game_state à tous les clients
        self.broadcast(session, last_state)

    def handle_reconnect_deadlock_timeout(self, code):
        if is_shutting_down or code not in YDKJWebSocket.sessions:
            return
        session = YDKJWebSocket.sessions[code]
        session['reconnect_deadlock_timer'] = None
        if session.get('status') == 'in_game':
            active_configured_ids = {c['client_id'] for c in session.get('game_players', [])}
            connected_active_ids = {
                info['client_id'] for info in session['clients'].values()
                if info.get('client_id') in active_configured_ids and not info.get('spectator')
            }
            in_game_ids = connected_active_ids & session.get('active_in_game_players', set())
            if connected_active_ids and not in_game_ids:
                if options.deadlock_recovery and session.get('last_game_state'):
                    self.recover_from_deadlock(session)
                else:
                    self.abandon_session(session, "La partie a été interrompue car aucun joueur actif en jeu n'a pu poursuivre la partie.")

    def leave_session(self, intentional=False):
        if not self.session_code or self.session_code not in YDKJWebSocket.sessions:
            return

        session = YDKJWebSocket.sessions[self.session_code]
        if self in session['clients']:
            info = session['clients'].pop(self)
            client_id = info.get('client_id')
            action_label = "[CLIENT_LEFT]" if intentional else "[CLIENT_DISCONNECTED]"
            self.log_session(session, f"{action_label} client_id: {client_id} (nick: \"{info.get('nick')}\")")

            if not intentional:
                session.setdefault('disconnected_clients', {})[client_id] = info

            if session.get('status') == 'in_game':
                session.setdefault('active_in_game_players', set()).discard(client_id)
                session.setdefault('waiting_players', set()).discard(client_id)

            # Si l'hôte se déconnecte pendant le lobby : armer le timer de reconnexion de 10s
            if info.get('is_host') and session.get('status') == 'lobby':
                self.log_session(session, f"[HOST_DISCONNECTED] Host (client_id: {client_id}) disconnected from lobby. 10s grace timer armed.")
                code = self.session_code
                if session.get('host_disconnect_timer'):
                    tornado.ioloop.IOLoop.current().remove_timeout(session['host_disconnect_timer'])
                session['host_disconnect_timer'] = tornado.ioloop.IOLoop.current().call_later(
                    10.0, lambda: self.handle_host_disconnect_timeout(code)
                )
            else:
                if session['clients']:
                    if session.get('status') == 'lobby':
                        self.send_lobby_state(session)
                    self.check_sync_barrier(session)

            if not session['clients'] and not session.get('disconnected_clients'):
                # Tous les clients sont partis : délai de grâce de 60s
                self.log_session(session, "[SESSION_EMPTY] All clients disconnected. Grace timer 60s armed.")
                code = self.session_code
                session['grace_timer'] = tornado.ioloop.IOLoop.current().call_later(
                    60.0, lambda: self.destroy_session(code)
                )

        self.session_code = None
        self.client_info = None

    def handle_host_disconnect_timeout(self, code):
        if is_shutting_down or code not in YDKJWebSocket.sessions:
            return
        session = YDKJWebSocket.sessions[code]
        session['host_disconnect_timer'] = None
        self.log_session(session, f"[HOST_DISCONNECT_TIMEOUT] Host did not reconnect within 10s. Closing session.")
        close_payload = json.dumps({
            "event": "session_closed",
            "reason": "L'hôte a quitté la partie, la session a été fermée."
        })
        for sock in list(session['clients'].keys()):
            try:
                sock.write_message(close_payload)
                sock.close(code=1000, reason="Host disconnected")
            except Exception:
                pass
            sock.session_code = None
            sock.client_info = None
        session['clients'].clear()
        session.get('disconnected_clients', {}).clear()
        self.destroy_session(code)

    def destroy_session(self, code):
        if is_shutting_down or code not in YDKJWebSocket.sessions:
            return
        session = YDKJWebSocket.sessions[code]
        if not session['clients']:
            self.log_session(session, f"[SESSION_DESTROYED] Session {code} closed. Total actions: {session['action_sequence']}.")
            if session.get('log_file') and not session['log_file'].closed:
                try:
                    session['log_file'].close()
                except Exception:
                    pass
            if session.get('replay_file') and not session['replay_file'].closed:
                try:
                    session['replay_file'].close()
                except Exception:
                    pass
            YDKJWebSocket.sessions.pop(code, None)

    def on_message(self, message):
        if is_shutting_down:
            return

        session = YDKJWebSocket.sessions.get(self.session_code) if self.session_code else None
        client_info = session['clients'].get(self) if (session and session.get('clients')) else self.client_info
        client_id_label = f"client_id: {client_info.get('client_id')}" if client_info else "unbound client"

        try:
            msg = json.loads(message)
        except Exception as e:
            self.log_session(session, f"[MALFORMED_MESSAGE] from {client_id_label} (invalid JSON): {repr(message)} - Error: {e}")
            return

        event = msg.get('event')
        if not event:
            self.log_session(session, f"[ABNORMAL_MESSAGE] from {client_id_label} (missing 'event' field): {repr(msg)}")
            return

        # Journaliser tout message reçu
        msg_preview = repr(msg) if len(repr(msg)) < 250 else (repr(msg)[:247] + "...")
        self.log_session(session, f"[MSG_RECV] from {client_id_label} -> event: '{event}', content: {msg_preview}")

        if event == 'ping':
            self.write_message(json.dumps({"event": "pong"}))
            return

        if event == 'create_session':
            self.create_session(msg)
            return

        if event == 'join_session':
            self.join_session(msg.get('session'))
            return

        if event == 'game_init':
            self.game_init(msg)
            return

        if event == 'find_public_session':
            self.find_public_session()
            return

        if event == 'leave_session':
            self.leave_session(intentional=True)
            return

        if not self.session_code or self.session_code not in YDKJWebSocket.sessions:
            return

        session = YDKJWebSocket.sessions[self.session_code]
        client_info = session['clients'].get(self)
        if not client_info:
            return

        client_id = client_info['client_id']

        if event == 'update_nick':
            if session.get('status') != 'lobby':
                return
            nick = (msg.get('nick') or "").strip()
            client_info['nick'] = nick
            self.log_session(session, f"[NICK_UPDATED] client_id: {client_id} -> \"{nick}\"")
            self.send_lobby_state(session)
            return

        if event == 'update_lobby':
            if session.get('status') != 'lobby':
                return
            if client_info.get('is_host'):
                participants = set(msg.get('participants', [client_id]))
                for sock, info in session['clients'].items():
                    info['spectator'] = (info['client_id'] not in participants)
                nb_q = msg.get('nb_questions', 7)
                session['nb_questions'] = nb_q
                if 'public' in msg:
                    session['public'] = bool(msg['public'])
                self.log_session(session, f"[LOBBY_CONFIG] Participants: {list(participants)}, Questions: {nb_q}, Public: {session.get('public')}")
                self.send_lobby_state(session)
            return

        if event == 'kick_client':
            if session.get('status') != 'lobby':
                return
            if not client_info.get('is_host'):
                return
            target_id = msg.get('client_id')
            if not target_id or target_id == client_id:
                return

            target_sock = None
            target_info = None
            for sock, info in session['clients'].items():
                if info.get('client_id') == target_id:
                    target_sock = sock
                    target_info = info
                    break

            if target_sock:
                nick_name = target_info.get('nick', '')
                self.log_session(session, f"[CLIENT_KICKED] client_id: {target_id} (nick: \"{nick_name}\") kicked by host")
                try:
                    target_sock.write_message(json.dumps({
                        "event": "kicked",
                        "message": "Vous avez été expulsé de la session par l'hôte"
                    }))
                    target_sock.close(code=1000, reason="Kicked by host")
                except Exception:
                    pass
                session['clients'].pop(target_sock, None)
                target_sock.session_code = None
                target_sock.client_info = None
                self.send_lobby_state(session)
            return

        if event == 'start_countdown':
            if session.get('status') != 'lobby':
                return
            if client_info.get('is_host'):
                self.log_session(session, f"[COUNTDOWN_START] by host client_id: {client_id}")
                self.broadcast(session, {"event": "countdown_started"})
            return

        if event == 'cancel_countdown':
            if session.get('status') != 'lobby':
                return
            if client_info.get('is_host'):
                self.log_session(session, f"[COUNTDOWN_CANCELLED] by host client_id: {client_id}")
                self.broadcast(session, {"event": "countdown_cancelled"})
            return

        if event == 'game_start':
            if client_info.get('is_host') and session.get('status') == 'lobby':
                session['status'] = 'in_game'
                session['last_game_state'] = None

                # Le serveur conserve les informations des joueurs actifs depuis le lobby pour son suivi interne (barrière sync)
                session['game_players'] = [
                    info for info in session['clients'].values()
                    if not info.get('spectator') and (info.get('nick') or "").strip()
                ]
                if not session['game_players']:
                    session['game_players'] = [client_info]

                session['active_in_game_players'] = {c['client_id'] for c in session['game_players']}
                session['waiting_players'] = set()

                # Stockage du paquet d'initialisation envoyé par l'hôte, pour les futurs clients
                session['game_start_packet'] = msg

                # Initialisation de l'enregistrement du replay JSON
                log_dir = options.log_dir
                replay_path = os.path.join(log_dir, f"session_{session['code']}_replay.json")
                try:
                    session['replay_file'] = open(replay_path, "a", encoding="utf-8")
                    session['is_recording_replay'] = True
                except Exception as e:
                    print(f"JSON replay creation error: {e}")

                self.log_session(session, f"[GAME_START] Session switched to in_game by host. Packet: {msg}")

                # Envoi tel quel à tous les clients
                self.broadcast(session, msg)
            return

        if event == 'game_state':
            if session.get('status') == 'in_game':
                session['last_game_state'] = msg

                # Tous les joueurs connectés de la partie reçoivent ce game_state et entrent en jeu
                connected_players = {
                    info['client_id'] for info in session['clients'].values()
                    if not info.get('spectator') and (info.get('nick') or "").strip()
                }
                session.setdefault('active_in_game_players', set()).update(connected_players)
                session.setdefault('waiting_players', set()).difference_update(connected_players)
                if session.get('reconnect_deadlock_timer'):
                    tornado.ioloop.IOLoop.current().remove_timeout(session['reconnect_deadlock_timer'])
                    session['reconnect_deadlock_timer'] = None

                mode_label = msg.get('modedata', {}).get('mode', 'unknown')
                players_summary = json.dumps(msg.get('players', []), ensure_ascii=False)
                self.log_session(session, f"[GAME_STATE] from client_id {client_id}: mode '{mode_label}', players: {players_summary}")
                self.broadcast(session, msg)
            return

        # Traitement des actions de jeu (postaction)
        if event == 'postaction':
            if session.get('status') != 'in_game':
                # Pas de gestion des actions ou du sync tant que la partie n'a pas commencé
                return

            data = msg.get('data', {})
            action_name = data.get('action')

            # Cas particulier : Seule action interceptée et traitée par le serveur = 'sync'
            if action_name == 'sync':
                if client_info.get('spectator'):
                    # Ignorer purement et simplement les messages sync émis par un spectateur
                    return

                session['sync_clients'].add(client_id)
                nb_ready = len(session['sync_clients'])
                if session.get('game_players'):
                    nb_total = len(session['game_players'])
                else:
                    nb_total = len([c for c in session['clients'].values() if not c.get('spectator')])
                self.log_session(session, f"[SYNC_WAIT] client_id: {client_id} ready ({nb_ready}/{nb_total})")

                if not session.get('sync_timeout'):
                    code = session['code']
                    session['sync_timeout'] = tornado.ioloop.IOLoop.current().call_later(
                        20.0, lambda: self.handle_sync_timeout(code)
                    )

                self.check_sync_barrier(session)
                return

            # Toutes les autres actions : relais aveugle immédiat
            session['action_sequence'] += 1
            action_id = session['action_sequence']

            # Sérialisation propre de l'action dans le fichier de log
            try:
                data_preview = json.dumps(data, ensure_ascii=False)
            except Exception:
                data_preview = str(data)

            self.log_session(session, f"[ACTION #{action_id}] from client_id: {client_id} -> {data_preview}")

            self.broadcast(session, {
                "event": "action",
                "id": action_id,
                "client_id": client_id,
                "data": data
            })
            return

        # Événement inattendu ou non géré par le protocole
        self.log_session(session, f"[UNHANDLED_EVENT] from client_id: {client_id} -> unhandled event '{event}': {repr(msg)}")

    def on_close(self):
        YDKJWebSocket.all_sockets.discard(self)
        if is_shutting_down:
            return
        self.leave_session()


def shutdown(server, reason="Server shutdown"):
    global is_shutting_down
    if is_shutting_down:
        return
    is_shutting_down = True

    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S.%f")[:-3]
    print(f"\n[{now_str}] [SERVER_SHUTDOWN] {reason}")
    print(f"[{now_str}] Closing connections, sessions and log files...")

    # 1. Arrêter d'accepter de nouvelles connexions
    if server:
        try:
            server.stop()
        except Exception as e:
            print(f"Server stop error: {e}")

    # 2. Clôturer chaque session et son fichier de log
    for code, session in list(YDKJWebSocket.sessions.items()):
        # Annuler les timers actifs
        if session.get('sync_timeout'):
            try:
                tornado.ioloop.IOLoop.current().remove_timeout(session['sync_timeout'])
            except Exception:
                pass
            session['sync_timeout'] = None

        if session.get('grace_timer'):
            try:
                tornado.ioloop.IOLoop.current().remove_timeout(session['grace_timer'])
            except Exception:
                pass
            session['grace_timer'] = None

        if session.get('host_disconnect_timer'):
            try:
                tornado.ioloop.IOLoop.current().remove_timeout(session['host_disconnect_timer'])
            except Exception:
                pass
            session['host_disconnect_timer'] = None

        # Écriture dans le fichier de log de la session
        log_file = session.get('log_file')
        if log_file and not log_file.closed:
            try:
                log_file.write(f"[{now_str}] [SERVER_SHUTDOWN] {reason}\n")
                log_file.flush()
                log_file.close()
            except Exception as e:
                print(f"Error closing log {code}: {e}")
            session['log_file'] = None

        replay_file = session.get('replay_file')
        if replay_file and not replay_file.closed:
            try:
                replay_file.flush()
                replay_file.close()
            except Exception as e:
                print(f"Error closing replay {code}: {e}")
            session['replay_file'] = None

    # 3. Notifier et fermer toutes les sockets ouvertes (message générique unique pour les clients)
    close_payload = json.dumps({"event": "server_shutdown", "message": "Le serveur s'est arrêté"})
    for sock in list(YDKJWebSocket.all_sockets):
        try:
            sock.write_message(close_payload)
            sock.close(code=1001, reason="Server stopped")
        except Exception:
            pass

    YDKJWebSocket.sessions.clear()
    YDKJWebSocket.all_sockets.clear()

    # 4. Arrêt propre de l'IOLoop Tornado
    io_loop = tornado.ioloop.IOLoop.current()

    def stop_ioloop():
        try:
            io_loop.stop()
        except Exception:
            pass
        print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S.%f')[:-3]}] Server shut down cleanly.")

    try:
        asyncio_loop = getattr(io_loop, 'asyncio_loop', None)
        if asyncio_loop and asyncio_loop.is_running():
            # Court délai (150ms) pour purger les buffers réseau TCP des messages de fermeture
            io_loop.call_later(0.15, stop_ioloop)
        else:
            stop_ioloop()
    except Exception:
        stop_ioloop()


def main():
    parse_command_line()
    os.makedirs(options.log_dir, exist_ok=True)
    port = parse_port(options.port)

    app = tornado.web.Application([
        (r'/YDKJ/ws', YDKJWebSocket),
    ])

    server = tornado.httpserver.HTTPServer(app)
    if port == 8889:
        server.listen(port)
    else:
        server.listen(port, '127.0.0.1')
    print(f"YDKJ WebSocket server listening on port {port}")
    print(f"Log directory: {os.path.abspath(options.log_dir)}")

    def sig_handler(sig, frame):
        global is_shutting_down
        if is_shutting_down:
            print("\nImmediate forced shutdown.")
            os._exit(1)

        if sig == signal.SIGINT:
            reason = "Keyboard interrupt (Ctrl-C)"
        elif sig == signal.SIGTERM:
            reason = "Service termination (systemctl / SIGTERM)"
        else:
            reason = f"Signal termination ({sig})"

        try:
            tornado.ioloop.IOLoop.current().add_callback_from_signal(lambda: shutdown(server, reason))
        except Exception:
            shutdown(server, reason)

    signal.signal(signal.SIGINT, sig_handler)
    signal.signal(signal.SIGTERM, sig_handler)

    try:
        tornado.ioloop.IOLoop.current().start()
    except KeyboardInterrupt:
        shutdown(server, "Keyboard interrupt (Ctrl-C)")


if __name__ == '__main__':
    main()

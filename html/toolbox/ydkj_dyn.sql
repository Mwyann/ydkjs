-- phpMyAdmin SQL Dump
-- version 4.6.6deb5
-- https://www.phpmyadmin.net/
--
-- Client :  localhost:3306
-- Généré le :  Lun 21 Janvier 2019 à 18:40
-- Version du serveur :  5.7.24-0ubuntu0.18.04.1
-- Version de PHP :  7.2.10-0ubuntu0.18.04.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `ydkjfr_dyn`
--

-- --------------------------------------------------------

--
-- Structure de la table `accounts`
--

DROP TABLE IF EXISTS `accounts`;
CREATE TABLE `accounts` (
  `id` int(7) NOT NULL,
  `login` varchar(40) NOT NULL,
  `password` varchar(40) NOT NULL,
  `mail` varchar(64) NOT NULL,
  `nickname` varchar(40) NOT NULL,
  `lastlogin` datetime NOT NULL,
  `gamesplayed` int(7) NOT NULL DEFAULT '0',
  `currentsession` int(7) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `actions`
--

DROP TABLE IF EXISTS `actions`;
CREATE TABLE `actions` (
  `action_id` int(7) NOT NULL,
  `session_id` int(7) NOT NULL,
  `player_id` int(11) NOT NULL,
  `dateaction` datetime NOT NULL,
  `actiondata` text NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `errors`
--

DROP TABLE IF EXISTS `errors`;
CREATE TABLE `errors` (
  `id` int(7) NOT NULL,
  `now` datetime NOT NULL,
  `ip` varchar(15) NOT NULL,
  `msg` text NOT NULL,
  `url` varchar(200) NOT NULL,
  `line` int(7) NOT NULL,
  `col` int(7) NOT NULL,
  `error` text NOT NULL,
  `stack` text NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `invitations`
--

DROP TABLE IF EXISTS `invitations`;
CREATE TABLE `invitations` (
  `uid` varchar(40) NOT NULL,
  `datecreated` datetime NOT NULL,
  `dateused` datetime DEFAULT NULL,
  `godfather` int(7) NOT NULL,
  `godson` int(7) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `players`
--

DROP TABLE IF EXISTS `players`;
CREATE TABLE `players` (
  `id` int(11) NOT NULL,
  `session_id` int(11) NOT NULL DEFAULT '0',
  `ip` varchar(15) NOT NULL,
  `last_ping` datetime NOT NULL,
  `spectator` tinyint(1) NOT NULL DEFAULT '1',
  `nicknames` varchar(64) NOT NULL DEFAULT ''
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
CREATE TABLE `sessions` (
  `id` int(11) NOT NULL,
  `datecreated` datetime NOT NULL,
  `player_host` int(11) NOT NULL,
  `public` tinyint(1) NOT NULL DEFAULT '0',
  `lastupdate` datetime DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0 = Créée, 1 = Va bientôt démarrer, 2 = Démarrée',
  `nbquestions` tinyint(2) NOT NULL DEFAULT '7',
  `nbplayers` tinyint(1) NOT NULL DEFAULT '0',
  `player1` int(11) DEFAULT NULL,
  `nick1` varchar(40) DEFAULT NULL,
  `score1` int(7) DEFAULT '0',
  `player2` int(11) DEFAULT NULL,
  `nick2` varchar(40) DEFAULT NULL,
  `score2` int(7) DEFAULT '0',
  `player3` int(11) DEFAULT NULL,
  `nick3` varchar(40) DEFAULT NULL,
  `score3` int(7) DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Index pour les tables exportées
--

--
-- Index pour la table `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `mail` (`login`);

--
-- Index pour la table `actions`
--
ALTER TABLE `actions`
  ADD PRIMARY KEY (`action_id`);

--
-- Index pour la table `errors`
--
ALTER TABLE `errors`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `invitations`
--
ALTER TABLE `invitations`
  ADD PRIMARY KEY (`uid`);

--
-- Index pour la table `players`
--
ALTER TABLE `players`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables exportées
--

--
-- AUTO_INCREMENT pour la table `accounts`
--
ALTER TABLE `accounts`
  MODIFY `id` int(7) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;
--
-- AUTO_INCREMENT pour la table `actions`
--
ALTER TABLE `actions`
  MODIFY `action_id` int(7) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=340176;
--
-- AUTO_INCREMENT pour la table `errors`
--
ALTER TABLE `errors`
  MODIFY `id` int(7) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4805;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

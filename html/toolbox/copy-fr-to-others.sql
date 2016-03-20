-- SELECT * FROM ydkjfr_sta.resani a, ydkjuk_sta.resani b WHERE a.grp = b.grp AND a.name = b.name AND (a.`framestart` != b.`framestart` OR a.`framestop` != b.`framestop`)

-- ANI

DELETE FROM ydkjuk_sta.resani WHERE NOT ((grp = 'Question' AND name LIKE 'BGQuestion%') OR (grp = 'Intro' AND name LIKE 'IntroPreTitle%') OR (grp = 'Intro' AND name LIKE 'Player_'));
INSERT INTO ydkjuk_sta.resani SELECT * FROM ydkjfr_sta.resani WHERE NOT ((grp = 'Question' AND name LIKE 'BGQuestion%') OR (grp = 'Intro' AND name LIKE 'IntroPreTitle%') OR (grp = 'Intro' AND name LIKE 'Player_'));

DELETE FROM ydkjde_sta.resani WHERE NOT ((grp = 'Question' AND name LIKE 'BGQuestion%') OR (grp = 'Intro' AND name LIKE 'IntroPreTitle%') OR (grp = 'Intro' AND name LIKE 'Player_'));
INSERT INTO ydkjde_sta.resani SELECT * FROM ydkjfr_sta.resani WHERE NOT ((grp = 'Question' AND name LIKE 'BGQuestion%') OR (grp = 'Intro' AND name LIKE 'IntroPreTitle%') OR (grp = 'Intro' AND name LIKE 'Player_'));

-- SND

TRUNCATE ydkjuk_sta.ressnd;
INSERT INTO ydkjuk_sta.ressnd SELECT * FROM ydkjfr_sta.ressnd;

-- http://192.168.0.110/uk/toolbox/scan-snd.php

TRUNCATE ydkjde_sta.ressnd;
INSERT INTO ydkjde_sta.ressnd SELECT * FROM ydkjfr_sta.ressnd;

-- http://192.168.0.110/de/toolbox/scan-snd.php



-- AUTRE MANIERE DE FAIRE, en partant des données de ydkjfr_sta :

-- ydkjde_sta :

UPDATE resani SET framestart = 202 WHERE resid = 3500 AND framestart = 291;
UPDATE resani SET framestart = 42 WHERE resid = -2010 AND framestart = 56;
UPDATE resani SET framestart = 55 WHERE resid = -2020 AND framestart = 56;
UPDATE resani SET framestart = 70 WHERE resid = -2030 AND framestart = 55;
UPDATE resani SET framestart = 75 WHERE resid = -1010 AND framestart = 62;
UPDATE resani SET framestart = 61 WHERE resid = -1020 AND framestart = 65;
UPDATE resani SET framestart = 65 WHERE resid = -1030 AND framestart = 59;
UPDATE resani SET framestart = 48 WHERE resid = -3010 AND framestart = 57;
UPDATE resani SET framestart = 45 WHERE resid = -3020 AND framestart = 67;
UPDATE resani SET framestart = 92 WHERE resid = -3030 AND framestart = 66;
UPDATE resani SET framestart = 150 WHERE resid = -1040 AND framestart = 60;
UPDATE resani SET framestart = 62 WHERE resid = -1050 AND framestart = 77;
UPDATE resani SET framestart = 70 WHERE resid = -1060 AND framestart = 58;
UPDATE resani SET framestart = 80 WHERE resid = -1070 AND framestart = 64;
UPDATE resani SET framestart = 70 WHERE resid = -1080 AND framestart = 65;
UPDATE resani SET framestart = 73 WHERE resid = -1090 AND framestart = 64;
UPDATE resani SET framestart = 81 WHERE resid = -1100 AND framestart = 65;
UPDATE resani SET framestart = 59 WHERE resid = -2040 AND framestart = 55;
UPDATE resani SET framestart = 61 WHERE resid = -2050 AND framestart = 52;
UPDATE resani SET framestart = 53 WHERE resid = -2060 AND framestart = 55;
UPDATE resani SET framestart = 58 WHERE resid = -2070 AND framestart = 54;
UPDATE resani SET framestart = 47 WHERE resid = -2080 AND framestart = 56;
UPDATE resani SET framestart = 66 WHERE resid = -2090 AND framestart = 52;
UPDATE resani SET framestart = 52 WHERE resid = -2100 AND framestart = 62;
UPDATE resani SET framestart = 50 WHERE resid = -3040 AND framestart = 59;
UPDATE resani SET framestart = 47 WHERE resid = -3050 AND framestart = 73;
UPDATE resani SET framestart = 75 WHERE resid = -3060 AND framestart = 62;
UPDATE resani SET framestart = 263 WHERE resid = 3500 AND framestart = 352;
UPDATE resani SET framestart = 270 WHERE resid = 3500 AND framestart = 359;
UPDATE resani SET framestart = 324 WHERE resid = 3500 AND framestart = 413;
UPDATE resani SET framestart = 384 WHERE resid = 3500 AND framestart = 473;
UPDATE resani SET framestart = 435 WHERE resid = 3500 AND framestart = 524;
UPDATE resani SET framestart = 487 WHERE resid = 3500 AND framestart = 576;
UPDATE resani SET framestart = 222 WHERE resid = 3500 AND framestart = 311;
UPDATE resani SET framestart = 446 WHERE resid = 8410 AND framestart = 448;
UPDATE resani SET framestart = 471 WHERE resid = 8410 AND framestart = 473;

-- ydkjuk_sta :

UPDATE resani SET framestart = 282 WHERE resid = 3500 AND framestart = 291;
UPDATE resani SET framestart = 58 WHERE resid = -2010 AND framestart = 56;
UPDATE resani SET framestart = 71 WHERE resid = -2020 AND framestart = 56;
UPDATE resani SET framestart = 46 WHERE resid = -2030 AND framestart = 55;
UPDATE resani SET framestart = 48 WHERE resid = -1010 AND framestart = 62;
UPDATE resani SET framestart = 41 WHERE resid = -1020 AND framestart = 65;
UPDATE resani SET framestart = 35 WHERE resid = -1030 AND framestart = 59;
UPDATE resani SET framestart = 47 WHERE resid = -3010 AND framestart = 57;
UPDATE resani SET framestart = 43 WHERE resid = -3020 AND framestart = 67;
UPDATE resani SET framestart = 104 WHERE resid = -3030 AND framestart = 66;
UPDATE resani SET framestart = 67 WHERE resid = -1040 AND framestart = 60;
UPDATE resani SET framestart = 54 WHERE resid = -1050 AND framestart = 77;
UPDATE resani SET framestart = 53 WHERE resid = -1060 AND framestart = 58;
UPDATE resani SET framestart = 54 WHERE resid = -1070 AND framestart = 64;
UPDATE resani SET framestart = 42 WHERE resid = -1090 AND framestart = 64;
UPDATE resani SET framestart = 65 WHERE resid = -2040 AND framestart = 55;
UPDATE resani SET framestart = 42 WHERE resid = -2050 AND framestart = 52;
UPDATE resani SET framestart = 77 WHERE resid = -2060 AND framestart = 55;
UPDATE resani SET framestart = 57 WHERE resid = -2070 AND framestart = 54;
UPDATE resani SET framestart = 53 WHERE resid = -2080 AND framestart = 56;
UPDATE resani SET framestart = 51 WHERE resid = -2090 AND framestart = 52;
UPDATE resani SET framestart = 59 WHERE resid = -2100 AND framestart = 62;
UPDATE resani SET framestart = 58 WHERE resid = -3040 AND framestart = 59;
UPDATE resani SET framestart = 71 WHERE resid = -3050 AND framestart = 73;
UPDATE resani SET framestart = 50 WHERE resid = -3060 AND framestart = 62;
UPDATE resani SET framestart = 342 WHERE resid = 3500 AND framestart = 352;
UPDATE resani SET framestart = 349 WHERE resid = 3500 AND framestart = 359;
UPDATE resani SET framestart = 403 WHERE resid = 3500 AND framestart = 413;
UPDATE resani SET framestart = 463 WHERE resid = 3500 AND framestart = 473;
UPDATE resani SET framestart = 514 WHERE resid = 3500 AND framestart = 524;
UPDATE resani SET framestart = 566 WHERE resid = 3500 AND framestart = 576;
UPDATE resani SET framestart = 302 WHERE resid = 3500 AND framestart = 311;
UPDATE resani SET framestart = 472 WHERE resid = 8410 AND framestart = 473;

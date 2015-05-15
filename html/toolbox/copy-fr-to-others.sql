
-- SELECT * FROM ydkjfr_sta.resani a, ydkjuk_sta.resani b WHERE a.grp = b.grp AND a.name = b.name AND (a.`framestart` != b.`framestart` OR a.`framestop` != b.`framestop`)

-- ANI

DELETE FROM ydkjuk_sta.resani WHERE NOT ((grp = 'Question' AND name LIKE 'BGQuestion%') OR (grp = 'Intro' AND name LIKE 'IntroPreTitle%') OR (grp = 'Intro' AND name LIKE 'Player_on_'));
INSERT INTO ydkjuk_sta.resani SELECT * FROM ydkjfr_sta.resani WHERE NOT ((grp = 'Question' AND name LIKE 'BGQuestion%') OR (grp = 'Intro' AND name LIKE 'IntroPreTitle%') OR (grp = 'Intro' AND name LIKE 'Player_on_'));

DELETE FROM ydkjde_sta.resani WHERE NOT ((grp = 'Question' AND name LIKE 'BGQuestion%') OR (grp = 'Intro' AND name LIKE 'IntroPreTitle%') OR (grp = 'Intro' AND name LIKE 'Player_on_'));
INSERT INTO ydkjde_sta.resani SELECT * FROM ydkjfr_sta.resani WHERE NOT ((grp = 'Question' AND name LIKE 'BGQuestion%') OR (grp = 'Intro' AND name LIKE 'IntroPreTitle%') OR (grp = 'Intro' AND name LIKE 'Player_on_'));

-- SND

TRUNCATE ydkjuk_sta.ressnd;
INSERT INTO ydkjuk_sta.ressnd SELECT * FROM ydkjfr_sta.ressnd;

-- http://192.168.0.110/uk/toolbox/scan-snd.php

TRUNCATE ydkjde_sta.ressnd;
INSERT INTO ydkjde_sta.ressnd SELECT * FROM ydkjfr_sta.ressnd;

-- http://192.168.0.110/de/toolbox/scan-snd.php

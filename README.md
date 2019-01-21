# YDKJS

[https://www.ydkjs.eu/](https://www.ydkjs.eu/)

## Installation

You need the original CD or an ISO. Mount it or extract it.

Run the YDKJ Extractor, and on the bottom of the window, specify the path of the mounted/extracted CD content (root folder of the SRF files) in the "From" field, and an empty directory path where all the extracted content will be placed into the "To" field, and press "Convert all". This may take a while, so please be patient, and take the next steps while waiting.

Prepare your server, for example on Ubuntu 18.04 (here I use `mariadb-server`, but `mysql-server` works too of course):

```bash
sudo apt-get install apache2 mariadb-server php php-mysql ffmpeg
```

Copy the html folder into your web server. The game does not need to be in the DocumentRoot folder, so you can use subfolders if you wish. Protip: you can use git or svn to make future updates easier, for example:

```bash
svn co https://github.com/Mwyann/ydkjs.git/trunk/html ydkj
```

For now the data extraction should be done, so let's take care of it. Create a ``res-full`` folder into the root of the game's html folder and copy all the data that's been extracted into it. Move the two csv files `qhdr.csv` and `strings.csv` into the `toolbox` folder.

On the command line, go to the `res-full` folder, and run `sh ../toolbox/convertwav.sh`. This will convert all the `.wav` and `.aifc` sound files into `.mp3` and `.ogg` files, and if no error occured, it'll delete the original files which are not needed anymore. Again, this will take a while, so let's finish the rest of the installation while this runs.

Create two databases, here I'll name these `ydkjuk_sta` (for stable data) and `ydkjuk_dyn` (for dynamic data), and also a user which will have access to both databases (SELECT/INSERT/UPDATE/DELETE).

```sql
CREATE DATABASE ydkjuk_sta;
CREATE DATABASE ydkjuk_dyn;
GRANT SELECT, INSERT, UPDATE, DELETE ON ydkjuk_sta.* TO 'ydkj'@'localhost' IDENTIFIED BY 'password';
GRANT SELECT, INSERT, UPDATE, DELETE ON ydkjuk_dyn.* TO 'ydkj'@'localhost';
```

Import the file `toolbox/ydkjXX_sta_res.sql` into the sta database (replace XX with the version you want to import), and `toolbox/ydkj_dyn.sql` into the dyn database.

Copy `toolbox/mysql-data.sample.inc.php` into `toolbox/mysql-data.inc.php`, change its content to reflect the database configuration you choosed and make a copy of this file into `api/local/mysql-data.inc.php`. Also edit `api/local/config.inc.php` and change the `$VERSION` and `$GETsalt` variables accordingly.

On the command line, go to the `toolbox` folder, and run `php import-csv.php`. This will populate the empty `qhdr` and `strings` tables in the sta database. Now you can revoke unnecessary privileges to the sta database.

```sql
REVOKE INSERT, UPDATE, DELETE ON ydkjuk_sta.* FROM 'ydkj'@'localhost';
```

You may also want to deny direct access to the `res-full` folder, as this folder holds the game's data (the data will be served by a php script anyway). Create a `.htaccess` file in it and put `deny from all` in it.

When the sound conversion has finished, congratulations: installation is done! You can now use your browser to run the game.

## toolbox scripts

### import-csv.php

This script imports the `.csv` files created by the extractor tool. Those files contains the string and question data from the game. I didn't included those contents in the `.sql` exports for copyright reason.

### readres.html

I use this script to read the animations and find the frame position for every animations. You shouldn't deny access to the `res-full` folder to run this script.

### scan-snd.php

This script is used to update the `ressnd` table with the existing sound files. This script should only be used when new sound files are added to the table.


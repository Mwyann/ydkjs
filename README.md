# YDKJS

[https://www.ydkjs.eu/](https://www.ydkjs.eu/)

## Installation

You need the original CD, or an ISO, or a folder containing the files from the original game.

Install the following packets for your server: `python3-av php-sqlite`

Make a `res-full` folder in the `html` folder of this repo. Also edit `api/local/config.inc.php` and change the `$VERSION` and `$GETsalt` variables accordingly.

Run the Python extractor following this syntax:

`python3 YDKJ_extractor.py /path/to/source/ISO/YDKJ.iso /path/to/res-full/`

You may want to deny direct access to the `res-full` folder, as this folder holds the game's data (the data will be served by a php script anyway). Create a `.htaccess` file in it and put `deny from all` in it.

When the conversion is finished, congratulations: installation is done! You can now use your browser to run the game.

## Useful toolbox scripts

### readres.html

I use this script to read the animations and find the frame position for every animations. You shouldn't deny access to the `res-full` folder to run this script.

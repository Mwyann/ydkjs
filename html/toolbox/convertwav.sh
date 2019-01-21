# Uncomment to delete generated ogg and mp3 files before conversion
#find . \( -iname \*.ogg -o -iname \*.mp3 \) -delete

# If you're using avconv instead of ffmpeg, you can remplace ffmpeg with avconv.

find . -iname "*.wav" -exec bash -c 'ffmpeg -i "{}" -b 64k -f ogg -acodec libvorbis "`dirname "{}"`/`basename "{}" .wav`.ogg"' \; \
                      -exec bash -c 'ffmpeg -i "{}" -b 64k -f mp3 -acodec libmp3lame "`dirname "{}"`/`basename "{}" .wav`.mp3"' \; || exit 1

find . -iname "*.aifc" -exec bash -c 'ffmpeg -i "{}" -b 64k -f ogg -acodec libvorbis "`dirname "{}"`/`basename "{}" .aifc`.ogg"' \; \
                       -exec bash -c 'ffmpeg -i "{}" -b 64k -f mp3 -acodec libmp3lame "`dirname "{}"`/`basename "{}" .aifc`.mp3"' \; || exit 1

find . \( -iname \*.wav -o -iname \*.aifc \) -delete

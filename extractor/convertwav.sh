#find . -iname "*.ogg" -delete
#find . -iname "*.mp3" -delete

find . -iname "*.wav" -exec bash -c 'avconv -i "{}" -q 0 -f ogg -acodec libvorbis "`dirname "{}"`/`basename "{}" .wav`.ogg"' \; \
                      -exec bash -c 'avconv -i "{}" -q 0 -f mp3 -acodec libmp3lame "`dirname "{}"`/`basename "{}" .wav`.mp3"' \; || exit 1

find . -iname "*.aifc" -exec bash -c 'avconv -i "{}" -q 0 -f ogg -acodec libvorbis "`dirname "{}"`/`basename "{}" .aifc`.ogg"' \; \
                       -exec bash -c 'avconv -i "{}" -q 0 -f mp3 -acodec libmp3lame "`dirname "{}"`/`basename "{}" .aifc`.mp3"' \; || exit 1

find . -iname "*.wav" -delete
find . -iname "*.aifc" -delete

<!DOCTYPE html>
<html>
<head>
    <title></title>
    <script src="../js/jquery-3.5.1.min.js" type="text/javascript"></script>
    <script src="../js/howler.core.min.js" type="text/javascript"></script>
    <script type="application/javascript">
        $().ready(function() {
            var ago = [0,0];
            var urls = ['../res/5QDemo/Mb93/1', '../res/5QDemo/Mb95/1'];

            $('#worksok').click(function(){
                var url = urls[0];

                var a = new Howl({
                    src: [url+'.ogg', url+'.mp3'],
                    autoplay: false,
                    loop: false,
                    volume: 1,
                    onend: function() {
                        console.log('Finished!');
                    }
                });

                window.setTimeout(function() { // One setTimeout is okay...
                    a.play();
                },100);
            });

            $('#worksbad').click(function(){
                var url = urls[0];
                var res = jQuery('<audio />');
                res.appendTo('body');
                var a = res.get(0);
                if (a.canPlayType('audio/ogg')) res.append('<source />').children().last().attr('type','audio/ogg').attr('src',url+'.ogg');
                else if (a.canPlayType('audio/mpeg')) res.append('<source />').children().last().attr('type','audio/mpeg').attr('src',url+'.mp3');
                else {
                    res.append('<source />').children().last().attr('type','audio/ogg').attr('src',url+'.ogg');
                    res.append('<source />').children().last().attr('type','audio/mpeg').attr('src',url+'.mp3');
                }

                window.setTimeout(function() { // But two setTimeout is bad, as well as setInterval.
                    window.setTimeout(function() {
                        a.play();
                    },100);
                },100);
            });

            function playSound(url) {
                var res = YDKJaudiomanager.lease();
                if (!res) { // Try to GC ?
                    YDKJaudiomanager.garbagecollect();
                    res = YDKJaudiomanager.lease();
                    if (!res) return;
                }
                var a = res.get(0);
                if (a.canPlayType('audio/ogg')) res.append('<source />').children().last().attr('type','audio/ogg').attr('src',url+'.ogg');
                else if (a.canPlayType('audio/mpeg')) res.append('<source />').children().last().attr('type','audio/mpeg').attr('src',url+'.mp3');
                else {
                    res.append('<source />').children().last().attr('type','audio/ogg').attr('src',url+'.ogg');
                    res.append('<source />').children().last().attr('type','audio/mpeg').attr('src',url+'.mp3');
                }
                a.play();
            }

            // Demo loop (so it's not called from a user event)
            window.setInterval(function(){
                for(var i=0; i < ago.length; i++) {
                    if (ago[i]) {
                        ago[i] = 0;
                        playSound(urls[i]);
                    }
                }
            },100);

            $('#tryme').click(function(){
                ago[0] = 1;
                ago[1] = 1;
            });

            var loop = 0;

            $('#startloop').click(function() {

                var url = '../res-full/JACKSND1/Mc70/5';
                loop = new Howl({
                    src: [url+'.ogg', url+'.mp3'],
                    autoplay: false,
                    loop: true,
                    volume: 1,
                    onend: function() {
                        console.log('Finished!');
                    }
                });

                loop.play();
                loop.volume(0.5);
            });

            $('#stoploop').click(function() {
                if (loop) {
                    loop.stop();
                    loop.unload();
                    loop = 0;
                }
            });
            $('#enableaudio').css('display','none');
            $('#audioenabled').css('display','');
            $('#tryme').attr('value','Audio initialized immediately, should work right away (setInterval)');
        });
    </script>
</head>
<body>
<p>Simple examples:
    <input type="button" id="worksok" value="Works everywhere (click event)" />
    <input type="button" id="worksbad" value="Does not work on Chrome Android (setTimeout)" />
</p>
<p>Now it works:
    <input type="button" id="enableaudio" value="Do any user event to enable audio (click anywhere)" disabled="disabled" />
    <span id="audioenabled" style="display:none"><input type="button" id="tryme" value="Now that works everywhere (setInterval)!"/>
    <input type="button" id="startloop" value="Start loop"/> <input type="button" id="stoploop" value="Stop loop"/></span>
</p>
</body>
</html>
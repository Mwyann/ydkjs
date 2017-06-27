<!DOCTYPE html>
<html>
<head>
    <title></title>
    <script src="../js/jquery-3.2.1.min.js" type="text/javascript"></script>
    <script src="../js/AudioManager.js" type="text/javascript"></script>
    <script src="../js/common.js" type="text/javascript"></script>
    <script src="../js/SeamlessLoop.js" type="text/javascript"></script>
    <script type="application/javascript">
        var YDKJaudiomanager = new AudioManager();
        $().ready(function() {
            var ago = [0,0];
            var urls = ['../res/5QDemo/Mb93/1', '../res/5QDemo/Mb95/1'];

            $('#worksok').click(function(){
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

            var seamlessLoop = 0;

            $('#startloop').click(function() {
                seamlessLoop = new SeamlessLoop();
                seamlessLoop.addUri('../res-full/JACKSND1/Mc70/4',2420,1);
                seamlessLoop.start(1);
                seamlessLoop.volume(0.5);
            });

            $('#stoploop').click(function() {
                if (seamlessLoop) {
                    seamlessLoop.stop(1);
                    seamlessLoop.free();
                    seamlessLoop = 0;
                }
            });

            YDKJaudiomanager = new AudioManager();
            if (YDKJaudiomanager.init(32,function() {
                $('#enableaudio').css('display','none');
                $('#audioenabled').css('display','');
            })) $('#tryme').attr('value','Audio initialized immediately, should work right away (setInterval)');
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
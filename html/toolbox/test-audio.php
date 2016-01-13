<!DOCTYPE html>
<html>
<head>
    <title></title>
    <script src="../js/jquery-1.12.0.min.js" type="text/javascript"></script>
    <script type="application/javascript">
        function AudioManager() {}
        var audiomanager = 0;

        $().ready(function() {
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

            var aplay = [];
            var ago = [];

            function playSound(nb,url) {
                var res = aplay[nb];
                var a = res.get(0);
                if (a.canPlayType('audio/ogg')) res.append('<source />').children().last().attr('type','audio/ogg').attr('src',url+'.ogg');
                else if (a.canPlayType('audio/mpeg')) res.append('<source />').children().last().attr('type','audio/mpeg').attr('src',url+'.mp3');
                else {
                    res.append('<source />').children().last().attr('type','audio/ogg').attr('src',url+'.ogg');
                    res.append('<source />').children().last().attr('type','audio/mpeg').attr('src',url+'.mp3');
                }
                a.play();
            }

            // Solves chrome for android issue 178297 Require user gesture
            // https://code.google.com/p/chromium/issues/detail?id=178297
            // Fix based on code from http://blog.foolip.org/2014/02/10/media-playback-restrictions-in-blink/
            // and https://github.com/MauriceButler/simple-audio/blob/master/index.js
            AudioManager.prototype.init = function(numberofelems, callback) { // Returns true if could be initialized immediately, false if waiting for user input
                var thisAM = this;
                var createAudioStock = function() {
                    var audiostock = jQuery('#audiostock');
                    if (audiostock.length > 0) return; // Make sure this is executed only once
                    thisAM.audiostock = jQuery('<div />').attr('id','audiostock'); // Make the new stock
                    thisAM.audiostock.appendTo('body'); // Append it to the DOM
                    for(var i = 0; i < numberofelems; i++) { // Number of elements to initialize
                        var res = jQuery('<audio />'); // Create a new empty audio object
                        thisAM.audiostock.append(res); // Append it to the DOM
                        aplay.push(res); // Push it to the global var
                        ago.push(0);

                        // Play/pause element to activate it (required)
                        var a = res.get(0);
                        a.play();
                        a.pause();
                    }
                    if (callback) callback();
                };

                // Test if play() is ignored when not called from an input event handler (eventually)
                var mediaPlaybackRequiresUserGesture = function() {
                    var video = document.createElement('video');
                    video.play();
                    return video.paused;
                };

                // Set up listeners if needed
                if (mediaPlaybackRequiresUserGesture()) {
                    // React to said listeners
                    var removeBehaviorsRestrictions = function() {
                        window.removeEventListener('keydown', removeBehaviorsRestrictions);
                        window.removeEventListener('mousedown', removeBehaviorsRestrictions);
                        window.removeEventListener('touchstart', removeBehaviorsRestrictions);
                        createAudioStock();
                    };
                    window.addEventListener('keydown', removeBehaviorsRestrictions);
                    window.addEventListener('mousedown', removeBehaviorsRestrictions);
                    window.addEventListener('touchstart', removeBehaviorsRestrictions);
                    return false;
                } else {
                    createAudioStock(); // Or create stock immediately
                    if (callback) callback();
                    return true;
                }
            };

            // Demo loop (so it's not called from a user event)
            window.setInterval(function(){
                for(var i=0; i < aplay.length; i++) {
                    if (ago[i]) {
                        ago[i] = 0;
                        playSound(i,urls[i]);
                    }
                }
            },100);

            $('#tryme').click(function(){
                ago[0] = 1;
                ago[1] = 1;
            });

            audiomanager = new AudioManager();
            if (audiomanager.init(2,function() {
                $('#enableaudio').css('display','none');
                $('#tryme').css('display','');
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
    <input type="button" id="tryme" value="Now that works everywhere (setInterval)!" style="display:none"/>
</p>
</body>
</html>
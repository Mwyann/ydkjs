// Solves chrome for android issue 178297 Require user gesture
// https://code.google.com/p/chromium/issues/detail?id=178297
// Fix based on code from http://blog.foolip.org/2014/02/10/media-playback-restrictions-in-blink/
// and https://github.com/MauriceButler/simple-audio/blob/master/index.js

function AudioManager() {
    this.audiostock = 0;
    this.audioelements = [];
    this.leases = [];
}

$().ready(function() {
    AudioManager.prototype.init = function(numberofelems, callback) { // Returns true if could be initialized immediately, false if waiting for user input
        var thisAM = this;
        var createAudioStock = function() {
            var audiostock = jQuery('#audiostock');
            if (audiostock.length > 0) return false; // Make sure this is executed only once
            thisAM.audiostock = jQuery('<div />').attr('id','audiostock').css('display','none'); // Make the new stock
            thisAM.audiostock.appendTo('body'); // Append it to the DOM
            for(var i = 0; i < numberofelems; i++) { // Number of elements to initialize
                var res = jQuery('<audio />').attr('id','audioelement'+i).attr('preload','auto'); // Create a new empty audio object
                thisAM.audiostock.append(res); // Append it to the DOM
                thisAM.audioelements.push(res); // Push it to the global var
                thisAM.leases.push(0);

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
            return true;
        }
    };

    AudioManager.prototype.countfree = function() {
        var free = 0;
        for(var i = 0; i < this.audioelements.length; i++) if (!this.leases[i]) free++;
        return free;
    };

    AudioManager.prototype.lease = function() {
        for(var i = 0; i < this.audioelements.length; i++) if (!this.leases[i]) {
            this.leases[i] = 1;
            //console.log('AudioManager: New lease ('+i+'), '+this.countfree()+' free leases left');
            return this.audioelements[i];
        }
        console.log('AudioManager: Not enough audio elements available');
        return false; // No free audio element
    };

    AudioManager.prototype.release = function(elem) {
        var id = elem.attr('id');
        id = parseInt(id.replace('audioelement',''));
        this.audioelements[id].get(0).pause();
        this.audioelements[id].children().remove();
        this.audioelements[id].get(0).load(); // Needed to flush the previous sound
        this.leases[id] = 0;
        //console.log('AudioManager: Release ('+id+'), '+this.countfree()+' free leases left');
    };

    AudioManager.prototype.garbagecollect = function() {
        var freed = 0;
        for(var i = 0; i < this.audioelements.length; i++) if (this.leases[i]) {
            var elem = this.audioelements[i];
            var a = elem.get(0);
            if ((a.paused) || (a.ended)) {
                this.release(this.audioelements[i]);
                freed++;
            }
        }
        return freed;
    };

    AudioManager.prototype.free = function() {
        if (this.audiostock) {
            this.audioelements = [];
            this.leases = [];
            this.audiostock.remove();
            this.audiostock = 0;
        }
    };
});

/* global define:false */
/* global console:false */
define(function() {

    "use strict";

    var AutoDj = function(options) {
        this.bot = options.bot || options.bot && null;
        this.userid = options.userid || options.userid && null;
        this.stepUpMsg = options.stepUpMsg || options.stepUpMsg && null;

        this.imDjing = false;
        this.getDownAfterSong = false;

        console.log('autodj started with:');
        console.log(this.bot);
    };

    AutoDj.prototype.run = function() {

        var self = this;
        this.bot.on('roomChanged', function (data) {
            // Get the DJ count upon entering the room
            var djcount = data.room.metadata.djcount;
            // If DJ count less than or equal to 1, get on decks
            if (!djcount || djcount <= 1) {
                self.stepUp(data);
            }
        });

        this.bot.on('newsong', function (data) {
            // Check if bot is the new DJ when new song begins
            var djid = data.room.metadata.current_song.djid;
            if (djid === self.userid) {
                self.imDjing = true;
            }
        });

        this.bot.on('endsong', function (data) {
            // Update 'imDjing' when Bot's song ends
            if (data.room.metadata.current_song) {
                var djid = data.room.metadata.current_song.djid;
                if (djid === self.userid) {
                    self.imDjing = false;
                }
            }

            // If triggered to get down during Bot's song, step down now
            if (self.getDownAfterSong) {
                self.stepDown(data);
                self.getDownAfterSong = false;
            }
        });

        this.bot.on('add_dj', function () {
            // Check the DJ count when a new DJ steps up
            self.bot.roomInfo(false, function (data) {
                var djcount = data.room.metadata.djcount;
                // If there's enough DJ's now, bot steps down.
                if (djcount >= 3) {
                    // If bot's song is currently playing, let's have the bot step down when it ends
                    if (self.imDjing) {
                        self.getDownAfterSong = true;
                    } else {
                        self.stepDown(data);
                    }
                }
            });
        });

        this.bot.on('rem_dj', function () {
            // Checks DJ count when a DJ steps down
            self.bot.roomInfo(false, function (data) {
                var djcount = data.room.metadata.djcount;
                // If there aren't enough DJ's, bot steps up
                if (djcount <= 1) {
                    self.stepUp(data);
                }
            });
        });
    };

    AutoDj.prototype.stepUp = function() {
        this.bot.addDj();
        if (this.stepUpMsg) {
            this.bot.speak(this.stepUpMsg);
        }
        // juiceRoom(data);
    };

    AutoDj.prototype.stepDown = function() {
        this.bot.remDj();
        // juiceRoom(data);
    };


    return AutoDj;
});




/* global define:false */
/* global console:false */
define(function() {

    "use strict";

    var NO_SONG_LIMIT = -1;

    var SongLimit = function(options) {

        this.bot = options.bot || options.bot && null;
        this.cmd = options.cmd || options.cmd && null;

        this.songLimit = NO_SONG_LIMIT;
        this.djs = {};
    };

    SongLimit.prototype.run = function() {

        console.log('songlimit: started.') ;
        console.log('songlimit: limit = ' + this.songlimit);

        var self = this;
        this.bot.on('roomChanged', function (data) {
            var currentDjs = data.room.metadata.djs;
            for (var i = 0; i < currentDjs.length; i++) {
                self.djs[currentDjs[i]] = { nbSong: 0 };
            }
        });

        this.bot.on('add_dj', function (data) {
            self.djs[data.user[0].userid] = { nbSong: 0 };
        });

        this.bot.on('rem_dj', function (data) {
            delete self.djs[data.user[0].userid];
        });

        this.bot.on('endsong', function (data) {
            var djId = data.room.metadata.current_dj;
            if (self.djs[djId] && ++self.djs[djId].nbSong >= self.songsLimit) {
                if (this.songLimit !== NO_SONG_LIMIT) {
                    self.bot.remDj(djId, function(data) {
                        self.bot.speak('@' + data.user.name + ' - song limit reached, but please jump back up soon!');
                    });
                    delete self.djs[djId];
                }
            }
        });

        this.cmd.registerModCommand('songlimit', 'count|none', 'limit number of songs per dj',
            function(data, args) {
                if (!args || args.length < 1) {
                    return;
                }
                console.log('setting song limit: ' + args[0] + ' (' + data.senderid + ')');

                // apply new number - anything non-numeric just resets to no song.
                if (isNaN(args[0])) {
                    self.songLimit = NO_SONG_LIMIT;
                    self.bot.speak('note: song limit per dj has been removed');
                } else {
                    self.songLimit = args[0];
                    self.bot.speak('note: song limit per dj has been changed to: ' + self.songLimit);
                }

            });
    };

    return SongLimit;
});




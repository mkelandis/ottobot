/* global define:false */
/* global console:false */
define(function() {

    "use strict";

    var NO_SONG_LIMIT = 999;

    var SongLimit = function(options) {

        this.bot = options.bot || options.bot && null;
        this.cmd = options.cmd || options.cmd && null;
        this.userid = options.userid || options.userid && null;

        this.songLimit = NO_SONG_LIMIT;
        this.djs = {};
    };

    SongLimit.prototype.run = function() {

        console.log('songlimit: started.') ;
        console.log('songlimit: limit = ' + this.songlimit);

        var self = this;
        this.bot.on('roomChanged', function (data) {
            console.log('roomChanged');
            var currentDjs = data.room.metadata.djs;
            for (var i = 0; i < currentDjs.length; i++) {
                self.djs[currentDjs[i]] = { nbSong: 0 };
            }
            console.log(self.djs);
        });

        this.bot.on('add_dj', function (data) {
            console.log('add');
            self.djs[data.user[0].userid] = { nbSong: 0, name: data.user[0].name};
            console.log(self.djs);
        });

        this.bot.on('rem_dj', function (data) {
            console.log('rem');
            delete self.djs[data.user[0].userid];
            console.log(self.djs);
        });

        this.bot.on('endsong', function (data) {
            console.log('endsong');

            console.log(self.djs);

            var djId = data.room.metadata.current_dj;
            // if bot is djing, don't boot him...
            if (djId === self.userid) {
                return;
            }
            if (self.djs[djId] && ++self.djs[djId].nbSong >= self.songLimit) {
                if (self.songLimit !== NO_SONG_LIMIT) {
                    self.bot.remDj(djId, function() {
                        console.log('djId --> ' + djId);
                        self.bot.speak('...song limit reached, hop back up soon!');
                        delete self.djs[djId];
                        console.log(self.djs);
                    });
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




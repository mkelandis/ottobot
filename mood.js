/* global define:false */
/* global console:false */
define(function() {

    "use strict";

    var Mood = function(options) {

        this.bot = options.bot || options.bot && null;
        this.cmd = options.cmd || options.cmd && null;
        this.mood = 0;

    };

    Mood.prototype.run = function() {

        console.log('mood: started');

        var self = this;

        this.bot.on('update_votes', function (data) {
            var metadata = data.room.metadata;
            var upvotes = metadata.upvotes;
            var downvotes = metadata.downvotes;
            var listeners = metadata.listeners;

            self.mood = self.mood + (upvotes - downvotes / listeners);
        });

        this.cmd.registerModCommand('mood', '', 'gauge the mood of the room', function() {
            self.bot.speak('mood of the room is: ' + self.mood);
            if (self.isBopping()) {
                self.bot.speak('The room is bopping');
            }
            if (self.isDead()) {
                self.bot.speak('Get out the defibrillator');
            }
            if (self.isCrickets()) {
                self.bot.speak('chirp chirp chirp');
            }

        });
    };

    Mood.prototype.isBopping = function() {
        return this.mood > 0;
    };

    Mood.prototype.isDead = function() {
        return this.mood === 0;
    };

    Mood.prototype.isCrickets = function() {
        return this.mood < 0;
    };



    return Mood;
});




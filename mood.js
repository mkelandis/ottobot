/* global define:false */
/* global console:false */
define(function() {

    "use strict";

    var Mood = function(options) {

        this.bot = options.bot || options.bot && null;
        this.userid = options.userid || options.userid && null;

        this.mood = 0;
      
    };

    Mood.prototype.run = function() {
        var self = this;
       
        this.bot.on('update_votes', function (data) {
            var metadata = data.room.metadata;
            var upvotes = metadata.upvotes;
            var downvotes = metadata.downvotes;
            var listeners = metadata.listeners;

            self.mood = self.moood + (upvotes - downvotes / listeners);
        });
    };

    Mood.prototype.isBoping = function() {
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




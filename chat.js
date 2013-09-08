/** Copyright 2013 HinterSphere Software <ottobot@hintersphere.com> 
  * MIT LICENSE
  * https://github.com/mkelandis/ottobot/blob/master/LICENSE-MIT
  */
/* global define:false */
/* global console:false */
define(function() {

    "use strict";

    var Chat = function(options) {

        this.bot = options.bot || options.bot && null;
        this.userid = options.userid || options.userid && null;
        this.hearAndSay = options.hearAndSay || options.hearAndSay && null;

        console.log('chat started with:');
        console.log(this.bot);
        console.log(this.userid);
        console.log(this.hearAndSay);
    };

    Chat.prototype.run = function() {
        var self = this;
        this.bot.on('speak', function(data) {
            for (var heard in self.hearAndSay) {
                if (self.hearAndSay.hasOwnProperty(heard)) {
                    self.onSpeak(heard, data, self.hearAndSay[heard]);
                }
            }
        });
    };

    Chat.prototype.onSpeak = function(match, data, replies) {
        // only respond to others
        if (data.userid === this.userid) {
            return;
        }

        var regex = new RegExp('^.*' + match + '.*$', "i");
        console.log(regex);
        if (data.text.match(regex)) {
            // put random banter here...
            var reply = this.getRandomReply(data.name, replies);
            if (reply) {
                var self = this;
                setTimeout(function() {
                    self.bot.speak(reply);
                }, (Math.floor(Math.random() * 4) + 1) * 1000);
            }
        }
    };

    Chat.prototype.getRandomReply = function(replyName, replies) {
        var reply = replies[Math.floor(Math.random() * replies.length)];
        if (trueOneInN(12)) {
            return reply + ", @" + replyName;
        }
        return reply;
    };

    function trueOneInN(n) {
        return ((Math.floor(Math.random() * n)) === 0);
    }

    return Chat;
});




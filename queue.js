/** Copyright 2013 HinterSphere Software <ottobot@hintersphere.com> 
  * MIT LICENSE
  * https://github.com/mkelandis/ottobot/blob/master/LICENSE-MIT
  */
/* global define:false */
/* global console:false */
define(function() {

    "use strict";

    var Queue = function(options) {
        this.bot = options.bot || options.bot && null;
        this.cmd = options.cmd || options.cmd && null;
        this.userid = options.userid || options.userid && null;

        this.q = [];

        // defaults
        this.holdTimeSecs = 45;
        this.upNextMessage = 'heads up, your up next.';
    };

    Queue.prototype.run = function() {

        var self = this;
        self.console = console;
        console.log('queue: started') ;

        this.cmd.registerCommand('q+', 'add me to the queue', function(data) {
            console.log('adding to queue: ' + data.name + ' (' + data.userid + ')');
            self.add(data);
        });

        this.cmd.registerCommand('q-', 'remove me from the queue', function(data) {
            console.log('removing from queue: ' + data.name + ' (' + data.userid + ')');
            self.remove(data);
        });

        this.cmd.registerCommand("q", 'display queue status', function(data) {
            console.log('requesting queue stats: ' + data.name + ' (' + data.userid + ')');
            self.status(data);
        });

        this.bot.on('add_dj', function (data) {
            self.checkDjInSpot(data.user[0]);
        });

        this.bot.on('rem_dj', function () {
            self.inviteNextUp();
        });
    };

    Queue.prototype.add = function(user) {
        var self = this;
        this.bot.roomInfo(false, function(data) {
            if (data.djids.indexOf(user.userid) < 0) {
                var position = self.getPosition(user.userid);
                if (position !== null && position >= 0) {
                    self.bot.speak('hey @' + user.name + ' - got you at position ' + (position + 1));
                } else {
                    self.bot.speak('hey @' + user.name + ' - added you at position ' + self.q.push(user));
                }
            } else {
                console.log('user: @' + user.name + ' is already djing');
            }
        });
    };

    Queue.prototype.remove = function(data) {
        var position = this.getPosition(data.userid);
        if (position !== null && position >= 0) {
            this.q.splice(position, 1);
            this.bot.speak('ok @' + data.name + ' - removed you from the queue');
        } else {
            this.bot.speak('ok @' + data.name + ' - couldn\'t find you anyway');
        }
    };

    Queue.prototype.status = function(data) {
        if (!this.q.length) {
            this.bot.speak('@' + data.name + ' - the queue is empty');
            return;
        }

        var displayQueue = [];
        displayQueue.push('queue: \n');
        for (var i = 0; i < this.q.length; i++) {
            displayQueue.push((i+1) + ' : ' + this.q[i].name);
        }
        this.bot.speak(displayQueue.join(''));
    };

    Queue.prototype.getPosition = function(userid) {

        for (var i = 0; i < this.q.length; i++) {
            if (this.q[i].userid === userid) {
                return i;
            }
        }
        return -1;
    };

    Queue.prototype.inviteNextUp = function() {

        // if no q...
        if (!this.q.length) {
            return;
        }

        var user = this.q[0];
        this.bot.speak('hey @' + user.name + ' - come on up, you\'re next (you have ' + this.holdTimeSecs +
            ' seconds)');

        var self = this;
        setTimeout(function() {
            if (self.q.length && self.q[0].userid === user.userid) {
                self.bot.speak('times up @' + user.name);
                self.q.shift();
                self.inviteNextUp();
            }
        }, (this.holdTimeSecs * 1000));

    };

    Queue.prototype.checkDjInSpot = function(user) {

        // don't boot yourself
        if (user.userid === this.userid) {
            return;
        }

        // if no q...
        if (!this.q.length) {
            return;
        }

        // check 0th position and boot...
        if (this.q[0].userid !== user.userid) {
            this.bot.remDj(user.userid);
            this.bot.speak('@' + user.name + ' - sorry, that spot is reserved for @' + this.q[0].name);
            return;
        }

        // shift the queue
        this.q.shift();
        if (this.q.length && this.upNextMessage) {
            this.bot.speak('@' + this.q[0].name + ' - ' + this.upNextMessage);
        }

    };

    return Queue;
});




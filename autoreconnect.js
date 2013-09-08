/** Copyright 2013 HinterSphere Software <ottobot@hintersphere.com> 
  * MIT LICENSE
  * https://github.com/mkelandis/ottobot/blob/master/LICENSE-MIT
  */
/* global define:false */
/* global console:false */
define(function() {

    "use strict";

    var AutoReconnect = function(options) {
        this.bot = options.bot || options.bot && null;
        this.roomid = options.roomid || options.roomid && null;

        this.disconnected = false;
    };

    AutoReconnect.prototype.run = function() {

        console.log('autoreconnect started with:');
        console.log(this.bot);
        console.log(this.roomid);

        var self = this;
        this.bot.on('ready', function() {
            self.connect();
        });

        this.bot.on('disconnected', function(e) {
            if (!self.disconnected) {
                // Set the disconnected flag and display message
                self.disconnected = true;
                console.log("disconnected: " + e);
                // Attempt to reconnect in 10 seconds
                setTimeout(self.connect, 10 * 1000);
            }
        });

    };

    /*
     * Connect/reconnect to Turntable
     */
    AutoReconnect.prototype.connect = function() {

        // Reset the disconnected flag
        this.disconnected = false;

        // Attempt to join the room
        var self = this;
        this.bot.roomRegister(self.roomid, function (data) {
            if (data && data.success) {
                console.log('Joined ' + data.room.name);
            } else {
                console.log('Failed to join room');
                if (!self.disconnected) {
                    // Set the disconnected flag
                    self.disconnected = true;
                    // Try again in 60 seconds
                    setTimeout(self.connect, 60 * 1000);
                }
            }
        });
    };

    return AutoReconnect;
});




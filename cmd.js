/** Copyright 2013 HinterSphere Software <ottobot@hintersphere.com> 
  * MIT LICENSE
  * https://github.com/mkelandis/ottobot/LICENSE-MIT
  */
/* global define:false */
/* global console:false */
define(function() {

    "use strict";

    var Cmd = function(options) {
        this.bot = options.bot || options.bot && null;
        this.userid = options.userid || options.userid && null;

        this.commands = [];
        this.modCommands = [];
    };

    Cmd.prototype.run = function() {
        console.log('cmd: started');

        var self = this;
        this.registerCommand('help', 'show a list of commands', function() {
            if (self.commands.length > 1) {
                self.speakLines(0, self.commands);
            }
        });

        this.registerModCommand('help', '', 'show a list of commands including mod commands', function(data) {
            if (self.commands.length > 1) {
                self.speakPmLines(0, self.commands, data.senderid);
            }
            if (self.modCommands.length > 1) {
                self.speakPmLines(0, self.modCommands, data.senderid);
            }
        });

    };

    // other ttapi modules can use this method to register commands.
    Cmd.prototype.registerCommand = function(command, descr, callback) {

        console.log('cmd: registering command: ' + command);
        this.commands.push('\/' + command + ' : ' + descr);
        console.log(this.commands);

        var self = this;
        this.bot.on('speak', function(data) {
            // only respond to others
            if (data.userid === self.userid) {
                return;
            }

            var fullcmd = '/' + command;
            console.log(fullcmd);
            if (data.text === fullcmd.trim()) {
                console.log('matched: ' + fullcmd);
                callback(data);
            }
        });
    };

    // other ttapi modules can use this method to register mod commands available in pms.
    Cmd.prototype.registerModCommand = function(command, argsDesc, descr, callback) {

        console.log('cmd: registering mod command: ' + command);
        this.modCommands.push('\/' + command + ' [ ' + argsDesc + ' ] : ' + descr);
        console.log(this.modCommands);

        var self = this;

        this.bot.on('pmmed', function (data) {

            // check for the command before we do an expensive mod check.
            var fullcmd = '/' + command;
            if (data.text.indexOf(fullcmd) !== 0) {
                return;
            }

            console.log('cmd: found mod command: ' + fullcmd);

            // room.metadata.moderator_id (is an array)
            self.bot.roomInfo(false, function(roomInfo) {

                // mod check
                if (roomInfo.room.metadata.moderator_id.indexOf(data.senderid)) {
                    return;
                }

                // execute mod command
                var args = data.text.split(" ");
                args.shift();
                console.log('cmd: matched mod cmd args ' + args);

                callback(data, args, roomInfo);
            });
        });
    };

    // used to speak multiple lines with line breaks between them in the chat. todo: move to chat.js
    Cmd.prototype.speakLines = function(linenum, arr) {

        // sanity checks
        if (!arr || arr.length === linenum) {
            return;
        }

        // output last line...
        if (linenum >= (arr.length - 1)) {
            this.bot.speak(arr[linenum]);
        } else {
            var self = this;
            this.bot.speak(arr[linenum], function() {
                self.speakLines(linenum + 1, arr);
            });
        }
    };

    // used to speak multiple pm lines with line breaks between them in the chat. todo: move to chat.js
    Cmd.prototype.speakPmLines = function(linenum, arr, receiverId) {

        // sanity checks
        if (!arr || arr.length === linenum) {
            return;
        }

        // output last line...
        if (linenum >= (arr.length - 1)) {
            this.bot.pm(arr[linenum], receiverId);
        } else {
            var self = this;
            this.bot.pm(arr[linenum], receiverId, function() {
                self.speakPmLines(linenum + 1, arr, receiverId);
            });
        }
    };


    return Cmd;
});




/** Copyright 2013 HinterSphere Software <ottobot@hintersphere.com> 
  * MIT LICENSE
  * https://github.com/mkelandis/ottobot/blob/master/LICENSE-MIT
  */
/* global define:false */
/* global console:false */
define(function() {

    "use strict";

    var Fan = function(options) {
        this.bot = options.bot || options.bot && null;
        this.cmd = options.cmd || options.cmd && null;
    };

    Fan.prototype.run = function() {
        console.log('fan started with:') ;

        // fan and unfan
        var self = this;
        this.cmd.registerCommand("fanme", 'start being my fan',function(data) {
            console.log('became fans of: ' + data.name + ' (' + data.userid + ')');
            self.bot.becomeFan(data.userid);
        });

        this.cmd.registerCommand("unfanme", 'stop being my fan', function(data) {
            console.log('unfanned: ' + data.name + ' (' + data.userid + ')');
            self.bot.becomeFan(data.userid);
        });
    };


    return Fan;
});




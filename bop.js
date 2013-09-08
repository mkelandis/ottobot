/** Copyright 2013 HinterSphere Software <ottobot@hintersphere.com> 
  * MIT LICENSE
  * https://github.com/mkelandis/ottobot/blob/master/LICENSE-MIT
  */
/* global define:false */
/* global console:false */
define(function() {

    "use strict";

    var Bop = function(options) {
        this.bot = options.bot || options.bot && null;
    };

    Bop.prototype.run = function() {
        console.log('bop: started') ;
        var self = this;
        this.bot.on('newsong', function() {
            console.log('bop: bopping on new song');
            self.bot.bop();
        });
    };

    return Bop;
});




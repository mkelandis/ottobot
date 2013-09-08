/** Copyright 2013 HinterSphere Software <ottobot@hintersphere.com> 
  * MIT LICENSE
  * https://github.com/mkelandis/ottobot/blob/master/LICENSE-MIT
  */
/* global require:false */
/* global process:false */
/* global console:false */
var requirejs = require('requirejs');

requirejs.config({
    //Pass the top-level main.js/index.js require function to requirejs so that node modules are loaded relative to the
    //top-level JS file.
    nodeRequire: require
});

requirejs(['ttapi', 'autoreconnect', 'bop', 'chat', 'autodj', 'cmd', 'fan', 'queue', 'songlimit'],
    function(Bot, AutoReconnect, Bop, Chat, AutoDj, Cmd, Fan, Queue, SongLimit) {

        "use strict";

        // process command line args for auth, userid and roomid
        if (process.argv.length !== 5) {
            console.log('usage: node app.js [auth] [userid] [roomid]');
            process.exit(1);
        }

        var auth = process.argv[2];
        var userid = process.argv[3];
        var roomid = process.argv[4];

        console.log('app: starting');
        console.log('app: auth: ' + auth);
        console.log('app: userid: ' + userid);
        console.log('app: roomid: ' + roomid);

        var bot = new Bot(auth, userid, roomid);

        // auto reconnect
        var autoReconnect = new AutoReconnect({
            bot: bot,
            roomid: roomid
        });
        autoReconnect.run();

        // chat
        var hearAndSay = {};
        hearAndSay.otto = ['werd', 'rawk', 'lol', 'awesome', 'cool', 'seriously?', 'frickin sweet'];
        hearAndSay['prince|chaka|lisa lisa|manic monday|sugar walls|sheena easton|CARMEN ELECTRA|sheila e|bangles|martika'] = ['gotsta thank Prince for writing all of my favorite 80s songs (even tho he smashed that dude\'s guitar)'];
        var chat = new Chat({
            bot: bot,
            userid: userid,
            hearAndSay: hearAndSay
        });
        chat.run();

        // auto dj
        var autoDj = new AutoDj({
            bot: bot,
            userid: userid,
            stepUpMsg: 'Hey, let\'s keep it going!'
        });
        autoDj.run();

        // auto bop
        var bop = new Bop({
            bot: bot
        });
        bop.run();

        // command sub-module used to register commands
        var cmd = new Cmd({
            bot: bot,
            userid: userid
        });
        cmd.run();

        // fan and unfan
        var fan = new Fan({
            bot: bot,
            cmd: cmd
        });
        fan.run();

        // dj queue management
        var queue = new Queue({
            bot: bot,
            cmd: cmd,
            userid: userid
        });
        queue.run();

        // song limit
        var songLimit = new SongLimit({
            bot: bot,
            cmd: cmd,
            userid: userid
        });
        songLimit.run();

    });


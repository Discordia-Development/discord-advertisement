var Discord = require("discord.js");

var mybot = new Discord.Client({
    autoReconnect: true
});

var express = require('express');
var request = require('request');


var auth = require('./config');
var base64 = require('node-base64-image');


var logged_off = true;

var app = express();
//For avoidong Heroku $PORT error
app.set('port', (process.env.PORT || 5000));
app.get('/', function(request, response) {
    var result = 'Bot is running'
    if (logged_off) {
        result = 'Re-logging in as bot.';
        mybot.login(auth.token);
    }
    response.send(result);
}).listen(app.get('port'), function() {
    console.log('Bot is running, server is listening on port', app.get('port'));
});


mybot.on("debug", console.log);

var channels = ["channelidhere", "anotherchannelidhere"];
var messages = ["Discord Premium only 69.99 USD/mo! Buy today: https://discordia.me/premium", "Need a date? We do too! Hot and sweaty coders want 2 meet you tonite: https://discordia.me/date", "Did you know that every day, more than 37 Wumpi (Wumpuses? I don't get paid enough for this) get killed in deforestation attempts. Stop the abuse. Call 911 to donate today.", "Attention: If you or a loved one has been diagnosed with Mesothelioma you may to be entitled to financial compensation. Mesothelioma is a rare cancer linked to asbestos exposure. Exposure to asbestos in they Navy, shipyards, mills, heating, construction or the automotive industries may put you at risk. Please don't wait, call 1-800-99 LAW USA today for a free legal consultation and financial information packet. Mesothelioma patients call now! 1-800-99 LAW USA", "There's a new malicious discord bot going around known as DoraTheExploiter. If you see it on your server or any other server, ban it or ping the server staff and have it banned immediately. If this bot PMs you, DO NOT download or click any of its files, namely 'dishrag.exe.zip.rar.7z.png.oj'. Spread the word to as many of your servers as you can. (Apparently this one is real) But still be careful. If user: -DoraTheExploiter-#5955 Joins a server you know/own get it banned and do not click ANY links or downloads.", "PUBLIC SERVICE ANNOUNCEMENT FROM DISCORD DEVELOPMENT TEAM: 'Do not Accept a friend request from Chrisopeer Davies and Jessica Davies They Are hackers. Tell everyone on your list Because if somebody on your list adds him, he'll be on your list too. He'll figure out your Computer's ID and address, so copy & paste.", "IMAGE"];
var images = ["https://cdn.discordapp.com/attachments/292421372901326848/297579369772351498/IMG_20170331_225332.jpg", "https://cdn.discordapp.com/attachments/292421372901326848/297626590244765701/IMG_20170401_020138.jpg", "https://cdn.discordapp.com/attachments/236749559529734145/296755895407214594/unknown.png", "https://cdn.discordapp.com/attachments/200445132191825920/296381643068014602/unknown.png", "https://cdn.discordapp.com/attachments/292421372901326848/297621069051985920/IMG_20170401_013942.jpg"]

setInterval(function(){
	//want to do - make it so we can do this online or something?
	var randomNumber = Math.floor((Math.random() * channels.length));
	var channel = channels[randomNumber]
	randomNumber = Math.floor((Math.random() * messages.length)); 
	if (messages[randomNumber] == "IMAGE"){
		randomNumber = Math.floor((Math.random() * images.length)); 
		mybot.channels.get(channel).sendFile(images[randomNumber]);
	}
	else {
		mybot.channels.get(channel).sendMessage(messages[randomNumber]);
	}
	
}, 60000 * 30 ); //300000 = 5 minutes 60000 = 1 minute, so it's 30 minutes


mybot.on("message", function(message) {

    var server = message.channel.guild;
    var channel = message.channel;
    var sentMessage = message.content.toLowerCase();

  
	
    if (sentMessage.indexOf("!uptime") == 0) {
		if (message.author.id == "PUT A USER ID FOR THIS COMMAND HERE" || message.author.id == "ANOTHER ID IF YOU WANT IT") {

			var uptime = mybot.uptime;
			var uptime_string = millisecondsToStr(uptime);
			channel.sendMessage("Uptime is" + uptime_string);
		}
    }

    if (sentMessage.indexOf("!achange") == 0) {
        if (message.author.id == "MORE USER IDS" || message.author.id == "SAME THING HERE") {
            var image_link = sentMessage.replace("!achange ", "");

            if (image_link.length > 0) {
                var options = {
                    string: true
                };

                base64.base64encoder(image_link, options, function(err, image) {
                    if (err) {
                        console.log(err);
                        message.reply("Error!");
                    }
					else {
						message.reply("Changed image");
						mybot.user.setAvatar("data:image/png;base64," + image);
					}
                });

            }
        }
    }

    if (sentMessage.indexOf("!nchange") == 0) {
        if (message.author.id == "MORE USER IDS") {
            var parameter = message.content.replace("!nchange ", "");
            mybot.user.setUsername(parameter);
        }
    }




});

console.log("Logging in...");

mybot.login(auth.token);


mybot.on('ready', function() {
    mybot.user.setGame("advertising");
	mybot.user.setStatus("invisible");

});



function millisecondsToStr(milliseconds) {
    // TIP: to find current time in milliseconds, use:
    // var  current_time_milliseconds = new Date().getTime();

    function numberEnding(number) {
        return (number > 1) ? 's' : '';
    }


    var temp = Math.floor(milliseconds / 1000);
    var years = Math.floor(temp / 31536000);
    var date_string = "";
    if (years) {
        date_string = date_string + years + ' year' + numberEnding(years);
    }
    //TODO: Months! Maybe weeks? 
    var days = Math.floor((temp %= 31536000) / 86400);
    if (days) {
        date_string = date_string + " " + days + ' day' + numberEnding(days);
    }
    var hours = Math.floor((temp %= 86400) / 3600);
    if (hours) {
        date_string = date_string + " " + hours + ' hour' + numberEnding(hours);
    }
    var minutes = Math.floor((temp %= 3600) / 60);
    if (minutes) {
        date_string = date_string + " " + minutes + ' minute' + numberEnding(minutes);
    }
    var seconds = temp % 60;
    if (seconds && minutes) {
        date_string = date_string + " " + "and " + seconds + ' second' + numberEnding(seconds);

    } else if (seconds) {
        date_string = date_string + " " + seconds + ' second' + numberEnding(seconds);
    }
    if (date_string != "") {
        return date_string + "."
    }
    return 'less than a second'; //'just now' //or other string you like;
}

const Discord = require('discord.js');

const client = new Discord.Client();

client.commands = new Discord.Collection();
client.events = new Discord.Collection();

['command_handler', 'event_handler'].forEach(handler =>{
	require(`./handlers/${handler}`)(client, Discord);
})

client.login('ODIzOTcwOTkzMDQ3MDc2ODg1.YFokyQ.gBBtZtubVbG-hqooiITccNJNe8w') // Test bot




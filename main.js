const Discord = require('discord.js');

const client = new Discord.Client();

client.commands = new Discord.Collection();
client.events = new Discord.Collection();

['command_handler', 'event_handler'].forEach(handler =>{
	require(`./handlers/${handler}`)(client, Discord);
})

//client.login('ODIzMTA5NDI1NjA1OTAyMzQ2.YFcCYw.m0-b9-pN1ONs9iPu2hEBX0BASEc') // Original bot
client.login('ODIzNTYxMTY2MjEwMjAzNjk4.YFinGw.OUm3QISXLYXE2GHAgk8At4qzJzA') // Test bot

const Discord = require('discord.js');

const client = new Discord.Client();

client.commands = new Discord.Collection();
client.events = new Discord.Collection();

['command_handler', 'event_handler'].forEach(handler =>{
	require(`./handlers/${handler}`)(client, Discord);
})

client.login('ODIzOTM3ODIxOTQ1MzY0NDkx.YFoF5A.D3Ey4ag_kK1-Hlm6X20OWgLn0Uk') // Test bot




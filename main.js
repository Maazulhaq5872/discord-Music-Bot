const Discord = require('discord.js');

const client = new Discord.Client();

client.commands = new Discord.Collection();


const fs = require('fs');

const command_files = fs.readdirSync(`./commands/`).filter(file => file.endsWith('.js'));
for(const file of command_files){
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}


client.login('ODIzMTA5NDI1NjA1OTAyMzQ2.YFcCYw.m0-b9-pN1ONs9iPu2hEBX0BASEc') // Original bot
//client.login('ODIzNTYxMTY2MjEwMjAzNjk4.YFinGw.OUm3QISXLYXE2GHAgk8At4qzJzA') // Test bot

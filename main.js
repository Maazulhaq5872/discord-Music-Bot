const Discord = require('discord.js');

const client = new Discord.Client();

client.commands = new Discord.Collection();

const prefix = '/';

const fs = require('fs');

const command_files = fs.readdirSync(`./commands/`).filter(file => file.endsWith('.js'));
for(const file of command_files){
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.once('ready', ready=>{
    console.log("ANALysis Is Online!");
})

client.on('message', message=>{
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (!client.commands.has(command)) return;

    try {
        client.commands.get(command).execute(message, args);    
    } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }
})

client.login('ODIzMTA5NDI1NjA1OTAyMzQ2.YFcCYw.m0-b9-pN1ONs9iPu2hEBX0BASEc') // kOriginal bot
// client.login('ODIzNTYxMTY2MjEwMjAzNjk4.YFinGw.OUm3QISXLYXE2GHAgk8At4qzJzA') // Test bot

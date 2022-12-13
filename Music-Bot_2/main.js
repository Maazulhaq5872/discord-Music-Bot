const Discord = require('discord.js');
require('dotenv/config');
const client = new Discord.Client({
    intents:[
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMembers,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.GuildVoiceStates,
        Discord.GatewayIntentBits.MessageContent,
        Discord.GatewayIntentBits.GuildIntegrations,
    ]
});
module.exports = {client};

client.commands = new Discord.Collection();
client.events = new Discord.Collection();

['command_handler', 'event_handler'].forEach(handler=>{
    require(`./handlers/${handler}`)(client, Discord);
});

client.login(process.env.TOKEN)
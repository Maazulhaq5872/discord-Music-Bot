const fs = require('fs');

module.exports = (client, Discord)=>{
    const command_files = fs.readdirSync(`./Music-Bot_1/commands/`).filter(file => file.endsWith('.js'));
    for(const file of command_files){
        const command = require(`../commands/${file}`);
        client.commands.set(command.name, command);
    }
}
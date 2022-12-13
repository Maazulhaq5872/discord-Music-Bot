const fs = require("fs");

module.exports = (client, Discord)=>{
    commandStorage = []
    const command_files = fs.readdirSync(`./Music-Bot_2/commands/`).filter(file=>file.endsWith('js'));
    for(const file of command_files){
        const command =require(`../commands/${file}`);
        client.commands.set(command.name, command);
        commandStorage.push(command)
    };

    client.on('ready',async ()=>{
        await client.application.commands.set(commandStorage)
        .then(()=> console.log(`Registered ${commandStorage.length} command(s)`))
        .catch((error)=> console.log(`Unable to register commands: ${error}`));
    })
}
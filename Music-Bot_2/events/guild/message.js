
module.exports = {
    name: 'message',
    description: 'To read & send messages in',
    execute(message, client){
        const prefix = '/';
        if(!message.content.startsWith(prefix) || message.author.bot) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();
        const cmd = client.commands.get(command) || client.commands.find(a => a.aliases && a.aliases.includes(command));

        if(!cmd) return;

        try {
            cmd.execute(message, args, command, client);    
        } catch (error) {
            console.error(error);
            message.reply('there was an error trying to execute that command!');
        }
    }
}
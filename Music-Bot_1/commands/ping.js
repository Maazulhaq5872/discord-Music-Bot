module.exports = {
    name: 'ping1',
    aliases: ['beep1'],
    description: ' ping command',
    execute(message, args, command){
        if(command === 'ping1') message.channel.send('pong');

        if(command === 'beep1') message.channel.send('boop');
    }
};


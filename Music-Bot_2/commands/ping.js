module.exports = {
    name: 'ping2',
    aliases: ['beep2'],
    description: ' ping command',
    execute(message, args, command){
        if(command === 'ping2') message.channel.send('pong');

        if(command === 'beep2') message.channel.send('boop');
    }
};


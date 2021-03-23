module.exports = {
    name: 'ping3',
    aliases: ['beep3'],
    description: ' ping command',
    execute(message, args, command){
        if(command === 'ping3') message.channel.send('pong');

        if(command === 'beep3') message.channel.send('boop');
    }
};


module.exports = {
    name: 'ping',
    description: ' ping command',
    execute(message, args, client){
        message.channel.send('pong')
    }
};
module.exports = {
    name: 'leave',
    description: 'To stop the bot from playing music and leave the channel',
    async execute(message, args) {
        const voicechannel = message.member.voice.channel;
        if(!voicechannel) return message.channel.send("Voice channel join kar bsdk uske leave likhna");
        await voicechannel.leave();
        await message.channel.send('Acha chalta hun, duaon main yaad rakhna :smiling_face_with_tear:')
    }
}
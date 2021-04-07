const ytdl = require('ytdl-core');
const Ytsearch = require('yt-search');
const { description } = require('./ping');

module.exports = {
    name: 'play',
    description: 'plays music',
    async execute(message, args, command, client, Discord) {
        const voice_channel =message.member.voice.channel;

        if(!voice_channel) return message.channel.send('Get yourself in a voice channel to run this command');
        const permissions = voice_channel.permissionsFor(message.client.user);
        if(!permissions.has('CONNECT')) return message.channel.send("Don't have enough permissions");
        if(!permissions.has('SPEAK')) return message.channel.send("Don't have enough permissions");
        if(!args.length) return message.channel.send('Pass some arguments biatch');

        const connection = await voice_channel.join();
        const videofinder = (query) => {
            const video_Result = Ytsearch(query);
            return (video_Result.videos.length > 1) ? music_Result.videos[0] : null;
        }
        const video = await videofinder(args.join(' '));

        if(video){
            const stream = ytdl(video.url, {filter: 'audioonly'});
            connection.play(stream, {seek: 0, volume: 1})
            .on('finish', () =>{
                voice_channel.leave()
            })
            await message.reply(`:thumbsup: Now playing ***${video.title}***`);
        } else {
            message.channel.send('no results found');
        }
    }
}
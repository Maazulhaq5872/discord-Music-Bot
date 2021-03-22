const ytdl =require('ytdl-core');

const YtSearch = require('yt-search');

module.exports = {
    name: 'play',
    description: 'Joins the channel & play',
    async execute(message, args){
        const voicechannel = message.member.voice.channel;

        if(!voicechannel) return message.channel.send('You should be in a voice channel to run this command');
        const permissions = voicechannel.permissionsFor(message.client.user);
        if(!permissions.has('CONNECT')) return message.channel.send("You don't have permissions");
        if(!permissions.has('SPEAK')) return message.channel.send("You don't have permissions");

        const URLchecker = (str)=>{
            var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
            if(!regex.test(str)) {
                return false;
            } else {
                return true;
            }
        }

        if(URLchecker(args[0])) {
            message.channel.send('Valid url, playing music!')
            const connection = await voicechannel.join();
            const stream = ytdl(args[0], {filter: 'audioonly'})
            connection.play(stream, {seek: 0, volume: 1})
            .on('finish', ()=>{
                voicechannel.leave();
            })
            await message.reply(`Now Playing ***The Link You Have Entered***`)

            return
        }

        const connection = await voicechannel.join();

        const videofinder = async (query) =>{
            const videoResult = await YtSearch(query);

            return (videoResult.videos.length > 1) ? videoResult.videos[0] : null;

        }

        const video = await videofinder(args.join(' '));
        if(video){
            const stream = ytdl(video.url, {filter: 'audioonly'});
            const player = connection.play(stream, {seek: 0, volume: 1})
            .on('finish', () =>{
                voicechannel.leave();
            });

            await message.reply(`Now Playing ***${video.title}***`)
        } else {
            message.channel.send("No results found!")
        }
    }
}
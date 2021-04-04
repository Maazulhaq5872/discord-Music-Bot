const ytdl = require('ytdl-core');
const ytsearch = require('yt-search');
const queue = new Map()

module.exports = {
    name: 'play1',
    aliases: ['skip1', 'stop1'],
    description: 'Can Play, Stop, Add Music To Queue',
    async execute(message, args, command, client, Discord){

        const voice_channel =message.member.voice.channel;
        if(!voice_channel) return message.channel.send('Get yourself in a voice channel to run this command');
        const permissions = voice_channel.permissionsFor(message.client.user);
        if(!permissions.has('CONNECT')) return message.channel.send("Don't have enough permissions");
        if(!permissions.has('SPEAK')) return message.channel.send("Don't have enough permissions");

        const server_queue = queue.get(message.guild.id);

        if(command === 'play1'){
            if(!args.length) return message.channel.send('Pass some arguments biatch');
            let song = {};

            if(ytdl.validateURL(args[0])){
                const song_INFO = await ytdl.getInfo(args[0]);
                song = {title: song_INFO.videoDetails.title, url: song_INFO.videoDetails.video_url}
            } else {
                try {
                    const music_Finder = async (query) =>{
                        const music_Result = await ytsearch(query);
                        return (music_Result.videos.length > 1) ? music_Result.videos[0] : null;
                    }
                } catch (error) {
                    console.error(error);
                    message.reply('there was an error trying to execute that command!');
                }
                const music = await music_Finder(args.join(' '));
                if(music){
                    song = {title : music.title, url: music.url};
                } else{
                    message.channel.send("Can't find any music, Try again")
                }
            }
            if(!server_queue){
                const queueBuilder = {
                    voice_channel: voice_channel,
                    text_channel: message.channel,
                    connection: null,
                    songs: []
                }
                queue.set(message.guild.id, queueBuilder);
                queueBuilder.songs.push(song);
    
                try{
                    const connection = await voice_channel.join();
                    queueBuilder.connection = connection;
                    musicPlayer(message.guild, queueBuilder.songs[0]);
                } catch(err){
                    queue.delete(message.guild.id);
                    message.channel.send("Can't CONNECT");
                    throw err;
                }
            } else{
                server_queue.songs.push(song);
                return message.channel.send(`***${song.title}*** has been added to queue`);
            }
        }
        else if(command ==='skip1') skipMusic(message, server_queue);
        else if(command ==='stop1') stopMusic(message, server_queue);
    }
}

const musicPlayer = async(guild, song) =>{
    const song_queue = queue.get(guild.id);
    if (!song){
        song_queue.voice_channel.leave();
        queue.delete(guild.id);
        return;
    }
    const stream = ytdl(song.url, {filter: 'audioonly'});
    song_queue.connection.play(stream, {seek: 0, volume: 1})
    .on('finish', ()=>{
        song_queue.songs.shift();
        musicPlayer(guild, song_queue.songs[0]);
    })
    await song_queue.text_channel.send(`***Now playing ${song.title}***`);
}
const skipMusic = (message, server_queue)=>{
    if(!message.member.voice.channel) return message.channel.send('Get yourself in a voice channel to run this command');
    if(!message.guild.voice || !message.guild.voice.channel) return message.channel.send('Not playing any music');
    if(!server_queue){
        return message.channel.send("No songs in the queue!")
    }
    if(message.member.voice.channelID === message.guild.voice.channelID) {
        server_queue.connection.dispatcher.end();
    } else {
        return message.channel.send('You are in different channel');
    }
}
const stopMusic = (message, server_queue)=>{

    if(!message.member.voice || !message.member.voice.channel) return message.channel.send('Get yourself in a voice channel to run this command');
    if(!message.guild.voice || !message.guild.voice.channel) return message.channel.send('Not playing any music');
    if(message.member.voice.channelID === message.guild.voice.channelID) {
        server_queue.songs = [];
        server_queue.connection.dispatcher.end();
    } else{
        return message.channel.send('You are in different channel');
    }
}
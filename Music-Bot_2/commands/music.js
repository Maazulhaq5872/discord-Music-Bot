const ytdl = require('ytdl-core');
const ytsearch = require('yt-search');
const {
	AudioPlayerStatus,
	createAudioPlayer,
	createAudioResource,
	joinVoiceChannel,
	getVoiceConnection,
} = require('@discordjs/voice');
const queue = new Map()
let playLength = 0;

module.exports = {
    name: 'music2',
    description: 'Music Player',
    options: [
        {
            name: 'play',
            description: 'To Play or Add Music Queue',
            type: 1,
            options:[{
                name: 'query', 
                description: 'enter query',
                type: 3,
                required: true,
            }]
        },
        {
            name: 'stop',
            description: 'To Stop Music Player',
            type: 1,
        },
        {
            name: 'skip',
            description: 'To Skip Currently Playing Music',
            type: 1,
        },
        {
            name: 'pause',
            description: 'To Pause Music',
            type: 1,
        },
        {
            name: 'resume',
            description: 'To Resume Music',
            type: 1,
        }
    ],
    async execute(interaction){
        const voice_channel =interaction.member.voice.channel;
        if(!voice_channel) return interaction.reply({content: 'Get yourself in a voice channel to run this command', ephemeral: true});
        if(interaction.guild.members.me.voice.channelId && voice_channel.id !== interaction.guild.members.me.voice.channelId) return interaction.reply({content: "Must be in the same channel", ephemeral:true});
        const permissions = voice_channel.permissionsFor(interaction.client.user);
        if(!permissions.has('CONNECT')) return interaction.reply("Don't have enough permissions");
        if(!permissions.has('SPEAK')) return interaction.reply("Don't have enough permissions");
        
        const server_queue = queue.get(interaction.guild.id);
        
        if(interaction.options.getSubcommand() ===  'play'){

            let song = {};
            
            const args = interaction.options.get('query').value;
            if(ytdl.validateURL(args)){
                const song_INFO = await ytdl.getInfo(args);
                song = {title: song_INFO.videoDetails.title, url: song_INFO.videoDetails.video_url}
            } else {
                const music_Finder = async (query) =>{
                    const music_Result = await ytsearch(query);
                    return (music_Result.videos.length > 1) ? music_Result.videos[0] : null;
                }
                const music = await music_Finder(args);
                if(music){
                    song = {title : music.title, url: music.url};
                } else{
                    interaction.reply("Can't find any music, Try again")
                }
            }
            playLength = playLength+1;
            if(!server_queue){
                const queueBuilder = {
                    voice_channel: voice_channel,
                    text_channel: interaction,
                    connection: null,
                    player: null,
                    songs: []
                }
                queue.set(interaction.guild.id, queueBuilder);
                queueBuilder.songs.push(song);
                try{
                    const voice_connection = joinVoiceChannel({
                        channelId: voice_channel.id,
                        guildId: interaction.guild.id,
                        adapterCreator: interaction.guild.voiceAdapterCreator,
                        selfDeaf: false,
                        selfMute: false,
                    });
                    const connection = getVoiceConnection(interaction.guild.id);
                    const player = createAudioPlayer();
                    const sub = connection.subscribe(player);
                    queueBuilder.connection = connection;
                    queueBuilder.player = player;
                    musicPlayer(interaction.guild, queueBuilder.songs[0], player, sub);
    
                } catch(err){
                    queue.delete(interaction.guild.id);
                    interaction.reply("Can't CONNECT");
                    throw err;
                }
            } else{
                server_queue.songs.push(song);
                return interaction.reply(`***${song.title}*** has been added to queue`);
            }
        }
        else if(interaction.options.getSubcommand() === "stop") stopMusic(interaction, server_queue);
        else if(interaction.options.getSubcommand() === "skip") skipMusic(interaction, server_queue);
        else if(interaction.options.getSubcommand() === "resume") resumeMusic(interaction, server_queue);
        else if(interaction.options.getSubcommand() === "pause") pauseMusic(interaction, server_queue);

    }
}

const musicPlayer = async(guild, song, player) =>{
    const song_queue = queue.get(guild.id);
    if (!song){
        try {
            playLength = 0
            song_queue.player.stop(),
            song_queue.connection.destroy(),
            queue.delete(guild.id)
            return
        } catch (error) {
            return
        }
    }
    const stream = ytdl(song.url, {filter: 'audioonly'});
    const resource = createAudioResource(stream);
    resource.volume=1;
    player.play(resource)
    player.on(AudioPlayerStatus.Idle, ()=>{
        song_queue.songs.shift();
        musicPlayer(guild, song_queue.songs[0], player);
    })
    if(playLength>1) {
        await song_queue.text_channel.channel.send({content: `***Now playing ${song.title}***`})
    } else await song_queue.text_channel.reply({content: `***Now playing ${song.title}***`})
}

const stopMusic = (interaction, server_queue)=>{
    if(!server_queue) return interaction.reply("Not Playing Any Music")
    playLength = 0
    server_queue.songs =[]
    server_queue.player.stop()
    server_queue.connection.destroy()
    queue.delete(interaction.guild.id)
    return interaction.reply({content: "Stopped & Left the Channel", ephemeral: true})
}

const skipMusic = (interaction, server_queue)=>{
    if(!server_queue) return interaction.reply("Not Playing Any Music")
    server_queue.player.stop()
    server_queue.songs.shift()
    musicPlayer(interaction.guild, server_queue.songs[0], server_queue.player)
    return interaction.reply({content: "Skipped", ephemeral: true})
}
const pauseMusic = (interaction, server_queue)=>{
    if(!server_queue) return interaction.reply("Not Playing Any Music")
    server_queue.player.pause()
    return interaction.reply({content: "Paused", ephemeral: true})
}

const resumeMusic = (interaction, server_queue)=>{
    if(!server_queue) return interaction.reply("Not Playing Any Music")
    server_queue.player.unpause()
    return interaction.reply({content: "Resumed", ephemeral: true})
}
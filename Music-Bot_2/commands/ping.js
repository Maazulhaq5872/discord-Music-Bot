module.exports = {
    name: 'ping2',
    description: 'Test command',
    async execute(interaction){
        await interaction.reply({content: `:ping_pong: Pong!`});
    }
}
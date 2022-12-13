module.exports = {
    name: 'ready',
    once: true,
    execute(client, Discord){
        console.log(`${client.user.tag} is online`)
        client.user.setActivity("Your Music");
    }
}
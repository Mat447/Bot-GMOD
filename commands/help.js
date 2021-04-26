const Discord = require('discord.js')
 
module.exports = {
    run: message => {
        message.channel.send(new Discord.MessageEmbed()
            .setTitle('Menu Help')
            .setDescription('Voici les commandes du serveurs')
            .setColor('#71b4d8')
            .addField('`!help`', 'Cette commande permet d\'avoir de l\'aide.', false)
            .addField('`!serveur`', 'Cette commande permet d\'avoir les informations du serveur', false)
            .setFooter('AcruxRôleplay', 'https://cdn.discordapp.com/attachments/820704246760341534/822750123615715379/logo_acrux.png')
            .setTimestamp()
            .setURL(''))
    },
    name: 'help'
}
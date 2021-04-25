const Discord = require('discord.js'),
    client = new Discord.Client({
        fetchAllMembers: true,
        partials: ['MESSAGE', 'REACTION']
    }),
    config = require('./config.json');
    fs = require('fs')
    const prefix = config.prefix
    const annoncechannel= "804748335914287144";
    const Gamedig = require('gamedig');
    const enmap = require('enmap');

    const settings = new enmap({
        name: "settings",
        autoFetch: true,
        cloneLevel: "deep",
        fetchAll: true
    });
 
client.login(config.token)
client.commands = new Discord.Collection()
 
fs.readdir('./commands', (err, files) => {
    if (err) throw err
    files.forEach(file => {
        if (!file.endsWith('.js')) return
        const command = require(`./commands/${file}`)
        client.commands.set(command.name, command)
    })
})

client.on("ready", ()=> {
    setInterval(() => {
        Gamedig.query({
          type: 'garrysmod',
          host: '149.202.89.98',
          port: 27015
        }).then((state) => {
          client.user.setPresence({
            status: "online",
            activity: {
              name: `AcruxRôleplay : ${state.players.length} / ${state.maxplayers}`,
              type: "PLAYING"
            }
          })
        }).catch((error) => {
          client.user.setPresence({
            status: "online",
            activity: {
              name: `Serveur : Hors Ligne`,
              type: "PLAYING"
            }
          })
        })
      }, 30000)

client.on('message', async message => {
    if(message.author.bot) return;
    if(message.content.indexOf(prefix) !== 0) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if(command == "acrux-setup") {
        // ticket-setup #channel

        let channel = message.mentions.channels.first();
        if(!channel) return message.reply("Usage: `!ticket-setup #channel`");

        let sent = await channel.send(new Discord.MessageEmbed()
            .setTitle("Ticket AcruxRoleplay")
            .setDescription("Réagissez pour ouvrir un ticket!")
            .setFooter("By MaathisHD")
            .setColor("#07b1fa")
        );

        sent.react('🎫');
        settings.set(`${message.guild.id}-ticket`, sent.id);

        message.channel.send("Configuration du système de tickets terminée!")
    }

    if(command == "close") {
        if(!message.channel.name.includes("ticket-")) return message.channel.send("Vous ne pouvez pas utiliser ça ici! ")
        message.channel.delete();
    }
});

client.on('messageReactionAdd', async (reaction, user) => {
    if(user.partial) await user.fetch();
    if(reaction.partial) await reaction.fetch();
    if(reaction.message.partial) await reaction.message.fetch();

    if(user.bot) return;

    let ticketid = await settings.get(`${reaction.message.guild.id}-ticket`);

    if(!ticketid) return;

    if(reaction.message.id == ticketid && reaction.emoji.name == '🎫') {
        reaction.users.remove(user);

        reaction.message.guild.channels.create(`ticket-${user.username}`, {
            permissionOverwrites: [
                {
                    id: user.id,
                    allow: ["SEND_MESSAGES", "VIEW_CHANNEL"]
                },
                {
                    id: "804762555457339403",
                    allow: ["SEND_MESSAGES", "VIEW_CHANNEL"]
                },
                {
                    id: reaction.message.guild.roles.everyone,
                    deny: ["VIEW_CHANNEL"]
                }
            ],
            type: 'text'
        }).then(async channel => {
            channel.send(`<@${user.id}>`, new Discord.MessageEmbed().setTitle("Bienvenue sur votre ticket ! ").setDescription("Un membre du staff d'AcruxRôleplay s'occupera de vous au plus vite ! ").setColor("#07b1fa"))
        })
    }
});

client.on('message', message => {
    if (message.type !== 'DEFAULT' || message.author.bot) return
 
    const args = message.content.trim().split(/ +/g)
    const commandName = args.shift().toLowerCase()
    if (!commandName.startsWith(config.prefix)) return
    const command = client.commands.get(commandName.slice(config.prefix.length))
    if (!command) return
    if (command.guildOnly && !message.guild) return message.channel.send('Cette commande ne peut être utilisée que dans un serveur.')
    command.run(message, args, client)
})

client.on('channelCreate', channel => {
    if (!channel.guild) return
    const muteRole = channel.guild.roles.cache.find(role => role.name === 'Muted')
    if (!muteRole) return
    channel.createOverwrite(muteRole, {
        SEND_MESSAGES: false,
        CONNECT: false,
        ADD_REACTIONS: false
    })
})

client.on("message", async message => {
    if (message.content.includes("discord.gg/") || message.content.includes("discordapp/invite") || message.content.includes("discord.io"))
    if (message.member.roles.cache.has("804762555457339403")){
        return
    }else{
        message.delete()
        message.reply(" Il est interdit de publier un lien discord sur ce discord ")
    }
})


})
client.on("guildMemberAdd", member => {
    var channel = client.channels.cache.get(annoncechannel)
    member.roles.add("804758005349351434");
    let embed = new Discord.MessageEmbed()
    .setTitle(member.user.username+ " vient de rejoindre le serveur !")
    .setDescription("N'hésitez pas à lui souhaiter la bienvenue !")
    .addField("Il y'a maintenant "+member.guild.memberCount+" membres sur le serveur", "AcruxRôleplay")
    .setColor("BLUE")
    .setThumbnail(member.user.displayAvatarURL())
    channel.send(embed)
});

client.on("guildMemberRemove", member =>{
    var channel = client.channels.cache.get(annoncechannel)
    let embed = new Discord.MessageEmbed()
    .setTitle(member.user.username+ " vient de quitter le serveur.")
    .setDescription('On espère le revoir bientôt')
    .addField("Il y'a maintenant "+member.guild.memberCount+ " membres sur le serveur", "AcruxRôleplay")
    .setColor("BLUE")
    .setThumbnail(member.user.displayAvatarURL())
    channel.send(embed)
})
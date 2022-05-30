const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const config = require("../config.json");
const redis = require('redis');
const rdb = redis.createClient(config.redis);
rdb.connect();
rdb.on('error', (err) => console.log(err));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('level')
        .setDescription('Shows your XP and level'),
    async execute(interaction) {
        await rdb.hGet(`statbot-levels-${interaction.guild.id}`, interaction.member.id).then(async user_xp => {
            const embed = new MessageEmbed()
                .setColor('#00ff00')
                .setAuthor({ name: interaction.member.displayName, iconURL: interaction.member.displayAvatarURL() })
                .setDescription(`XP: ${user_xp}`)
            await interaction.reply({ embeds: [embed] });
        });
    }
};
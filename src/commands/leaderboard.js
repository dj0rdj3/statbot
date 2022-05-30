const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const config = require("../config.json");
const redis = require('redis');
const rdb = redis.createClient(config.redis);
rdb.connect();
rdb.on('error', (err) => console.log(err));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Shows the server leaderboard'),
    async execute(interaction) {
        await rdb.hGetAll(`statbot-levels-${interaction.guild.id}`).then(async all_xp => {
            all_xp = Object.entries(all_xp);
            function sortXp([a], [b]) {
                return b[1] - a[1];
            }
            all_xp = all_xp.slice(0).sort(sortXp);
            all_xp = await Promise.all(all_xp.map(async u => {
                const user = await interaction.guild.members.fetch(u[0]);
                return u = [user.displayName, u[1]];
            }));

            let leaderboard = "";
            all_xp.forEach((m, i) => {
                leaderboard += `${i + 1}. ${m[0]}: ${m[1]} XP\n`;
            });

            const embed = new MessageEmbed()
                .setColor('#00ff00')
                .setTitle('Leaderboard')
                .setDescription(leaderboard);
            await interaction.reply({ embeds: [embed] });
        });
    }
};
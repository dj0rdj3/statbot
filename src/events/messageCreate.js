const config = require("../config.json");
const redis = require('redis');
const rdb = redis.createClient(config.redis);
rdb.connect();
rdb.on('error', (err) => console.log(err));

module.exports = {
    name: 'messageCreate',
    async execute(message) {
        if (message.author.bot) return;
        await rdb.hGet(`statbot-levels-${message.guild.id}`, message.author.id).then(async user_xp => {
            if (!user_xp) {
                user_xp = 0;
            }
            let xp;

            const length = message.content.length;
            switch (true) {
                case length <= 5:
                    xp = 1;
                    break;
                case length > 5 && length <= 10:
                    xp = 2;
                    break;
                case length > 10 && length <= 15:
                    xp = 3;
                    break;
                case length > 15 && length <= 20:
                    xp = 4;
                    break;
                case length > 20:
                    xp = 5;
                    break;
            }

            xp += parseInt(user_xp);

            await rdb.hSet(`statbot-levels-${message.guild.id}`, message.author.id, xp);
        });
    },
};
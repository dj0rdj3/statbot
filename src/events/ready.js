module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`Active (${client.user.tag})`);
    },
};
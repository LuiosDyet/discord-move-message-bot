import { Client, Intents } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.on('ready', () => {
    console.log('Connected as ' + client.user.tag);
});

client.on('interactionCreate', (interaction) => {
    if (!interaction.isCommand()) return;
    const commandName = interaction.commandName;
    const options = interaction.options;

    if (commandName === 'move') {
        interaction.reply(`Pong! - ${interaction.client.ws.ping}ms`);
    }
});

client.login(process.env.TOKEN);

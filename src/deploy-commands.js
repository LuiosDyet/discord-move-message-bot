import { SlashCommandBuilder } from '@discordjs/builders';
import { Routes } from 'discord-api-types/v10';
import { REST } from '@discordjs/rest';

import dotenv from 'dotenv';
dotenv.config();

const commands = [
    new SlashCommandBuilder().setName('move').setDescription('moves message'),
].map((command) => command.toJSON());

const rest = new REST().setToken(process.env.TOKEN);

try {
    await rest.put(
        Routes.applicationGuildCommands(
            process.env.CLIENT_ID,
            process.env.GUILD_ID
        ),
        {
            body: commands,
        }
    );
} catch (error) {
    console.error(error);
}

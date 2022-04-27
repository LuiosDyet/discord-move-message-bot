const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('move-message')
        .setDescription('Mover mensajes de un canal a otro.')
        .addStringOption((option) =>
            option
                .setName('input')
                .setDescription('Nombre del hilo:Id del mensaje')
        ),
    async execute(interaction) {
        if (
            !interaction.member.permissions.has(
                Permissions.FLAGS.MANAGE_CHANNELS
            )
        ) {
            return interaction.reply({
                content: 'No tenés permisos para realizar esta acción',
                ephemeral: true,
            });
        }

        const value = interaction.options.getString('input');
        const [threadName, messageId] = value.split(':');
        if (!messageId) {
            return interaction.reply({
                content: 'Tenés que elegir un mensaje',
                ephemeral: true,
            });
        }
        if (!threadName) {
            return interaction.reply({
                content: 'Tenés que elegir el nombre del hilo',
                ephemeral: true,
            });
        }
        await interaction.channel.messages
            .fetch(messageId)
            .then(async (msg) => {
                const guild = interaction.guild;
                let channelId = '';
                let channelName = '';
                for (let channel of guild.channels.cache) {
                    channelName = channel[1].name;
                    if (channelName.indexOf(threadName) !== -1) {
                        channelId = channel[1].id;
                        let files = [];
                        if (msg.attachments.size > 0) {
                            for (let attachment of msg.attachments.values()) {
                                files.push(attachment.url);
                            }
                        }
                        await channel[1].send({
                            content: `Mensaje de <@${msg.author.id}>:
                            ${msg.content}`,
                            files,
                        });
                        await msg.react('⏱');
                        try {
                            setTimeout(async () => {
                                await msg.delete();
                            }, 60 * 1000);
                        } catch (error) {
                            console.error(error);
                        }
                        break;
                    }
                }
                if (!channelId) {
                    throw new Error('No se encontró el canal');
                }
                await interaction.reply({
                    content: `<@${msg.author.id}> Tu [mensaje](https://discord.com/channels/${guild.id}/${channelId}/${msg.id}) fue movido a [${channelName}](https://discord.com/channels/${guild.id}/${channelId})`,
                });
                try {
                    setTimeout(async () => {
                        await interaction.deleteReply();
                    }, 24 * 60 * 60 * 1000);
                } catch (error) {
                    console.error(error);
                }
            });
    },
};

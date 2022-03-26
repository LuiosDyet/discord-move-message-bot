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
                for (let channel of guild.channels.cache) {
                    if (channel[1].name === threadName) {
                        let files = [];
                        if (msg.attachments.size > 0) {
                            for (let attachment of msg.attachments.values()) {
                                files.push(attachment.url);
                            }
                        }
                        await channel[1].send({
                            content: `Preguntado por <@${msg.author.id}>:
                            ${msg.content}`,
                            files,
                        });
                        await msg.react('⏱');
                        try {
                            setTimeout(async () => {
                                await msg.delete();
                            }, 4 * 60 * 1000);
                        } catch (error) {
                            console.error(error);
                        }
                    }
                }
                await interaction.reply({
                    content: `<@${msg.author.id}> Tu mensaje fue copiado a ${threadName} y será borrado de este canal en 4 horas`,
                });
                try {
                    setTimeout(async () => {
                        await interaction.deleteReply();
                    }, 4 * 60 * 1000);
                } catch (error) {
                    console.error(error);
                }
            });
    },
};

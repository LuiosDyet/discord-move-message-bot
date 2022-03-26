const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('copy-message')
        .setDescription('Copy the selected message.')
        .addStringOption((option) =>
            option.setName('message').setDescription('The message to copy')
        ),
    async execute(interaction) {
        const message = interaction.options.getString('message');
        console.log('message', message);
        if (!message) {
            return interaction.reply({
                content: 'You need to input a message to copy!',
                ephemeral: true,
            });
        }
        // if (message.author.id !== interaction.user.id) {
        //     return interaction.reply({
        //         content: 'You can only copy messages you sent yourself!',
        //         ephemeral: true,
        //     });
        // }
        // if (message.content.length > 2000) {
        //     return interaction.reply({
        //         content:
        //             'The message you are trying to copy is too long! Please try again with a shorter message.',
        //         ephemeral: true,
        //     });
        // }
        await interaction.channel.messages.fetch(message).then((msg) => {
            console.log('msg', msg);
            interaction.reply({
                content: msg.content,
                ephemeral: true,
            });
        });

        // await interaction.channel.send(message.content);
        // return interaction.reply({
        //     content: 'Successfully copied the message!',
        //     ephemeral: true,
        // });
    },
};

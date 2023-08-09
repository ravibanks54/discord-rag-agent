import {Interaction} from "discord.js";
import commands from "../registries/commandRegistry";

export default async (interaction: Interaction) => {
    console.log("Received interaction.");
    if (!interaction.isCommand()) return;

    const command = commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
}

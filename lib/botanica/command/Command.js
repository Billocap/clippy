const Discord = require("discord.js")
const { SlashCommandBuilder } = require('@discordjs/builders')

/**
 * @typedef {object} CommandContext Context on which the command was run.
 * @property {Discord.Client} client
 * @property {Discord.CommandInteraction} interaction
 */

module.exports = class extends SlashCommandBuilder {
  /**
   * Creates a new command builder
   * 
   * If the name of the command isn't manually set, the name of the command will be the name of the file until the first `.` character
   * 
   * @param {Discord.ApplicationCommandType} type The type of command
   */
  constructor(type = undefined) {
    super()

    if (type) this.type = type

    this.name = undefined
  }

  /**
   * Sets the callback function to be called when the command gets run
   * @param {(context: CommandContext) => void} handler Handler function for the command
   */
  setAction(handler) {
    this.action = handler

    return this
  }
}

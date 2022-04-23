const Discord = require("discord.js")

/**
 * @typedef {object} CommandContext Context on which the command was run.
 * @property {Discord.Client} client
 * @property {Discord.CommandInteraction} interaction
 */

module.exports = class extends Discord.MessageSelectMenu {
  /**
   * Creates a new select menu builder
   * 
   * The name of the select menu will be the name of the file until the first `.` character
   * 
   * @param {Discord.MessageSelectMenu | Discord.MessageSelectMenuOptions | APISelectMenuComponent} [data]
   */
  constructor(data) {
    super(data)

    this.name = undefined
    this.setCustomId = undefined
  }

  /**
   * Sets the name of the select menu
   * @param {string} name The new name
   */
  setName(name) {
    this.name = name

    return this
  }

  /**
   * Sets the callback function to be called when the select menu is clicked
   * @param {(context: CommandContext) => void} handler Handler select menu for the button
   */
  setAction(handler) {
    this.action = handler

    return this
  }
}

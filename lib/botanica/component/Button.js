const Discord = require("discord.js")

/**
 * @typedef {object} CommandContext Context on which the command was run.
 * @property {Discord.Client} client
 * @property {Discord.CommandInteraction} interaction
 */

module.exports = class extends Discord.MessageButton {
  /**
   * Creates a new button builder
   * 
   * The name of the button will be the name of the file until the first `.` character
   * 
   * @param {Discord.MessageButton | Discord.MessageButtonOptions | APIButtonComponent} [data]
   */
  constructor(data) {
    super(data)

    this.name = undefined
    this.setCustomId = undefined
    this.value = undefined
  }

  /**
   * Sets the name of the button
   * @param {string} name The new name
   */
  setName(name) {
    this.name = name

    return this
  }

  /**
   * Sets the value of the button
   * @param {string} value The value
   */
  setValue(value) {
    this.value = value

    return this
  }

  /**
   * Sets the callback function to be called when the button is clicked
   * @param {(context: CommandContext) => void} handler Handler function for the button
   */
  setAction(handler) {
    this.action = handler

    return this
  }
}

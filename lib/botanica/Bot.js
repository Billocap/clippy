const Discord = require("discord.js")
const fs = require("fs")
const path = require("path")
const {randomBytes} = require("crypto")

const {Button} = require("./component")

function loadFiles(folder) {
  const folderPath = path.resolve(folder)
  const folderContent = fs.readdirSync(folderPath)

  return folderContent.map(child => {
    if (fs.lstatSync(`${folderPath}/${child}`).isFile() && child.endsWith(".js")) {
      const childContent = require(`${folderPath}/${child}`)

      return [child.slice(0, child.indexOf(".")), childContent]
    }
  })
}

module.exports = class extends Discord.Client {
  Commands = new Map()

  Buttons = new Map()
  SelectMenus = new Map()

  Components = new Map()

  /**
   * Creates a new Discord bot.
   * @param {string} token Token for the bot.
   * @param {Discord.ClientOptions} options Options for creating the Discord Client.
   */
  constructor(token, options = {}) {
    super(options)

    this.login(token)

    const globalSlashCommands = []
    const guildSlashCommands = []

    loadFiles("commands").forEach(([fileName, command]) => {
      const commandName = command.name || fileName

      command.setName(commandName)
      
      if ("permissions" in command) {
        guildSlashCommands.push(command)
      } else {
        globalSlashCommands.push(command)
      }

      this.Commands.set(commandName, command)
    })

    // loadFiles("components").forEach(([fileName, component]) => {
    //   const componentName = component.name || fileName

    //   component.setName(componentName)

    //   if (component instanceof Button) {
    //     this.Buttons.set(componentName, component)
    //   } else {
    //     this.SelectMenus.set(componentName, component)
    //   }
    // })

    this.on("ready", _ => {
      this.application.commands.set(globalSlashCommands).then(_ => {
        this.emit("applicationCommandsSet")
      })

      this.guilds.cache.forEach(async guild => {
        const commands = await guild.commands.set(guildSlashCommands)

        for (const [commandId] of commands) {
          const applicationCommand = await guild.commands.fetch(commandId)
          
          const {permissions} = this.Commands.get(applicationCommand.name)
          
          if (permissions.has(guild.id)) {
            applicationCommand.permissions.set({
              permissions: permissions.get(guild.id)
            })
          }
        }

        this.emit("guildCommandsSet", guild)
      })
    })

    this.on("interactionCreate", interaction => {
      const context = {
        client: this,
        interaction
      }

      if (interaction.isCommand()) {
        const command = this.Commands.get(interaction.commandName)
    
        if (command) {
          const options = Object.fromEntries(command.options.map(option => {
            const value = interaction.options.get(option.name, option.required)

            return [option.name, value ? value.value : value]
          }))

          command.action(context, options)
        } else {
          interaction.reply("Command not implemented.")
        }
      } else if (interaction.isButton()) {
        const button = this.Components.get(interaction.customId) || this.Buttons.get(interaction.customId.slice(0, -9))

        interaction.value = button.value
    
        if (button) {
          button.action(context)
        } else {
          interaction.reply("Button not implemented.")
        }
      } else if (interaction.isSelectMenu()) {
        const selectMenu = this.Components.get(interaction.customId) || this.Buttons.get(interaction.customId.slice(0, -9))
    
        if (selectMenu) {
          selectMenu.action(context)
        } else {
          interaction.reply("Select menu not implemented.")
        }
      }
    })
  }

  /**
   * 
   * @param {"BUTTON" | "SELECT_MENU"} type 
   * @param {string} name 
   */
  createComponent(type, name) {
    switch (type) {
      case "BUTTON":
        const button = this.Buttons.get(name)

        if (!button) throw new Error(`Button "${name}" don't exists.`)

        let buttonId = name + "-" + randomBytes(4).toString("hex")

        while (this.Components.has(buttonId)) buttonId = name + "-" + randomBytes(4).toString("hex")

        this.Components.set(buttonId, button)

        return new Discord.MessageButton(button)
          .setCustomId(buttonId)

      case "SELECT_MENU":
        const selectMenu = this.SelectMenus.get(name)

        if (!selectMenu) throw new Error(`Select menu "${name}" don't exists.`)

        let id = name + "-" + randomBytes(4).toString("hex")

        while (this.Components.has(id)) id = name + "-" + randomBytes(4).toString("hex")

        this.Components.set(id, selectMenu)

        return new Discord.MessageSelectMenu(selectMenu)
          .setCustomId(id)
    }
  }
}

const {Command} = require("../lib/botanica/command")

module.exports = new Command()
  .setDescription("Twist and Shout")
  .setAction(function({interaction, client}) {
    interaction.reply({
      embeds: [
        {
          color: client.guilds.cache.get("904432510283440190").roles.cache.get("906666763482185829").color,
          description: "Twist and Shout"
        }
      ]
    })
  })

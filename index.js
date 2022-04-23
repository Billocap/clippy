require("dotenv").config()

const Bot = require("./lib/botanica")

const client = new Bot(process.env.BOT_TOKEN, {
  intents: [
    'GUILDS',
    'GUILD_MESSAGE_REACTIONS',
    'GUILD_MESSAGES',
    'GUILD_INVITES',
    'GUILD_VOICE_STATES',
    'GUILD_MEMBERS',
    'GUILD_PRESENCES'
  ],
  partials: [
    'MESSAGE',
    'CHANNEL',
    'REACTION'
  ]
})

client.on("messageReactionAdd", async function(reaction, user) {
  if (reaction.partial) {
		try {
			await reaction.fetch();
		} catch (error) {
			console.error('Something went wrong when fetching the message:', error);

			return;
		}
	}

  if (reaction.emoji.id == "967146251638435840") {
    client.guilds.cache.get("904432510283440190").members.cache.get(user.id).roles.add("967146541552922737")
  }
})

client.on("messageReactionRemove", async function(reaction, user) {
  if (reaction.partial) {
		try {
			await reaction.fetch();
		} catch (error) {
			console.error('Something went wrong when fetching the message:', error);

			return;
		}
	}

  if (reaction.emoji.id == "967146251638435840") {
    client.guilds.cache.get("904432510283440190").members.cache.get(user.id).roles.remove("967146541552922737")
  }
})

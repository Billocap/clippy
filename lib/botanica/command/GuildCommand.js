const Command = require("./Command")

module.exports = class extends Command {
  /**
   * Creates a new guild command builder, guild commands can have special permissions depending on the guild they are added to
   * 
   * If the name of the command isn't manually set, the name of the command will be the name of the file until the first `.` character
   * 
   * @param {Discord.ApplicationCommandType} type The type of command
   */
  constructor(type = undefined) {
    super(type)

    this.permissions = new Map()
  }

  /**
   * Allow the specified users to use this command
   * @param {{guild: string, users: string[]}[]} permissions List of permissions
   */
  allowUsers(permissions) {
    for (const permission of permissions) {
      const guildPermissions = this.permissions.get(permission.guild) || []

      const newPermissions = permission.users.map(user => {
        return {
          type: 'USER',
          id: user,
          permission: true
        }
      })

      this.permissions.set(permission.guild, [
        ...guildPermissions,
        ...newPermissions
      ])
    }

    return this
  }

  /**
   * Allow the users with the specified roles to use this command
   * @param {{guild: string, roles: string[]}[]} permissions List of permissions
   */
  allowRoles(permissions) {
    for (const permission of permissions) {
      const guildPermissions = this.permissions.get(permission.guild) || []

      const newPermissions = permission.roles.map(role => {
        return {
          type: 'ROLE',
          id: role,
          permission: true
        }
      })

      this.permissions.set(permission.guild, [
        ...guildPermissions,
        ...newPermissions
      ])
    }

    return this
  }
}

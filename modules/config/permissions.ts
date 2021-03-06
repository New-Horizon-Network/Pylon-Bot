var f = discord.command.filters;

export const permissions = {
  admin: f.and(
    f.canViewAuditLog(),
    f.canViewGuildInsights(),
    f.canManageChannelWebhooks(),
    f.canManageChannels(),
    f.canManageMessages(),
    f.canManageNicknames(),
    f.canBanMembers(),
    f.canKickMembers(),
    f.canMoveMembers(),
    f.canMuteMembers(),
    f.canMentionEveryone(),
    f.canPrioritySpeaker(),
    f.canReadMessageHistory(),
    f.canEmbedLinks(),
    f.canAddReactions(),
    f.canAttachFiles(),
    f.canConnect(),
    f.canSpeak()
  ),

  mod: f.and(
    f.canManageMessages(),
    f.canManageNicknames(),
    f.canBanMembers(),
    f.canKickMembers(),
    f.canMoveMembers(),
    f.canMuteMembers(),
    f.canMentionEveryone(),
    f.canPrioritySpeaker(),
    f.canReadMessageHistory(),
    f.canEmbedLinks(),
    f.canAddReactions(),
    f.canAttachFiles(),
    f.canConnect(),
    f.canSpeak()
  ),

  helper: f.and(
    f.canManageMessages(),
    f.canManageNicknames(),
    f.canMoveMembers(),
    f.canMuteMembers(),
    f.canMentionEveryone(),
    f.canReadMessageHistory(),
    f.canEmbedLinks(),
    f.canAddReactions(),
    f.canAttachFiles(),
    f.canConnect(),
    f.canSpeak()
  ),

  user: f.and(
    f.canReadMessageHistory(),
    f.canEmbedLinks(),
    f.canAddReactions(),
    f.canAttachFiles(),
    f.canConnect(),
    f.canSpeak()
  ),

  perms: [
    'CREATE_INSTANT_INVITE',
    'KICK_MEMBERS',
    'BAN_MEMBERS',
    'ADMINISTRATOR',
    'MANAGE_CHANNELS',
    'MANAGE_GUILD',
    'ADD_REACTIONS',
    'VIEW_AUDIT_LOG',
    'PRIORITY_SPEAKER',
    'STREAM',
    'VIEW_CHANNEL',
    'SEND_MESSAGES',
    'SEND_TTS_MESSAGES',
    'MANAGE_MESSAGES',
    'EMBED_LINKS',
    'ATTACH_FILES',
    'READ_MESSAGE_HISTORY',
    'MENTION_EVERYONE',
    'USE_EXTERNAL_EMOJIS',
    'VIEW_GUILD_ANALYTICS',
    'CONNECT',
    'SPEAK',
    'MUTE_MEMBERS',
    'DEAFEN_MEMBERS',
    'MOVE_MEMBERS',
    'USE_VAD',
    'CHANGE_NICKNAME',
    'MANAGE_NICKNAMES',
    'MANAGE_ROLES',
    'MANAGE_WEBHOOKS',
    'MANAGE_EMOJIS',
    'REQUEST_TO_SPEAK',
    'MANAGE_THREADS',
    'USE_PUBLIC_THREADS',
    'USE_PRIVATE_THREADS',
    'USE_SLASH_COMMANDS'
  ]
};
export default permissions;

const members = [{
  name: 'Anthony Fu',
  username: 'antfu',
  role: 'member',
  avatar: { src: 'https://ipx.nuxt.com/f_auto,s_192x192/gh_avatar/antfu' }
}, {
  name: 'Baptiste Leproux',
  username: 'larbish',
  role: 'member',
  avatar: { src: 'https://ipx.nuxt.com/f_auto,s_192x192/gh_avatar/larbish' }
}]

export default eventHandler(async () => {
  return members
})

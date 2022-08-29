/**
 * Insert application wide common items here, they're all exported by frontend and backend common.js respectively
 */

const inProduction = process.env.NODE_ENV === 'production'

const adminLevels = (label) => {
  switch (label) {
    case 'user':
      return 1
    case 'editor':
      return 2
    case 'admin':
      return 3
    default:
      return 0
  }
}

module.exports = {
  inProduction,
  adminLevels,
}

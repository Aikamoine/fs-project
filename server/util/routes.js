const Router = require('express')
const messages = require('@controllers/messagesController')
const recipes = require('@controllers/recipesController')
const users = require('@controllers/usersController')
const shoppinglists = require('@controllers/shoppinglistsController')

const router = Router()

router.get('/recipes', recipes.getAll)
router.get('/recipes/:urlName', recipes.getRecipeDetails)
router.post('/recipes', recipes.addRecipe)
router.post('/users', users.postUser)
router.post('/login', users.login)
router.post('/logout', users.logout)
router.get('/shoppinglist', shoppinglists.getList)
router.post('/shoppinglist/:id', shoppinglists.addToList)
router.delete('/shoppinglist', shoppinglists.deleteList)
router.get('/messages', messages.getAll)
router.post('/messages', messages.create)
router.delete('/messages/:id', messages.destroy)

module.exports = router

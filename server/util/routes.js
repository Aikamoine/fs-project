const Router = require('express')
const messages = require('@controllers/messagesController')
const recipes = require('@controllers/recipesController')
const users = require('@controllers/usersController')
const shoppinglists = require('@controllers/shoppinglistsController')
const sessionValidator = require('@middleware/sessionValidator')

const router = Router()

router.use('/shoppinglist', sessionValidator)
router.get('/shoppinglist', shoppinglists.getList)
router.post('/shoppinglist', shoppinglists.addToList)
router.delete('/shoppinglist', shoppinglists.deleteList)

router.use('/deletefromshoppinglist', sessionValidator)
router.post('/deletefromshoppinglist', shoppinglists.deleteSelected)

router.get('/recipes', recipes.getAll)
router.get('/recipes/:urlName', recipes.getRecipeDetails)
router.post('/recipes', sessionValidator, recipes.addRecipe)
router.post('/users', users.postUser)
router.post('/login', users.login)
router.post('/logout', users.logout)

router.get('/messages', messages.getAll)
router.post('/messages', messages.create)
router.delete('/messages/:id', messages.destroy)

module.exports = router

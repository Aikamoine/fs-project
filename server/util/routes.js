const Router = require('express')
const messages = require('@controllers/messagesController')
const recipes = require('@controllers/recipesController')

const router = Router()

router.get('/recipes', recipes.getAll)
router.get('/recipes/:urlName', recipes.getRecipeDetails)
router.get('/messages', messages.getAll)
router.post('/messages', messages.create)
router.delete('/messages/:id', messages.destroy)

module.exports = router

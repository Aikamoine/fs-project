const Router = require('express')
const recipes = require('@controllers/recipesController')
const users = require('@controllers/usersController')
const shoppinglists = require('@controllers/shoppinglistsController')
const ingredients = require('@controllers/ingredientsController')
const sessionValidator = require('@middleware/sessionValidator')

const router = Router()

router.use('/shoppinglist', sessionValidator)
router.get('/shoppinglist', shoppinglists.getList)
router.post('/shoppinglist', shoppinglists.addToList)
router.delete('/shoppinglist', shoppinglists.deleteList)

router.use('/deletefromshoppinglist', sessionValidator)
router.post('/deletefromshoppinglist', shoppinglists.deleteSelected)

router.use('/ingredients', sessionValidator)
router.get('/ingredients', ingredients.getIngredients)
router.put('/ingredients', ingredients.addIngredient)
router.put('/ingredients/replace', ingredients.replaceIngredient)
router.get('/ingredients/names', ingredients.getIngredientNames)
router.get('/ingredients/fineli/:id', ingredients.getFineliIngredients)
router.delete('/ingredients/:id', ingredients.deleteIngredient)

router.get('/recipes', recipes.getAll)
router.get('/recipes/:urlName', recipes.getRecipeDetails)
router.post('/recipes/:urlName', sessionValidator, recipes.editRecipe)
router.post('/recipes', sessionValidator, recipes.addRecipe)
router.delete('/recipes/:id', sessionValidator, recipes.deleteRecipe)

router.post('/users', users.postUser)
router.get('/users/isadmin', sessionValidator, users.isAdmin)
router.post('/login', users.login)
router.post('/logout', users.logout)

module.exports = router

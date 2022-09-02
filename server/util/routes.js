const Router = require('express')
const recipes = require('@controllers/recipesController')
const users = require('@controllers/usersController')
const shoppinglists = require('@controllers/shoppinglistsController')
const ingredients = require('@controllers/ingredientsController')
const tags = require('@controllers/tagsController')
const sessionValidator = require('@middleware/sessionValidator')

const router = Router()

router.use('/shoppinglist', sessionValidator)
router.get('/shoppinglist', shoppinglists.getList)
router.get('/shoppinglist/recipes', shoppinglists.getListRecipes)
router.post('/shoppinglist', shoppinglists.addToList)
router.delete('/shoppinglist', shoppinglists.deleteList)
router.post('/shoppinglist/removerecipe', shoppinglists.removeRecipe)

router.use('/deletefromshoppinglist', sessionValidator)
router.post('/deletefromshoppinglist', shoppinglists.deleteSelected)

router.get('/ingredients', ingredients.getIngredients)
router.put('/ingredients', sessionValidator, ingredients.addIngredient)
router.put('/ingredients/update', sessionValidator, ingredients.updateIngredient)
router.get('/ingredients/fineli/:id', sessionValidator, ingredients.getFineliIngredients)
router.delete('/ingredients/:id', sessionValidator, ingredients.deleteIngredient)

router.get('/recipes', recipes.getAll)
router.get('/recipes/:urlName', recipes.getRecipeDetails)
router.post('/recipes/:urlName', sessionValidator, recipes.editRecipe)
router.post('/recipes', sessionValidator, recipes.addRecipe)
router.delete('/recipes/:id', sessionValidator, recipes.deleteRecipe)

router.get('/tags', tags.getTags)
router.post('/tags', sessionValidator, tags.saveTag)
router.delete('/tags/:id', sessionValidator, tags.deleteTag)

router.post('/users', users.postUser)
router.get('/users/info', sessionValidator, users.getUserInfo)
router.post('/login', users.login)
router.delete('/logout', sessionValidator, users.logout)

module.exports = router

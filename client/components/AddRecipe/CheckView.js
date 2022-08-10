import React from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Table from 'react-bootstrap/Table'

import { addRecipe } from 'Utilities/services/recipes'

const splitOneIngredient = (ingredient) => {
  const split = ingredient.split(' ')

  if (split.length === 1) {
    return { name: split[0].replace('_', ' '), amount: null, unit: null }
  }
  if (split.length === 2) {
    return { name: split[1].replace('_', ' '), amount: 1, unit: split[0] }
  }
  const firstIndex = ingredient.indexOf(' ')
  const secondIndex = ingredient.indexOf(' ', firstIndex + 1)

  return ({
    name: ingredient.substring(secondIndex + 1).replace('_', ' '),
    amount: ingredient.substring(0, firstIndex).replace(',', '.'),
    unit: ingredient.substring(firstIndex + 1, secondIndex),
  })
}

const formatIngredients = (ingredients) => {
  const split = ingredients.split('\n')
  const splitIngredients = split.map((i) => splitOneIngredient(i))
  return splitIngredients
}

const formatUrlName = (name) => {
  const spacesToUnderScore = name.replace(' ', '_').toLowerCase()
  const umlautAToA = spacesToUnderScore.replace('ä', 'a')
  const umlautOToO = umlautAToA.replace('ö', 'o')

  return umlautOToO.replace(/[^a-z_]/g, '')
}

const CheckView = ({
  recipeInfo, ingredients, steps, ingredientList,
}) => {
  const navigate = useNavigate()

  const splitIngredients = formatIngredients(ingredients)
  const splitSteps = steps.split('\n')
  const { name, servings, time } = recipeInfo
  const urlName = formatUrlName(name)

  const handleSubmit = async (event) => {
    event.preventDefault()

    toast('Reseptiä lisätään. Sinut ohjataan seuraavalle sivulle, kun lisäys on valmis')
    await addRecipe(
      {
        name,
        servings,
        time,
        urlName,
        ingredients: splitIngredients,
        steps: splitSteps,
      },
    )

    navigate('/recipes', { replace: false })
  }

  return (
    <div>
      <div>
        Reseptin yksilöivä nettiosoite: {urlName}
      </div>

      <Table striped bordered>
        <thead>
          <tr>
            <th>Määrä</th>
            <th>Yksikkö</th>
            <th>Ainesosa</th>
          </tr>
        </thead>
        <tbody>
          {splitIngredients.map((ingredient) => (
            <tr key={ingredient.name + ingredient.amount}>
              <td>{ingredient.amount}</td>
              <td>{ingredient.unit}</td>
              <td>{ingredientList.includes(ingredient.name) ? ingredient.name : `${ingredient.name} TÄTÄ EI LÖYDY AINESOSISTA!`}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <br />
      {splitSteps.map((step, i) => (
        <div key={step}>{`${i + 1}. ${step}`}</div>
      ))}
      <br />
      <button type="submit" onClick={handleSubmit}>
        Lisää resepti
      </button>
    </div>
  )
}

export default CheckView

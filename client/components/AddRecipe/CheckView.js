import React from 'react'
import { useNavigate } from 'react-router-dom'

import { addRecipe } from 'Utilities/services/recipes'
import { localStorageName } from 'Utilities/common'

const formatUrlName = (name) => {
  const spacesToUnderScore = name.replace(' ', '_').toLowerCase()
  const umlautAToA = spacesToUnderScore.replace('ä', 'a')
  const umlautOToO = umlautAToA.replace('ö', 'o')

  return umlautOToO.replace(/[^a-z_]/g, '')
}

const CheckView = ({
  recipeInfo, ingredients, steps, formatIngredients,
}) => {
  const navigate = useNavigate()

  const splitIngredients = formatIngredients(ingredients)
  const splitSteps = steps.split('\n')
  const { name, servings, time } = recipeInfo
  const urlName = formatUrlName(name)

  const handleSubmit = async (event) => {
    event.preventDefault()

    await addRecipe(
      {
        name,
        servings,
        time,
        urlName,
        ingredients: splitIngredients,
        steps: splitSteps,
      },
      JSON.parse(window.localStorage.getItem(localStorageName)),
    )

    navigate('/recipes', { replace: false })
  }

  return (
    <div>
      <div>
        Reseptin yksilöivä nettiosoite: {urlName}
      </div>

      <table>
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
              <td>{ingredient.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
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

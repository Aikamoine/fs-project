import React, { useState } from 'react'

import CheckView from './CheckView'

const splitOneIngredient = (ingredient) => {
  const split = ingredient.split(' ')
  console.log('split', split)

  if (split.length === 1) {
    return { name: split[0], amount: 1, unit: '' }
  }
  if (split.length === 2) {
    return { name: split[1], amount: split[0], unit: 'kpl' }
  }
  const firstIndex = ingredient.indexOf(' ')
  const secondIndex = ingredient.indexOf(' ', firstIndex + 1)

  return ({
    name: ingredient.substring(secondIndex + 1),
    amount: ingredient.substring(0, firstIndex),
    unit: ingredient.substring(firstIndex + 1, secondIndex),
  })
}

const formatIngredients = (ingredients) => {
  console.log('unformatted ingredients', ingredients)
  const split = ingredients.split('\n')
  const splitIngredients = split.map((i) => splitOneIngredient(i))
  console.log('formatted ingredients', splitIngredients)
  return splitIngredients
}

const AddRecipe = () => {
  const [name, setName] = useState('')
  const [servings, setServings] = useState(0)
  const [time, setTime] = useState('')
  const [ingredients, setIngredients] = useState('')
  const [steps, setSteps] = useState('')
  const [postCheck, setPostCheck] = useState(false)

  const handleCheck = async (event) => {
    event.preventDefault()
    setPostCheck(true)
  }

  const nameChange = ({ target }) => setName(target.value)
  const servingsChange = ({ target }) => setServings(target.value)
  const timeChange = ({ target }) => setTime(target.value)
  const ingredientsChange = ({ target }) => setIngredients(target.value)
  const stepsChange = ({ target }) => setSteps(target.value)

  return (
    <div>
      <form onSubmit={handleCheck}>
        <div>
          Reseptin nimi: <input id="name" value={name} onChange={nameChange} />
        </div>
        <div>
          Annoksia: <input id="servings" type="number" value={servings} onChange={servingsChange} />
        </div>
        <div>
          Työaika: <input id="time" value={time} onChange={timeChange} />
        </div>
        <br />
        <div>
          <div>Ainesosat</div>
          <div>
            <textarea id="ingredients" onChange={ingredientsChange} rows="8" cols="50" maxLength="10000" />
          </div>
        </div>
        <br />
        <div>
          <div>Työvaiheet</div>
          <div>
            <textarea id="steps" onChange={stepsChange} rows="8" cols="100" maxLength="10000" />
          </div>
        </div>
        <br />
        <button type="submit" color="purple">
          Tarkista
        </button>
      </form>
      <br />
      {postCheck ? <CheckView recipeInfo={{ name, time, servings }} ingredients={ingredients} steps={steps} formatIngredients={formatIngredients} /> : <div /> }
    </div>
  )
}

export default AddRecipe

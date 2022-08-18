/* eslint no-param-reassign: ["error", { "props": false }] */
import React from 'react'
import Table from 'react-bootstrap/Table'

const addMultiplier = (ingredient) => {
  switch (ingredient.unit) {
    case 'g':
      ingredient.multiplier = Number(ingredient.amount) / 100
      break
    case 'ml':
      ingredient.multiplier = Number(ingredient.amount) / 100
      break
    case 'mm': // maustemitta, 1 ml
      ingredient.multiplier = Number(ingredient.amount) / 1000
      break
    case 'tl':
      ingredient.multiplier = (Number(ingredient.amount) * 5) / 100
      break
    case 'rkl':
      ingredient.multiplier = (Number(ingredient.amount) * 15) / 100
      break
    case 'dl':
      ingredient.multiplier = Number(ingredient.amount)
      break
    case 'kpl':
      ingredient.multiplier = (Number(ingredient.amount) * ingredient.unitweight) / 100
      break
    case 'pkt':
      ingredient.multiplier = (Number(ingredient.amount) * ingredient.unitweight) / 100
      break
    default:
      ingredient.multiplier = 0
      break
  }
}

const addNutrition = (ingredients, nutrient) => {
  let total = 0
  ingredients.forEach((ingredient) => {
    total += Number(ingredient[nutrient]) * ingredient.multiplier
  })
  return Math.round(total * 100) / 100
}

const NutritionView = ({ ingredients, servings }) => {
  ingredients.forEach((ingredient) => {
    addMultiplier(ingredient)
  })

  const nutrition = [
    { fin: 'Kaloria', value: addNutrition(ingredients, 'kcal') },
    { fin: 'Rasvaa', value: addNutrition(ingredients, 'fat') },
    { fin: 'Tyydyttynyttä rasvaa', value: addNutrition(ingredients, 'satfat') },
    { fin: 'Hiilihydraattia', value: addNutrition(ingredients, 'carbs') },
    { fin: 'Sokeria', value: addNutrition(ingredients, 'sugars') },
    { fin: 'Proteiinia', value: addNutrition(ingredients, 'protein') },
  ]

  const ignored = ingredients.filter((i) => i.multiplier === 0 || Number(i.kcal) === 0)
  return (
    <div>
      <Table>
        <thead>
          <tr>
            <td>Ravintoaine</td>
            <td>Reseptissä</td>
            <td>Annoksessa</td>
          </tr>
        </thead>
        <tbody>
          {nutrition.map((nutrient) => (
            <tr key={nutrient.fin}>
              <td><b>{nutrient.fin}</b></td>
              <td>{nutrient.value}</td>
              <td>{Math.round((nutrient.value / servings) * 100) / 100}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div>Tiedoissa huomioimatta: {ignored && ignored.map((i) => `${i.name}, `)}</div>
    </div>
  )
}
export default NutritionView

import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Table from 'react-bootstrap/Table'
import Select from 'react-select'

const RecipeList = ({ recipes }) => {
  const [nameFilter, setNameFilter] = useState('')
  const [numberFilter, setNumberFilter] = useState(0)
  const [timeOptions, setTimeOptions] = useState([])
  const [timeFilter, setTimeFilter] = useState([])
  if (!recipes) return null

  useEffect(() => {
    const times = recipes.map((r) => r.time)
    const uniqueTimes = [...new Set(times)]
    uniqueTimes.sort()
    setTimeOptions(uniqueTimes.map((t) => ({ value: t, label: t })))
  }, [recipes])

  let filteredRecipes = JSON.parse(JSON.stringify(recipes))

  const nameFilterChange = (target) => {
    setNameFilter(target)
  }

  const numberChange = ({ target }) => setNumberFilter(target.value)

  const timesChange = (selectedOptions) => {
    setTimeFilter(selectedOptions)
  }

  if (nameFilter) {
    filteredRecipes = JSON.parse(JSON.stringify(
      recipes.filter((r) => r.name.toLowerCase().includes(nameFilter.toLowerCase())),
    ))
  }

  if (numberFilter > 0) {
    filteredRecipes = JSON.parse(JSON.stringify(
      filteredRecipes.filter((r) => r.servings >= numberFilter),
    ))
  }

  if (timeFilter.length > 0) {
    console.log('timefilter', timeFilter)
    filteredRecipes = JSON.parse(JSON.stringify(
      filteredRecipes.filter((r) => timeFilter.findIndex((t) => r.time === t.label) >= 0),
    ))
  }

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Resepti</th>
          <th>Annoksia</th>
          <th>Työaika</th>
        </tr>
        <tr>
          <td><input value={nameFilter} onChange={({ target }) => nameFilterChange(target.value)} /></td>
          <td><input type="number" value={numberFilter} onChange={numberChange} /></td>
          <td><Select options={timeOptions} isMulti onChange={timesChange}/></td>
        </tr>
      </thead>
      <tbody>
        {filteredRecipes.map((recipe) => (
          <tr key={recipe.id}>
            <td>
              <Link to={`/recipes/${recipe.urlName}`}>
                {recipe.name}
              </Link>
            </td>
            <td>{recipe.servings}</td>
            <td>{recipe.time}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

export default RecipeList

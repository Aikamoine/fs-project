import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Table from 'react-bootstrap/Table'
import Select from 'react-select'

// TODO: is there a point to this parse(strinfigy) shuffle??
const RecipeList = ({ recipes }) => {
  const [nameFilter, setNameFilter] = useState('')
  const [numberFilter, setNumberFilter] = useState(0)
  const [timeOptions, setTimeOptions] = useState([])
  const [timeFilter, setTimeFilter] = useState([])
  const [tagOptions, setTagOptions] = useState([])
  const [tagFilter, setTagFilter] = useState([])
  if (!recipes) return null

  const formatTimeOptions = () => {
    const times = recipes.map((r) => r.time)
    const uniqueTimes = [...new Set(times)]
    uniqueTimes.sort()
    setTimeOptions(uniqueTimes.map((t) => ({ value: t, label: t })))
  }

  const formatTagOptions = () => {
    const tags = []
    recipes.forEach((recipe) => {
      recipe.tags.forEach((tag) => {
        if (!tags.includes(tag.name)) {
          tags.push(tag.name)
        }
      })
    })
    tags.sort()
    console.log('tags', tags)
    setTagOptions(tags.map((tag) => ({ value: tag, label: tag })))
  }

  useEffect(() => {
    formatTimeOptions()
    formatTagOptions()
  }, [recipes])

  let filteredRecipes = JSON.parse(JSON.stringify(recipes))
  const nameFilterChange = (target) => {
    setNameFilter(target)
  }

  const numberChange = ({ target }) => setNumberFilter(target.value)

  const timesChange = (selectedOptions) => {
    setTimeFilter(selectedOptions)
  }

  const tagsChange = (selectedOptions) => {
    setTagFilter(selectedOptions)
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
    filteredRecipes = JSON.parse(JSON.stringify(
      filteredRecipes.filter((r) => timeFilter.findIndex((t) => r.time === t.label) >= 0),
    ))
  }

  if (tagFilter.length > 0) {
    filteredRecipes = filteredRecipes.filter((r) => r.tags.some((tag) => tagFilter.findIndex((t) => t.label === tag.name) >= 0))
  }

  console.log('filteredrecipes', filteredRecipes)
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Resepti</th>
          <th style={{ width: '8em' }}>Annoksia</th>
          <th>Työaika</th>
          <th>Tunnisteet</th>
        </tr>
        <tr>
          <td><input value={nameFilter} onChange={({ target }) => nameFilterChange(target.value)} /></td>
          <td><input style={{ width: '8em' }} type="number" value={numberFilter} onChange={numberChange} /></td>
          <td><Select options={timeOptions} isMulti onChange={timesChange} /></td>
          <td><Select options={tagOptions} isMulti onChange={tagsChange} /></td>
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
            <td>
              {recipe.tags.map((tag, index) => (index === 0 ? tag.name : `, ${tag.name}`))}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

export default RecipeList

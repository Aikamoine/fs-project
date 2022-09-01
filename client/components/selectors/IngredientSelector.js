import React, { useEffect, useState } from 'react'
import Select from 'react-select'

import { getIngredients } from 'Utilities/services/ingredients'

const IngredientSelector = ({ onChange, isClearable }) => {
  const [ingredients, setIngredients] = useState([])

  const handleGetIngredients = async () => {
    const ingredientList = await getIngredients()
    const ingredientOptions = ingredientList.map((i) => ({ value: i.id, label: i.name }))
    setIngredients(ingredientOptions)
  }

  useEffect(() => {
    handleGetIngredients()
  }, [])

  return (
    <div>
      <Select options={ingredients} onChange={onChange} isClearable={isClearable} />
    </div>
  )
}

export default IngredientSelector

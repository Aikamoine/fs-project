import React from 'react'
import Select from 'react-select'

const SideDishSelector = ({ sideDishes, setSideDish, servings }) => {
  const onChange = (selectedOptions) => {
    if (selectedOptions) {
      const selected = sideDishes.find(({ id }) => id === selectedOptions.value)
      setSideDish({
        amount: selected.servingSize * servings,
        carbs: selected.carbs,
        fat: selected.fat,
        id: selected.id,
        kcal: selected.kcal,
        name: selected.name,
        protein: selected.protein,
        satfat: selected.satfat,
        sugars: selected.sugars,
        unit: selected.unitweight > 0 ? 'kpl' : 'g',
        unitweight: selected.unitweight,
        volumeweight: selected.volumeweight,
      })
    } else {
      setSideDish(null)
    }
  }
  const options = sideDishes.map((dish) => ({ value: dish.id, label: dish.name }))
  return (
    <div>
      <div>
        Valitse lisuke annokseen:
      </div>
      <Select options={options} onChange={onChange} isClearable />
      <br />
    </div>
  )
}

export default SideDishSelector

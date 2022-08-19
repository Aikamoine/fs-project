import React, { useEffect, useState } from 'react'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import Accordion from 'react-bootstrap/Accordion'

import { getIngredients } from 'Utilities/services/ingredients'

const IngredientView = () => {
  const [ingredientList, setIngredientList] = useState([])
  const [filter, setFilter] = useState('')

  const handleGetIngredients = async () => {
    const allIngredients = await getIngredients()
    setIngredientList(allIngredients)
  }

  useEffect(() => {
    handleGetIngredients()
  }, [])

  const toggleDetails = (id) => {
    const ingredient = ingredientList.filter((i) => i.id === id)[0]
    ingredient.details = !ingredient.details
    setIngredientList([...ingredientList])
  }

  const filtered = ingredientList.filter((i) => i.name.includes(filter.toLowerCase()) || i.edited)

  return (
    <Accordion defaultActiveKey="0">
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nimi</th>
          </tr>
          <tr>
            <td>
              suodatus: <input value={filter} onChange={({ target }) => setFilter(target.value)} />
            </td>
          </tr>
        </thead>
        <tbody>
          {filtered.map((ingredient, index) => (
            <tr key={ingredient.id}>
              <td>
                <Accordion.Item eventKey={index + 1}>
                  <Accordion.Header>
                    <div>
                      {ingredient.name}
                    </div>
                  </Accordion.Header>
                  <Accordion.Body>
                    <Table>
                      <thead>
                        <tr>
                          <th>kcal</th>
                          <th>rasva</th>
                          <th>Tyydyt. rasva</th>
                          <th>hiilihydraatti</th>
                          <th>sokeri</th>
                          <th>proteiini</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{ingredient.kcal}</td>
                          <td>{ingredient.fat}</td>
                          <td>{ingredient.satfat}</td>
                          <td>{ingredient.carbs}</td>
                          <td>{ingredient.sugars}</td>
                          <td>{ingredient.protein}</td>
                        </tr>
                      </tbody>
                    </Table>
                    <Table>
                      <thead>
                        <tr>
                          <th>Kappale painaa (grammaa)</th>
                          <th>Desi painaa (grammaa)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{ingredient.unitweight}</td>
                          <td>{ingredient.volumeweight}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </Accordion.Body>
                </Accordion.Item>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Accordion>
  )
}

export default IngredientView

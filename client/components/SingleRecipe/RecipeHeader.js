import React from 'react'
import Button from 'react-bootstrap/Button'
import { adminLevels } from 'Utilities/common'
import { useGlobalState } from 'Components/GlobalState'

const RecipeHeader = ({
  recipe,
  setIsEditing,
}) => {
  const [globalState] = useGlobalState()
  return (
    <div>
      <h2>
        {recipe.name}
        {(globalState.id === recipe.userId || globalState.adminLevel >= adminLevels('admin'))
          && (
            <Button variant="link" onClick={() => setIsEditing(true)}>
              Muokkaa reseptiä
            </Button>
          )}
      </h2>
      <div>
        {`${recipe.servings} annosta - työaika noin: ${recipe.time}`}
      </div>
      <br />
      <div>
        {recipe.info}
      </div>
    </div>
  )
}
export default RecipeHeader

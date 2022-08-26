import React from 'react'
import Button from 'react-bootstrap/Button'

const RecipeHeader = ({
  recipe,
  isAdmin,
  loggedUser,
  setIsEditing,
}) => (
  <div>
    <h2>
      {recipe.name}
      {(loggedUser && (loggedUser.id === recipe.user_id || isAdmin))
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
export default RecipeHeader

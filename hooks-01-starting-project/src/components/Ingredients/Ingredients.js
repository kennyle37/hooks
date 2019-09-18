import React, { useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';

function Ingredients() {
  const [ userIngredients, setUserIngredients ] = useState([]);
  const [ isLoading, setIsLoading ] = useState(false);
  const [ error, setError ] = useState();

  const addIngredientHandler = ingredient => {
    setIsLoading(true);

    fetch('https://react-hooks-ddcf2.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' }
    })
    .then(response => {
      setIsLoading(false);
      return response.json();
    })
    .then(responseData => { 
      setUserIngredients(prevIngredients => [
        ...prevIngredients, 
        { id: responseData.name, ...ingredient }
      ]);
    })
  }

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    setUserIngredients(filteredIngredients);
  }, []);

  const removeItemHandler = itemId => {
    fetch(`https://react-hooks-ddcf2.firebaseio.com/ingredients/${itemId}.json`, {
      method: 'DELETE',
    })
    .then(res => {
      setUserIngredients(prevIngredients => prevIngredients.filter(prevIngredient => prevIngredient.id !== itemId))
    })
    .catch(error => {
      setError('Something went wrong');
    })
  }


  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} loading={isLoading} />
      {error && <ErrorModal>{error}</ErrorModal>}
      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        <IngredientList ingredients={userIngredients} onRemoveItem={removeItemHandler} />
        {/* Need to add list here! */}
      </section>
    </div>
  );
}

export default Ingredients;

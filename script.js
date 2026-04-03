const addButton = document.getElementById('addIngredient');
const ingredientInput = document.getElementById('ingredientName');
const ingredientList = document.getElementById('ingredientList');

loadIngredients();

function addIngredient(){
    const ingredient = ingredientInput.value;
    if (ingredient){
        createIngredElement(ingredient);
        ingredientInput.value = '';

        saveIngredient();
    }
    else {
        alert('Please enter an ingredient')
    }

}

addButton.addEventListener('click', addIngredient);

function createIngredElement (ingredient){
    const listItem  = document.createElement('li');
    listItem.textContent = ingredient;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    listItem.appendChild(deleteButton);

    deleteButton.addEventListener('click', function(){
        ingredientList.removeChild(listItem);
        saveIngredient();
    })

    ingredientList.appendChild(listItem);
}

function saveIngredient(){
    let ingredients = [];
    ingredientList.querySelectorAll('li').forEach(function(item){
        ingredients.push(item.textContent.replace('Delete', ''));
    });

    localStorage.setItem('ingredients', JSON.stringify(ingredients));
}

function loadIngredients(){
    const ingredients = JSON.parse(localStorage.getItem('ingredients')) || [];
    ingredients.forEach(createIngredElement);
}
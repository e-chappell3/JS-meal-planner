function Ingredient(name, price, isOwned){
    this.name = name;
    this.price = price;
    this.isOwned = isOwned;
}

function Recipe(ingreds){
    this.ingreds = ingreds;
    let cost = 0;
    let totalCost = 0 + ingreds.forEach(sum);
    let required = setMake(required);
    cost = 0;
    let reqCost = 0 + required.forEach(sum);
    if (required.length == 0){
        let canMake = true;
    }
    else{
        let canMake = false;
    }
}

function sum(num){
    cost += num;
}

function setMake(required){
    for (let i = 0; i < ingreds.length(); i++){
        let curr = ingreds[i];
        if (curr.isOwned == false){
            if (canMake != false){
                canMake = false;
            }
            if(required.includes(curr) == false){
                required.push(curr);
            }
        }
        else if (required.includes(curr)){
            const index = required.indexOf(curr);
            if (index > -1){
                required.splice(index, 1);
            }
        }
    }

    return required;
}

const addButton = document.getElementById('addIngredient');
const ingredientInput = document.getElementById('ingredientName');
const ingredientList = document.getElementById('ingredientList');

loadIngredients();
addButton.addEventListener('click', addIngredient);

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
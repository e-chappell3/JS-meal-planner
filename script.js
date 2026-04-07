function Ingredient(name, isOwned){
    this.name = name;
    this.isOwned = isOwned;
}

function Recipe(ingreds){
    this.ingreds = ingreds;
    let required = setMake(required);
    if (required.length == 0){
        let canMake = true;
    }
    else{
        let canMake = false;
    }
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

const addButton = document.getElementById('add');
const ingredientInput = document.getElementById('ingredientName');
const ingredientList = document.getElementById('ingredientList');
const ownedList = document.getElementById('ownedList');

const fridgeButton = document.getElementById("fridgeBox");
const noteButton = document.getElementById("noteBox");
const ovenButton = document.getElementById("ovenBox");

loadIngredients();
addButton.addEventListener('click', addIngredient);
fridgeButton.addEventListener('click', fridgeView);
noteButton.addEventListener('click', listView);
ovenButton.addEventListener('click', ovenView);

function fridgeView(){
    document.location.href = "https://e-chappell3.github.io/meal-planner/fridge";
}

function listView(){
    document.location.href = "https://e-chappell3.github.io/meal-planner/list";
}

function ovenView(){
    document.location.href = "https://e-chappell3.github.io/meal-planner/oven";
}

function addIngredient(){
    const i = ingredientInput.value;
    if (ingredientInput.value){
        createIngredElement(i, false);
        ingredientInput.value = '';

        saveIngredient();
    }
    else {
        alert('Please enter an ingredient')
    }

}

function createIngredElement (i, owned){
    const ingredItem  = document.createElement('li');
    ingredItem.textContent = i;
    const ownedItem  = document.createElement('li');
    ownedItem.textContent = owned;
    
    let deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'deleteTask';

    ingredItem.appendChild(deleteButton);

    deleteButton.addEventListener('click', function(){
        ingredientList.removeChild(ingredItem);
        saveIngredient();
    })

    ingredientList.appendChild(ingredItem);
    ownedList.appendChild(ownedItem);
}

function saveIngredient(){
    let ingredients = [];
    ingredientList.querySelectorAll('li').forEach(function(item){
        ingredients.push(item.textContent.replace('Delete', ''));
        let arr = Array.from(ingredientList);
        ingredients.push(ownedList[arr.indexOf(item)]);
    });

    localStorage.setItem('ingredients', JSON.stringify(ingredients));
}

function loadIngredients(){
    const ingredients = JSON.parse(localStorage.getItem('ingredients')) || [];

    for (let i = 0; i < ingredients.length/2; i++){
        createIngredElement(ingredients[i], ingredients[i+1]);
    }
}
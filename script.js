function Ingredient(name, price, isOwned){
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

const fridgeButton = document.getElementById("fridgeBox");
const noteButton = document.getElementById("noteBox");
const ovenButton = document.getElementById("ovenBox");

loadIngredients();
addButton.addEventListener('click', addIngredient);
fridgeButton.addEventListener('click', fridgeView);
noteButton.addEventListener('click', listView);
ovenButton.addEventListener('click', ovenView);

function fridgeView(){
    document.location.href = "fridge.html";
}

function listView(){
    document.location.href = "list.html";
}

function ovenView(){
    document.location.href = "oven.html";
}

function addIngredient(){
    const i = ingredientInput.value;
    if (ingredientInput.value){
        createIngredElement(i);
        ingredientInput.value = '';

        saveIngredient();
    }
    else {
        alert('Please enter an ingredient')
    }

}

function createIngredElement (i){
    // need to figure out how li works to load ingredient object not just name
    // current error: ingredient displays but lost when trying to reload
    const listItem  = document.createElement('li');
    listItem.textContent = i;
    
    let checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.name = "name";
    checkbox.value = "value";
    checkbox.id = "id";
    listItem.appendChild(checkbox);

    checkbox.addEventListener('click', function(){
        ingredientList.removeChild(listItem);
        saveIngredient();
    })

    ingredientList.appendChild(listItem);
}

function saveIngredient(){
    let ingredients = [];
    ingredientList.querySelectorAll('li').forEach(function(item){
        ingredients.push(item.textContent.replace('Delete', ''));
        ingredients.push(item.isOwned);
    });

    localStorage.setItem('ingredients', JSON.stringify(ingredients));
}

function loadIngredients(){
    const ingredients = JSON.parse(localStorage.getItem('ingredients')) || [];
    ingredients.forEach(createIngredElement);
}
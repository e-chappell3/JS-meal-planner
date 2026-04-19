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
const displayList = document.getElementById('ingredientList');
const ownedList = document.getElementById('ownedList');
const ingredList = [];

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
        createIngredElement(i, false, 0);
        ingredientInput.value = '';

        saveIngredient();
    }
    else {
        alert('Please enter an ingredient')
    }

}

function createIngredElement (i, owned, d){
    if (d == 0){
        d = Date.now() + Math.random();
    }
    const item = {
        text: i,
        own: owned,
        id: d
    };
    const ingredItem = document.createElement('li');
    ingredItem.textContent = item.text;
    ingredList.push(item);
    
    let deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'deleteTask';

    let checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.name = "name";
    checkbox.checked = item.own;
    checkbox.id = "id";

    ownedItem = ingredItem;
    ingredItem.appendChild(deleteButton);
    ownedItem.appendChild(checkbox);

    deleteButton.addEventListener('click', function(){
        displayList.removeChild(ingredItem);
        const index = ingredList.findIndex(i => i.id === item.id);
        if (index > -1){
            ingredList.splice(index, 1)
        }
        saveIngredient();
    })

    checkbox.addEventListener('click', function(){
        const index = ingredList.findIndex(i => i.id === item.id);
        if (index > -1){
            ingredList[index].own = !ingredList[index].own;
        }
        saveIngredient();
    })

    displayList.appendChild(ingredItem);
    ownedList.appendChild(ownedItem);

}

function saveIngredient(){
    console.log("Saving: ", ingredList);
    localStorage.setItem('ingredList', JSON.stringify(ingredList));
}

function loadIngredients(){
    const ingredients = JSON.parse(localStorage.getItem('ingredList') || "[]");
    console.log("Retrieving: ",ingredients);
    ingredients.forEach(item => {
        if(item){
            createIngredElement(item.text, item.own, item.id);
        }
        
    });
}
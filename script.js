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

const fridgeButton = document.getElementById("fridgeButton");
const noteButton = document.getElementById("noteButton");
const ovenButton = document.getElementById("ovenButton");

document.addEventListener("DOMContentLoaded", () => {
  loadIngredients();
});

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
    ingredList.push(item);

    if(displayList){
        const ingredItem = document.createElement('li');
        ingredItem.textContent = item.text;
        
        let deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'deleteTask';
        
        ingredItem.appendChild(deleteButton);
        deleteButton.addEventListener('click', function(){
            displayList.removeChild(ingredItem);
            const index = ingredList.findIndex(i => i.id === item.id);
            if (index > -1){
                ingredList.splice(index, 1)
            }
            saveIngredient();
            loadIngredients();
        })

        displayList.appendChild(ingredItem);
    }

    if(ownedList){
        const ownedItem = document.createElement('li');
        ownedItem.textContent = item.text;
        
        let checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.checked = item.own;
        
        ownedItem.appendChild(checkbox);
        checkbox.addEventListener('click', function(){
            const index = ingredList.findIndex(i => i.id === item.id);
            if (index > -1){
                ingredList[index].own = !ingredList[index].own;
            }
            saveIngredient();
        })

            ownedList.appendChild(ownedItem);
    }
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
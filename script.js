const addButton = document.getElementById('add');
const ingredientInput = document.getElementById('ingredientName');
const displayList = document.getElementById('ingredientList');
const ownedList = document.getElementById('ownedList');
const ingredList = [];
// const item = {
//         text: "Onion",
//         own: true,
//         id: 1
//     };
// ingredList.push(item);
// const item2 = {
//         text: "Olive",
//         own: true,
//         id: 2
//     };
// ingredList.push(item2);

const recipeList = document.getElementById('recipeList');
const nameInput = document.getElementById('recipeName');
const iSearch = document.getElementById("ingredSearch");
const iList = document.getElementById("neededList");
const doneButton = document.getElementById("done");
const recipeButton = document.getElementById('recipeAdd');
const makeButton = document.getElementById('make');
const recList = [];

const fridgeButton = document.getElementById("fridgeButton");
const noteButton = document.getElementById("noteButton");
const ovenButton = document.getElementById("ovenButton");

document.addEventListener("DOMContentLoaded", () => {
  loadIngredients();
});

if (addButton != null){
    addButton.addEventListener('click', addIngredient);
}
if (makeButton != null){
    makeButton.addEventListener('click', filterRecipes);
    recipeButton.addEventListener('click', recipeView);
}
if (iSearch != null){
    iSearch.addEventListener('input', search);
}
if (fridgeButton != null){
    fridgeButton.addEventListener('click', fridgeView);
    noteButton.addEventListener('click', noteView);
    ovenButton.addEventListener('click', ovenView);
}

if (doneButton != null){
    doneButton.addEventListener('click', function(){
        addRecipe()
    })
}

function noteView(){
    document.location.href = "list.html";
}

function ovenView(){
    document.location.href = "oven.html";
}

function fridgeView(){
    document.location.href = "fridge.html";
    loadRecipes();
}

function recipeView(){
    document.location.href = "recipe.html";
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
        console.log("ingredItem added:", ingredItem);
        
        let deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'deleteIngredient';
        
        ingredItem.appendChild(deleteButton);
        displayList.appendChild(ingredItem);
        deleteButton.addEventListener('click', function(){
            displayList.removeChild(ingredItem);
            const index = ingredList.findIndex(i => i.id === item.id);
            if (index > -1){
                var removed = ingredList.splice(index, 1)
            }
            saveIngredient();
        })
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

function search(){
    console.log(ingredList, typeof ingredList);
    console.log("typing:", iSearch.value, "\nSearching:",ingredList);
    let results = document.getElementById("resultsList");
    const query = iSearch.value.toLowerCase();
    console.log("Query:",query);
    results.innerHTML = "";
    
    if (!query){
        return;
    }
    
    const matches = ingredList.filter(item =>
        item.text.toLowerCase().trim().includes(query.trim())
    );

    matches.forEach(item=> {
        const searchedItem = document.createElement("li");
        searchedItem.textContent = item.text;
        searchedItem.addEventListener("click", function(){
            ingredientToRecipe(item);
            iSearch.value = "";
            results.innerHTML = "";
        })
        results.appendChild(searchedItem);
        console.log("Current result:",results);
    })
}

function ingredientToRecipe(item){
    const recipeItem = document.createElement("li");
    recipeItem.textContent = item.text;

    let deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'deleteIngredient';

    deleteButton.addEventListener("click", function(){
        iList.removeChild(recipeItem);
    })

    recipeItem.appendChild(deleteButton);
    iList.appendChild(recipeItem);
}

function addRecipe(){
    console.log("Adding recipe:",nameInput.value);
    if (nameInput.value){
        const i = nameInput.value;
        const reqIngred = []
        iList.querySelectorAll("li").forEach(li => {
            reqIngred.push(li.firstChild.textContent);
        });
        createRecipe(i, reqIngred, 0);
        ingredientInput.value = '';

        saveRecipe();
    }
    else {
        alert('Please enter a recipe name')
    }
}

function createRecipe(n, i, d){
    if (d == 0){
        d = Date.now() + Math.random();
    }
    const item = {
        name: n,
        ingreds: i,
        id: d
    };
    recList.push(item)

    if(recipeList){
        const recItem = document.createElement('li');
        recItem.textContent = item.name;

        let deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'deleteRecipe';
        
        recItem.appendChild(deleteButton);
        deleteButton.addEventListener('click', function(){
            recipeList.removeChild(recItem);
            const index = recList.findIndex(r => r.id === item.id);
            if (index > -1){
                recList.splice(index, 1)
            }
            saveRecipe();
        })

        let editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.className = 'editRecipe';

        recItem.appendChild(editButton);
        editButton.addEventListener('click', function(){
            editRecipe(recItem)
        })

        recipeList.appendChild(recItem);
    }
}

function saveIngredient(){
    //var unique = ingredList.filter((value, index, array) => array.indexOf(value) === index)
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

// sort list based on required list length (can show recipes w/ least ingredients required if none)
function filterRecipes(){
    let make = []
    recipeList.forEach (item =>{
        let required = checkRecipe(item)

        if (required.length == 0){
            make.push(item);
        }
    })
}

function checkRecipe(recipe){
    let required = [];
    for (let i = 0; i < recipe.ingreds.length(); i++){
        let curr = recipe.ingreds[i];
        if (curr.own == false){
            required.push(curr);
        }
    }

    return required;
}

function editRecipe(recipe){
    // document.location.href = "recipe.html";
    // nameInput.value = recipe.name;
    // recipe.ingreds.forEach(item =>{
    //     if(item){
    //         iList.textContent = item.text;
    //     }
    // })

    // if (doneButton.clicked == true){
    //     saveRecipe();
    // }
}

function saveRecipe(){
    console.log("Saving: ", recList);
    localStorage.setItem('recList', JSON.stringify(recList));
}

function loadRecipes(){
    const recipes = JSON.parse(localStorage.getItem('recList') || "[]");
    console.log("Retrieving: ",recipes);
    recipes.forEach(item => {
        if(item){
            createRecipe(item.name, item.ingreds, item.id);
        }   
    });
}
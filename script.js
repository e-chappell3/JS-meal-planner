const addButton = document.getElementById('add');
const ingredientInput = document.getElementById('ingredientName');
const displayList = document.getElementById('ingredientList');
const ownedList = document.getElementById('ownedList');
const ingredList = [];

const recipeList = document.getElementById('recipeList');
const makeList = document.getElementById('makeList');
const nameInput = document.getElementById('recipeName');
const iSearch = document.getElementById("ingredSearch");
const iList = document.getElementById("neededList");
const doneButton = document.getElementById("done");
const recipeButton = document.getElementById('recipeAdd');
const makeButton = document.getElementById('make');
const editBack = document.getElementById('recipeBack');
const recList = [];

const fridgeButton = document.getElementById("fridgeButton");
const noteButton = document.getElementById("noteButton");
const ovenButton = document.getElementById("ovenButton");

document.addEventListener("DOMContentLoaded", () => {
    if (displayList || ownedList){
        loadIngredients();
    }
    if (recipeList){
        loadRecipes();
        if (window.location.pathname.endsWith("recipe.html")){
            const mode = loadEditRecipe();
            if (mode == true){
                editBack.addEventListener('click', function(){
                    localStorage.removeItem("recipeToEdit");
                })
                doneButton.addEventListener('click', function(){
                    saveEditedRec()
                })
            }
            else{
                doneButton.addEventListener('click', function(){
                    addRecipe()
                })
            }
        }
    }
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

function noteView(){
    document.location.href = "list.html";
}

function ovenView(){
    document.location.href = "oven.html";
}

function fridgeView(){
    document.location.href = "fridge.html";
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
        ownedList.appendChild(ownedItem);
        checkbox.addEventListener('change', function(){
            const index = ingredList.findIndex(i => i.id === item.id);
            if (index > -1){
                ingredList[index].own = !ingredList[index].own;
            }
            saveIngredient();
        })
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
    if (nameInput.value && !(iList.innerHTML === "")){
        const i = nameInput.value;
        const reqIngred = []
        iList.querySelectorAll("li").forEach(li => {
            reqIngred.push(li.firstChild.textContent);
        });
        createRecipe(i, reqIngred, 0);

        saveRecipe();

        nameInput.value = "";
        iList.innerHTML = "";
        console.log("Cleared inputs to:",nameInput.value);
    }
    else {
        if (!nameInput.value){
            alert('Please enter a recipe name.')
        }
        else{
            alert("Please add at least 1 ingredient to your recipe.")
        }
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
        recItem.dataset.recipeId = item.id;

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
            editRecipe(item)
        })

        recipeList.appendChild(recItem);
        document.querySelector('.editRecipe')
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

// sort list based on required list length (can show recipes w/ least ingredients required if none)
function filterRecipes(){
    makeList.innerHTML = "";
    let make = [];
    var ctr = 0;
    recList.forEach(item =>{
        let required = checkRecipe(item)
        make[ctr] = [];
        make[ctr][0] = item;
        make[ctr][1] = required;
        ctr++;
    })

    make.sort(twoDSort);
    for (let i = 0; i < Math.min(5, make.length); i++){
        const makeItem = document.createElement('li');
        makeItem.textContent = `${make[i][0].name}: missing ${make[i][1].length} element(s)`;

        makeItem.addEventListener("click", function(){
            console.log("recipe clicked");
            let varId = "exists " + make[i][0].name;
            let recipeIngreds = document.getElementById(varId);
            if (recipeIngreds){
                //let recipeIngreds = document.getElementById("exists");
                let hidden = recipeIngreds.getAttribute("hidden");
                if (hidden){
                    console.log("unhiding existing list");
                    recipeIngreds.removeAttribute("hidden");
                }
                else{
                    console.log("hiding existing list");
                    recipeIngreds.setAttribute("hidden", "hidden");
                }
            }
            else{
                console.log("creating new list");
                let recipeIngreds = document.createElement('ul');
                let varId = "exists " + make[i][0].name;
                recipeIngreds.setAttribute('id', varId);
                for (let j = 0; j < make[i][0].ingreds.length; j++){
                    const ingredItem = document.createElement('li');
                    ingredItem.textContent = make[i][0].ingreds[j];
                    console.log("ingredItem",j,"=",make[i][0].ingreds[j]);
                    let checkbox = document.createElement('input');
                    checkbox.type = "checkbox";
                    checkbox.disabled = true;
                    let curr = ingredList.find(o => o.text == make[i][0].ingreds[j]);
                    checkbox.checked = curr.own;
                    console.log("ingredItem owned =",curr.own);
                    
                    ingredItem.appendChild(checkbox);
                    recipeIngreds.appendChild(ingredItem);
                    console.log("list =",recipeIngreds);

                    makeItem.appendChild(recipeIngreds);
                }
            }
        })
            
        makeList.appendChild(makeItem);
    }
}

function twoDSort(a, b){
    if (a[1] == b[1]){
        return 0;
    }
    else{
        return (a[1] < b[1]) ? -1 : 1;
    }
}

function checkRecipe(recipe){
    let required = [];
    for (let i = 0; i < recipe.ingreds.length; i++){
        let curr = ingredList.find(o => o.text == recipe.ingreds[i]);
        console.log("Found curr:",curr,"where name =", recipe.ingreds[i]);
        console.log("checking item",curr.text,"owned =",curr.own);
        if (curr.own == false){
            required.push(curr);
            console.log(curr,"not owned, list is now:",required);
        }
    }

    return required;
}

function loadEditRecipe(){
    var rId = JSON.parse(localStorage.getItem("recipeToEdit"));
    console.log("Checking if recipe to edit:",rId);
    if (!rId){
        return false;
    }
    recipe = recList.find(r => r.id == rId);
    nameInput.value = recipe.name;
    console.log("Loading to edit:",recipe.name);
    recipe.ingreds.forEach(item =>{
        if(item){
            ingredientToRecipe({
                text: item
            });
            console.log("Loading required item for edit:", item.text);
        }
    })
    
    console.log("Recipe to edit:",recipe);
    return true;
}

function editRecipe(recipe){
    localStorage.setItem(
        "recipeToEdit",
        JSON.stringify(recipe.id)
    );
    document.location.href = "recipe.html";
}

function saveEditedRec(){
    var rId = JSON.parse(localStorage.getItem("recipeToEdit"));
    localStorage.removeItem("recipeToEdit");

    const index = recList.findIndex(r => r.id === rId);
    if (index <= -1){
        alert("Recipe not found!");
        return false;
    }
    console.log(recipeList);
    const displayRec = recipeList.querySelector(`[data-recipe-id="${rId}"]`);
    displayRec.firstChild.nodeValue = nameInput.value;

    recList[index].name = nameInput.value;
    const reqIngred = []
    iList.querySelectorAll("li").forEach(li => {
        reqIngred.push(li.firstChild.textContent);
    });
    recList[index].ingreds = reqIngred;
    console.log("Edited recList:",recList);

    saveRecipe();
}

function saveRecipe(){
    console.log("Saving: ", recList);
    localStorage.setItem('recList', JSON.stringify(recList));
}

function loadRecipes(){
    recList.length = 0
    console.log("loadRecipes()");
    const recipes = JSON.parse(localStorage.getItem('recList') || "[]");
    console.log("Retrieving: ",recipes);
    recipes.forEach(item => {
        if(item){
            createRecipe(item.name, item.ingreds, item.id);
        }   
    });
}
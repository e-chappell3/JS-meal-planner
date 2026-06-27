// turn html button, text input + ul elements into variables for use in script (ingredient related)
const addButton = document.getElementById('add');
const ingredientInput = document.getElementById('ingredientName');
const displayList = document.getElementById('ingredientList');
const ownedList = document.getElementById('ownedList');
// working list for displayList before saving/retrieving from localStorage into/out of displayList
const ingredList = [];

// turn html button, text input + ul elements into variables for use in script (recipe related)
const recipeList = document.getElementById('recipeList');
const makeList = document.getElementById('makeList');
const nameInput = document.getElementById('recipeName');
const iSearch = document.getElementById("ingredSearch");
const iList = document.getElementById("neededList");
const doneButton = document.getElementById("done");
const recipeButton = document.getElementById('recipeAdd');
const makeButton = document.getElementById('make');
const editBack = document.getElementById('recipeBack');
// working list for recipeList before saving/retrieving from localStorage into/out of recipeList
const recList = [];

// turn html buttons into variables for use in script (front page navigation related)
const fridgeButton = document.getElementById("fridgeButton");
const noteButton = document.getElementById("noteButton");
const ovenButton = document.getElementById("ovenButton");

// once DOM content is loaded for the page...
document.addEventListener("DOMContentLoaded", () => {
    if (displayList || ownedList){
        // if either displayList or ownedList is present then working with ingredients and should load accordingly from localStorage
        loadIngredients();
    }
    if (recipeList){
        // if instead recipeList is present then working with recipes and should load accordingly from localStorage
        loadRecipes();
        if (window.location.pathname.endsWith("recipe.html")){
            // if the recipes is for the recipe.html page then check if mode is editing or adding a recipe
            const mode = loadEditRecipe();
            if (mode == true){
                // if editing a recipe done button should use the saveEditedRec() function
                editBack.addEventListener('click', function(){
                    // if back is pressed remove the recipeToEdit from localStorage so edit mode is not maintained
                    localStorage.removeItem("recipeToEdit");
                })
                doneButton.addEventListener('click', function(){
                    saveEditedRec()
                })
            }
            else{
                // if adding a recipe done button should use the addRecipe() function
                doneButton.addEventListener('click', function(){
                    addRecipe()
                })
            }
        }
    }
});

// if corresponding button is present on page, add event listener to call appropriate function on click
if (addButton != null){
    addButton.addEventListener('click', addIngredient);
}
if (makeButton != null){
    makeButton.addEventListener('click', filterRecipes);
    recipeButton.addEventListener('click', recipeView);
}
// same as above but for text input when input detected
if (iSearch != null){
    iSearch.addEventListener('input', search);
}
if (fridgeButton != null){
    fridgeButton.addEventListener('click', fridgeView);
    noteButton.addEventListener('click', noteView);
    ovenButton.addEventListener('click', ovenView);
}

// redirect to appropriate page
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
    // store input as i
    const i = ingredientInput.value;
    if (ingredientInput.value){
        // if a value is in input then create new li element for the ul
        createIngredElement(i, false, 0);
        // reset the input to be empty for future use
        ingredientInput.value = '';
        // save the updated list to localStorage
        saveIngredient();
    }
    else {
        // if input is empty: cannot save so alert user to enter an ingredient
        alert('Please enter an ingredient')
    }

}

function createIngredElement (i, owned, d){
    if (d == 0){
        // if no id provided, calculate random new id
        d = Date.now() + Math.random();
    }
    // create item using provided parameters
    const item = {
        text: i,
        own: owned,
        id: d
    };
    // push to working list
    ingredList.push(item);

    if(displayList){
        // if displayList is present then create li element for that ul
        const ingredItem = document.createElement('li');
        // text content should be equal to ingredient name
        ingredItem.textContent = item.text;
        console.log("ingredItem added:", ingredItem);
        
        // create delete button for the li element and append this to it
        let deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'deleteIngredient';
        
        ingredItem.appendChild(deleteButton);
        // append the li element to the displayList ul
        displayList.appendChild(ingredItem);
        // add event listener to the delete button for click event
        deleteButton.addEventListener('click', function(){
            // removes item from displayList ul
            displayList.removeChild(ingredItem);
            // find item in working list based on id and remove it
            const index = ingredList.findIndex(i => i.id === item.id);
            if (index > -1){
                var removed = ingredList.splice(index, 1)
            }
            // ensure changes saved to localStorage
            saveIngredient();
        })
    }

    if(ownedList){
        // if ownedList is present then create li element for that ul
        const ownedItem = document.createElement('li');
        ownedItem.textContent = item.text;
        
        // need checkbox instead of delete button to indicate if owned/not
        let checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        // initiate to given parameter (will be false on initial creation till user edited)
        checkbox.checked = item.own;
        
        ownedItem.appendChild(checkbox);
        // append the li element to the ownedList ul
        ownedList.appendChild(ownedItem);
        // add event listener to the checkbox for change event
        checkbox.addEventListener('change', function(){
            // adapt the working list based on the checkbox state (owned/not owned)
            const index = ingredList.findIndex(i => i.id === item.id);
            if (index > -1){
                ingredList[index].own = !ingredList[index].own;
            }
            // ensure changes saved to localStorage
            saveIngredient();
        })
    }
}

function search(){
    console.log(ingredList, typeof ingredList);
    console.log("typing:", iSearch.value, "\nSearching:",ingredList);
    // get the resultsList ul 
    let results = document.getElementById("resultsList");
    // ensure text input value is lower case for compaerison
    const query = iSearch.value.toLowerCase();
    console.log("Query:",query);
    // reset results to be empty for new search
    results.innerHTML = "";
    
    if (!query){
        // if there is no value then return w/o searching for a match
        return;
    }
    
    // matches is a list of ingredients from the ingredient list that match the query/value
    const matches = ingredList.filter(item =>
        item.text.toLowerCase().trim().includes(query.trim())
    );

    // for each match create a li element and append to the resultsList ul for selection
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
    // create li element for the iList ul w/ ingredient name as text content
    const recipeItem = document.createElement("li");
    recipeItem.textContent = item.text;
    
    // add delete button
    let deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'deleteIngredient';
    // with event listener to remove li element from the ul when clicked
    deleteButton.addEventListener("click", function(){
        iList.removeChild(recipeItem);
    })

    // append delete button to the li element then append li element to the ul iList
    recipeItem.appendChild(deleteButton);
    iList.appendChild(recipeItem);
}

function addRecipe(){
    console.log("Adding recipe:",nameInput.value);
    if (nameInput.value && !(iList.innerHTML === "")){
        // if there is as value for recipe name and at least 1 ingredient in the iList ul then...
        // use i to store recipe name input
        const i = nameInput.value;
        // create working list for required ingredients
        const reqIngred = []
        // for each li element in iList push ingredient name into working list
        iList.querySelectorAll("li").forEach(li => {
            reqIngred.push(li.firstChild.textContent);
        });
        // create a recipe using name input, parsed iList and id of 0 (generated in function)
        createRecipe(i, reqIngred, 0);
        // save the updated recipe list to localStorage
        saveRecipe();

        // clear inputs for further use
        nameInput.value = "";
        iList.innerHTML = "";
        console.log("Cleared inputs to:",nameInput.value);
    }
    else {
        if (!nameInput.value){
            // if name is blank cannot save recipe so alert user to enter a name
            alert('Please enter a recipe name.')
        }
        else{
            // if no ingredients in iList cannot save recipe so alert user to add at least 1 ingredient
            alert("Please add at least 1 ingredient to your recipe.")
        }
    }
}

// works very similar to createIngredElement() but for recipes instead of ingredients
function createRecipe(n, i, d){
    if (d == 0){
        // if no id provided, calculate random new id
        d = Date.now() + Math.random();
    }
    // create item using provided parameters
    const item = {
        name: n,
        ingreds: i,
        id: d
    };
    // push item to working list
    recList.push(item)

    if(recipeList){
        // if recipeList is present then create li element for that ul
        const recItem = document.createElement('li')
        // text content should be the recipe name
        recItem.textContent = item.name;
        // save id as well as needed for editing functionality
        recItem.dataset.recipeId = item.id;

        // create delete button for the li element
        let deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'deleteRecipe';
        // append to li element
        recItem.appendChild(deleteButton);
        // add event listener to the delete button for click event
        deleteButton.addEventListener('click', function(){
            // remove li element from ul recipeList
            recipeList.removeChild(recItem);
            // use id to delete from working list
            const index = recList.findIndex(r => r.id === item.id);
            if (index > -1){
                recList.splice(index, 1)
            }
            // ensure changes saved to localStorage
            saveRecipe();
        })

        // create edit button for the li element
        let editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.className = 'editRecipe';
        // append to li element
        recItem.appendChild(editButton);
        // add event listener to the edit button for click event
        editButton.addEventListener('click', function(){
            editRecipe(item)
        })

        // append the li element to the recipeList ul
        recipeList.appendChild(recItem);
        document.querySelector('.editRecipe')
    }
}

function saveIngredient(){
    // stringify working list to save to localStorage
    console.log("Saving: ", ingredList);
    localStorage.setItem('ingredList', JSON.stringify(ingredList));
}

function loadIngredients(){
    // parse list from localStorage
    const ingredients = JSON.parse(localStorage.getItem('ingredList') || "[]");
    console.log("Retrieving: ",ingredients);
    // for each item in list create li element for ul + append to working list using function where item exists
    ingredients.forEach(item => {
        if(item){
            createIngredElement(item.text, item.own, item.id);
        }   
    });
}

// sort list based on required list length (can show recipes w/ least ingredients required if none)
function filterRecipes(){
    // ensure elements empty before use
    makeList.innerHTML = "";
    let make = [];
    var ctr = 0;
    // for each recipe in working list check its ingredients against owned ingredients in function
    recList.forEach(item =>{
        let required = checkRecipe(item)
        // turn make[] into 2D array using []
        make[ctr] = [];
        // set the 1st index to the recipe name + the second to the list of required ingredients
        make[ctr][0] = item;
        make[ctr][1] = required;
        // increment counter for next recipe
        ctr++;
    })

    // sort the array so least required ingredients is at the top of make
    make.sort(twoDSort);
    for (let i = 0; i < Math.min(5, make.length); i++){
        // loop through top 5 results (if there is not 5 recipes, however many is available (make.length))
        // create li element and set text content to recipe name and how many ingredients are missing from its required list
        const makeItem = document.createElement('li');
        makeItem.textContent = `${make[i][0].name}: missing ${make[i][1].length} element(s)`;

        // add event listener for clicking li item
        makeItem.addEventListener("click", function(){
            console.log("recipe clicked");
            // create variable id that signifies if list of owned ingredients has already been calculated for this recipe
            let varId = "exists " + make[i][0].name;
            let recipeIngreds = document.getElementById(varId);
            if (recipeIngreds){
                // if it already exists (retrieving recipeIngreds was succesful) then...
                let hidden = recipeIngreds.getAttribute("hidden");
                if (hidden){
                    // if currently hidden toggle to visible
                    console.log("unhiding existing list");
                    recipeIngreds.removeAttribute("hidden");
                }
                else{
                    // if currently visible toggle to hidden
                    console.log("hiding existing list");
                    recipeIngreds.setAttribute("hidden", "hidden");
                }
            }
            else{
                // otherwise msust create list from scratch
                console.log("creating new list");
                // create ul element for required recipe ingredients
                let recipeIngreds = document.createElement('ul');
                // create variable id and set it as id for ul so it is known this list exists next time this event occurs
                let varId = "exists " + make[i][0].name;
                recipeIngreds.setAttribute('id', varId);
                for (let j = 0; j < make[i][0].ingreds.length; j++){
                    // for each required ingredient for the recipe
                    // create li element for required recipe ingredients where text content is the ingredient name
                    const ingredItem = document.createElement('li');
                    ingredItem.textContent = make[i][0].ingreds[j];
                    console.log("ingredItem",j,"=",make[i][0].ingreds[j]);
                    // create checbox for li element to indicate if owned/not
                    let checkbox = document.createElement('input');
                    checkbox.type = "checkbox";
                    // disable checkbox as editing ownership here will invalidate make list
                    checkbox.disabled = true;
                    // find ingredient in working list based on name
                    let curr = ingredList.find(o => o.text == make[i][0].ingreds[j]);
                    // use working list to get owned variable and set checkbox accordingly
                    checkbox.checked = curr.own;
                    console.log("ingredItem owned =",curr.own);
                    
                    // append checkbox to li ingredient item
                    ingredItem.appendChild(checkbox);
                    // append li item to ul list
                    recipeIngreds.appendChild(ingredItem);
                    console.log("list =",recipeIngreds);

                    // append ul list to li recipe item so it is visible when recipe is clicked
                    makeItem.appendChild(recipeIngreds);
                }
            }
        })
        // append li recipe item to makeList ul for display
        makeList.appendChild(makeItem);
    }
}

function twoDSort(a, b){
    // sort 2D array based on length of required ingredients list (ensure both make[x][1] + make[x][2] stay together when sorted)
    if (a[1] == b[1]){
        return 0;
    }
    else{
        return (a[1] < b[1]) ? -1 : 1;
    }
}

function checkRecipe(recipe){
    // create empty list for required ingredients
    let required = [];
    for (let i = 0; i < recipe.ingreds.length; i++){
        // for the number of required recipe ingredients
        // find corresponding ingredient in working list based on name and store as curr
        let curr = ingredList.find(o => o.text == recipe.ingreds[i]);
        console.log("Found curr:",curr,"where name =", recipe.ingreds[i]);
        console.log("checking item",curr.text,"owned =",curr.own);
        if (curr.own == false){
            // if ingredient is not owned push to required list
            required.push(curr);
            console.log(curr,"not owned, list is now:",required);
        }
    }

    // return list of missing ingredients
    return required;
}

function loadEditRecipe(){
    // load recipeToEdit from localStorage to determine if editing or adding a recipe
    var rId = JSON.parse(localStorage.getItem("recipeToEdit"));
    console.log("Checking if recipe to edit:",rId);
    if (!rId){
        // if there is no recipeToEdit then this is adding a recipe so return false to indicate as such
        return false;
    }
    // if recipeToEdit is found then this is a recipe ID so find matching in working list to get recipe
    recipe = recList.find(r => r.id == rId);
    nameInput.value = recipe.name;
    console.log("Loading to edit:",recipe.name);
    // load ingredients for recipe
    recipe.ingreds.forEach(item =>{
        if(item){
            ingredientToRecipe({
                text: item
            });
            console.log("Loading required item for edit:", item.text);
        }
    })
    
    console.log("Recipe to edit:",recipe);
    // return true as editing not adding a new recipe
    return true;
}

function editRecipe(recipe){
    // store recipe ID as recipeToEdit in localStorage so can retrieve regardless of page change
    localStorage.setItem(
        "recipeToEdit",
        JSON.stringify(recipe.id)
    );
    // navigate to recipe page
    document.location.href = "recipe.html";
}

function saveEditedRec(){
    // get recipe ID of recipe editing from localStorage then remove it as this is the last time it is needed for this recipe
    var rId = JSON.parse(localStorage.getItem("recipeToEdit"));
    localStorage.removeItem("recipeToEdit");

    // find corresponding recipe in working list based on id
    const index = recList.findIndex(r => r.id === rId);
    if (index <= -1){
        // if not found alert accordingly and return false to indicate failure to save
        alert("Recipe not found!");
        return false;
    }
    // if found update the recipe name and ingredients in display recipe lsit
    const displayRec = recipeList.querySelector(`[data-recipe-id="${rId}"]`);
    displayRec.firstChild.nodeValue = nameInput.value;

    // then update working lists
    recList[index].name = nameInput.value;
    const reqIngred = []
    // convert li in ul list to reqIngred array for saving
    iList.querySelectorAll("li").forEach(li => {
        reqIngred.push(li.firstChild.textContent);
    });
    // set the ingredients to above array
    recList[index].ingreds = reqIngred;
    console.log("Edited recList:",recList);

    // save the changes
    saveRecipe();
}

function saveRecipe(){
    console.log("Saving: ", recList);
    // stringify working list to save to localStorage
    localStorage.setItem('recList', JSON.stringify(recList));
}

function loadRecipes(){
    // ensure lenght is currently 0 so no duplicates when loading from localStorage
    recList.length = 0
    console.log("loadRecipes()");
    // parse list from localStorage
    const recipes = JSON.parse(localStorage.getItem('recList') || "[]");
    console.log("Retrieving: ",recipes);
    // for each item retrieved in list use to create recipe li item
    recipes.forEach(item => {
        if(item){
            createRecipe(item.name, item.ingreds, item.id);
        }   
    });
}
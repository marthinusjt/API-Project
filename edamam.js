const edBaseURL = 'https://api.edamam.com/search'; 
const key = 'bf4789289f4f350281413e7eac9eed85';
const id = 'd2922f5f'
let url;

// EXAMPLE URL:
// REQUIRED
// BASE: https://api.edamam.com/search
// QUEARY: ?q=<Input>
// ID: &app_id=${YOUR_APP_ID}
// KEY: &app_key=${YOUR_APP_KEY}

// OPTIONAL
// FROM: &from=0 (hits total found)
// TO: &to=3
// CALORIES: &calories=591-722
// HEALTH: &health=alcohol-free"

// SEARCH FORM
const searchTerm = document.querySelector('.search');
const searchForm = document.querySelector('form');

// DIET CONDITIONS
const alcohol = document.getElementById("healthAlcoholFree");
const balanced = document.getElementById('dietBalanced');
const highFiber = document.getElementById('dietHighFiber');
const highProtein = document.getElementById('dietHighProtein');
const lowCarb = document.getElementById('dietLowCarb');
const lowFat = document.getElementById('dietLowFat');
const sugarConscious = document.getElementById('healthSugarConscious');
const vegan = document.getElementById('healthVegan');
const vegetarian = document.getElementById('healthVegetarian');

// ALLERGIES
const peanut = document.getElementById('healthPeanutFree');
const treeNut = document.getElementById('healthTreeNutFree');

// RESULTS NAVIGATION
const nextBtn = document.querySelector('.next');
const previousBtn = document.querySelector('.prev');
const nav = document.querySelector('nav');


// RESULTS SECTION
const section = document.querySelector('section');

let pageNumber = 0; // Setting up number for pageNumber
console.log('PageNumber:', pageNumber);
let displayNav = false; // Setting up boolean for displayNav

// Variable
nav.style.display = 'none';

// EVENT LISTENERES
searchForm.addEventListener('submit', fetchResults);
nextBtn.addEventListener('click', nextPage);
previousBtn.addEventListener('click', previousPage);

function recipeSearch() {
    let checkBox = document.getElementById("parameterCheck");
    let dietParameters = document.getElementById("parameterTable");
    if (checkBox.checked == true){
        dietParameters.style.display = "block";
    } else {
        dietParameters.style.display = "none";
    }
}

function uncheckAll() {
    let inputs = document.querySelectorAll('.uncheck');
    for(let a = 0; a < inputs.length; a++) {
      inputs[a].checked = false;
    }
}

function fetchResults(e) {
    e.preventDefault();
    url = `${edBaseURL}?q=${searchTerm.value}&app_id=${id}&app_key=${key}&from=${pageNumber}`;
    console.log("URL:", url);

    // PARAMETERS
    if (alcohol.checked !== false) {  
        url += `&health=alcohol-free`;
    };
    
    if (balanced.checked !== false) { 
        url += `&diet=${balanced.value}`;
    };
    
    if (highProtein.checked !== false) {  
        url += `&diet=high-protein`;
    };
    
    if (lowCarb.checked !== false) {  
        url += `&diet=low-carb`;
    };
    
    if (lowFat.checked !== false) {  
        url += `&diet=low-fat`;
    };

    if (peanut.checked !== false) {
        url += `&health=peanut-free`;
    };
        
    if (sugarConscious.checked !== false) {
        url += `&health=sugar-conscious`;
    };

    if (treeNut.checked !== false) {
        url += `&health=tree-nut-free`;
    };

    if (vegan.checked !== false) { 
        url += `&health=vegan`;
    };

    if (vegetarian.checked !== false) { 
        url += `&health=vegetarian`;
    };


fetch(url)
    .then(function (result) {
        // console.log(result);
        return result.json();
    }).then(function (json) {
        // console.log(json);
        displayResults(json);
    });
}

function displayResults(json) {
    console.log("DisplayResults", json);
    
    let recipes = json.hits;
    // console.log(articles);

    while (section.firstChild) {
        section.removeChild(section.firstChild);
    }

    if (recipes.length === 0) {
        console.log("No results");
    } else {
        //Display the data
        for (let i = 0; i < recipes.length; i++) {
            // console.log(i);
            let recipe = document.createElement('article');
            let heading = document.createElement('h2');
            let link = document.createElement('a');
            let img = document.createElement('img');
            let ingredients = document.createElement('p');
            let calories = document.createElement('p');
            let serves = document.createElement('p');
            let clearfix = document.createElement('div');

            let current = recipes[i];
            console.log("Current:", current)

            recipe.setAttribute('class', 'recipe');
            heading.setAttribute('class', 'header');
            img.setAttribute('class','recipeImage');
            serves.setAttribute('class','serves');

            link.href = current.recipe.url;
            link.textContent = current.recipe.label;

            ingredients.textContent = 'Ingredients: ';
            ingredients.setAttribute('class', 'ingredients')
            
            calories.textContent = 'Calories: ' + Math.round(current.recipe.calories);
            serves.textContent = `Serves: ${current.recipe.yield}`;
            
            // INGREDIENT LIST
            for (let j = 0; j < current.recipe.ingredientLines.length; j++) {
                
                let span = document.createElement('p');
                span.textContent += current.recipe.ingredientLines[j] + ' ';
                ingredients.appendChild(span);
            }
            
            // IMAGE OF RECIPE
            if(current.recipe.image.length > 0) {
                img.src = current.recipe.image;
                img.alt = current.recipe.label;
            }

            // CALORIES
            calories.setAttribute('class','calories');

            clearfix.setAttribute('class','clearfix');

            recipe.appendChild(heading);
            heading.appendChild(link);
            recipe.appendChild(img);
            recipe.appendChild(ingredients);
            recipe.appendChild(calories);
            recipe.appendChild(serves);
            recipe.appendChild(clearfix);
            section.appendChild(recipe);

        }

    }

    if (recipes.length === 10 && pageNumber > 0) {
        nav.style.display = 'block'
        previousBtn.style.display = 'block';
        nextBtn.style.display = 'block';
    } else if (recipes.length <= 10 && recipes.length > 0 && pageNumber > 0) {
        nav.style.display = 'block'
        previousBtn.style.display = 'block';
        nextBtn.style.display = 'none';
    } else if(recipes.length === 10 && pageNumber === 0) {
        nav.style.display = 'block'
        previousBtn.style.display = 'none';
        nextBtn.style.display = 'block';
    } else {
        nav.style.display = 'none';
    };

}

function nextPage(e) {
    pageNumber+=10; //37
    fetchResults(e); //38
    console.log("Page number:", pageNumber); //39
};

// previousPage()
function previousPage(e) {
    if (pageNumber > 0) { //40
    pageNumber-=10; //41
    } else {
        return; //42
    }
    fetchResults(e); //43
    console.log("Page:", pageNumber); //44
}
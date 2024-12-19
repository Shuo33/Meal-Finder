const search = document.getElementById('search');
const submit = document.getElementById('submit');
const random = document.getElementById('random');
const mealsEl = document.getElementById('meals');
const resultHeading = document.getElementById('result-heading');
const single_mealEl = document.getElementById('single-meal');



// Search meal and fetch from API
function searchMeal(e) {
    // Since it's a submit we need to prevent the submit default behavior
    e.preventDefault();

    // Clear single meal
    single_mealEl.innerHTML = '';

    // Get search term from the DOM
    const term = search.value;

    // Fetch meal data & display it 
    async function fetchMeal() {
        const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`);
        const data = await res.json();
        // console.log(data.meals);
        resultHeading.innerHTML = `<h2>Search results for '${term}':</h2>`;

        // display meal info to the DOM: map() helps loop through each item and join() helps to make the array into a string
        if (data.meals === null) {
            resultHeading.innerHTML = `<p>No result found, please try again</p>`; 
        } else {
            mealsEl.innerHTML = data.meals.map(meal => `
                <div class="meal">
                 <img src="${meal.strMealThumb}" alt="${meal.strMeal} "/>
                 <div class="meal-info" data-mealID="${meal.idMeal}">
                     <h3>${meal.strMeal}</h3>
                 </div>
                </div>
            `).join('');
        }

        // Clear the search text
        search.value = '';
    }

    // Check for empty
    if (term.trim()) {
        fetchMeal();
    } else {
        alert('Please enter a search term');
    }
}




// Fetch meal detail by it's ID
async function getMealById(mealID) {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`);
    const data = await res.json();
    const meal = data.meals[0];
    // console.log(meal);

    addMealToDOM(meal);
}


// Add meal to DOM : 
function addMealToDOM(meal) {
    // creat a array with measurements and ingredients
    const ingredients = [];

    for (let i = 1; i <= 20; i++){
        // to use the value of a key (inside an object) as the key of a new object/array , we need to replace '.' with '[]' since the key of the new object/array is inside a varible
        if (meal[`strIngredient${i}`]) {
            ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`); 
        } else {
            break;
        }
    }


    single_mealEl.innerHTML = `
    <div class="single-meal">
      <h1>${meal.strMeal}</h1>
      <img src="${meal.strMealThumb}" alt="${meal.strMeal} "/>

      <div class="single-meal-info">
        ${meal.strCategory ? `<p>Category: ${meal.strCategory}</p>` : ''}
        ${meal.strArea ? `<p>Area: ${meal.strArea}</p>`: ''}
      </div>

      <div class="main">
       <p>Instruction: ${meal.strInstructions}</p>
       <h2>Ingredients</h2>
         <ul>
           ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
         </ul>
      </div>
    </div>
    `; 



    

    
}


// Event Listeners
// we use 'submit' since the form has a button type submit
submit.addEventListener('submit', searchMeal);

mealsEl.addEventListener('click', e => {
    // Filter the div with 'meal-info' in order to find it's id later: 'e.composedPath()' method returns an array of objects with all the elements the current event will propogate through; find() helps to loop through all the items and find the items that pass the test parameter
    const mealInfo = e.composedPath().find(item => {
        if (item.classList) {
            return item.classList.contains('meal-info');
        } else {
            return false;
        }
    });

    // console.log(mealInfo);


    // Get the ID of the clicked item
    if (mealInfo) {
        const mealID = mealInfo.getAttribute('data-mealid');
        // console.log(mealID);

        getMealById(mealID);
    }   
});
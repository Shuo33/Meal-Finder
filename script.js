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
        console.log(data.meals);
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




// Event Listeners
// we use 'submit' since the form has a button type submit
submit.addEventListener('submit', searchMeal);
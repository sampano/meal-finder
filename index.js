const searchBtn = document.getElementById("search-btn");
const mealList = document.getElementById("meal");
const mealDetailsContent = document.querySelector(".meal-details-content");
const recipeCloseBtn = document.getElementById("recipe-close-btn");
const mealFeature = document.getElementById("feature-meal");
const mealFeaturedDiv = document.querySelector(".feature-meal-result");
const searchResultH2 = document.querySelector(".meal-result-title");
//event listner
searchBtn.addEventListener("click", getMealList);
mealList.addEventListener("click", getMealRecipe);
mealFeature.addEventListener("click", getMealRecipe);
recipeCloseBtn.addEventListener("click", () => {
  mealDetailsContent.parentElement.classList.remove("showRecipe");
});

//get meal list that matches with the ingredients
async function getMealList() {
  let searchInputTxt = document.getElementById("search-input").value.trim();
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`
  );
  const data = await response.json();
  console.log(data);
  searchResultH2.innerHTML = "Your Search Results";

  let html = "";
  if (data.meals) {
    data.meals.forEach((meal) => {
      html += `
                    <div class = "meal-item" data-id = "${meal.idMeal}">
                        <div class = "meal-img">
                            <img src = "${meal.strMealThumb}" alt = "food">
                        </div>
                        <div class = "meal-name">
                            <h3>${meal.strMeal}</h3>
                            <a href = "#" class = "recipe-btn">Get Recipe</a>
                        </div>
                    </div>
                `;
    });
    mealList.classList.remove("notFound");
  } else {
    html = "Sorry, we didn't find any meal!";
    mealList.classList.add("notFound");
  }

  mealList.innerHTML = html;
  searchResultH2.innerHTML = "Your Search Results:";
  mealFeaturedDiv.remove();
}

// get recipe of the meal
async function getMealRecipe(e) {
  e.preventDefault();
  if (e.target.classList.contains("recipe-btn")) {
    let mealItem = e.target.parentElement.parentElement;
    console.log(mealItem.dataset.id);
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`
    );
    const data = await response.json();
    console.log("mealrecipe", data.meals);
    mealRecipeModal(data.meals);
    //.then((data) => mealRecipeModal(data.meals));
  }
}

const mealRecipeModal = (meal) => {
  console.log(meal);
  meal = meal[0];
  let html = `
        <h2 class = "recipe-title">${meal.strMeal}</h2>
        <p class = "recipe-category">${meal.strCategory}</p>
        <div class = "recipe-instruct">
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>
        <div class = "recipe-meal-img">
            <img src = "${meal.strMealThumb}" alt = "">
        </div>
        <div class = "recipe-link">
            <a href = "${meal.strYoutube}" target = "_blank">Watch Video</a>
        </div>
    `;
  mealDetailsContent.innerHTML = html;
  mealDetailsContent.parentElement.classList.add("showRecipe");
};

const getRandIngredients = async () => {
  const response = await fetch(
    "https://www.themealdb.com/api/json/v1/1/list.php?i=list"
  );
  const data = await response.json();
  const randNum = Math.floor(Math.random() * data.meals.length);
  const ingridient = await data.meals[randNum].strIngredient;
  featureMeals(ingridient);
};
getRandIngredients();

// const featureMeals = async (ingredient) => {
//   console.log(
//     `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`
//   );
//   const trimedIngredient = ingredient.trim();
//   const response = await fetch(
//     `http://www.themealdb.com/api/json/v1/1/filter.php?i=chicken_breast,garlic,salt`
//   );
//   const data = await response.json();
//   console.log(ingredient.idMeal);
//   let html = `
//   <div class="feature-meal-item" data-id = "${ingredient.idMeal}">
//               <div class="feature-meal-img">
//                 <img src="${ingredient.strMealThumb}" alt="" alt="food" />
//               </div>
//               <div class="feature-meal-name">
//                 <h3>${ingredient.strMeal}</h3>
//                 <a href="#" class="feature-recipe-btn">Get Recipe</a>
//               </div>`;
//   mealFeature.innerHTML = html;
// };

const featureMeals = async (ingredient) => {
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`
  );
  const data = await response.json();
  console.log(data.meals);
  let html = "";
  if (data.meals) {
    data.meals.forEach((meal) => {
      html += `
                    <div class = "feature-meal-item" data-id = "${meal.idMeal}">
                        <div class = "feature-meal-img">
                            <img src = "${meal.strMealThumb}" alt = "food">
                        </div>
                        <div class = "feature-meal">
                            <h3>${meal.strMeal}</h3>
                            <a href = "#" class = "recipe-btn">Get Recipe</a>
                        </div>
                    </div>
                `;
    });
  } else {
    html = "Sorry, we didn't find any meal!";
    mealFeature.classList.add("notFound-featured");
  }
  mealFeature.innerHTML = html;
};

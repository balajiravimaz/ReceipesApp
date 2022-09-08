const URL = "https://www.themealdb.com/api/json/v1/1/random.php";
const main = document.querySelector(".main");
const mealDB = JSON.parse(localStorage.getItem("mealId"));
const search = document.querySelector(".fa-search");
const inp = document.querySelector("#search");


search.addEventListener("click", async (e) => {

    main.innerHTML = '';
    if (inp.value == "") return;
    let meal = await searchMeal(inp.value);

    if (meal) {

        meal.forEach(meals => {
            generateCard(meals);
        })
    }
});

async function getMeal(URL) {
    const res = await fetch(URL);
    const data = await res.json();

    generateCard(data.meals[0]);
}


function initialDisplay() {
    const lts = getlocalMeal();
    if (Array.isArray(lts) && lts.length) {

        lts.forEach(async (id) => {
            let meal = await searchId(id);
            addFavorites(meal);
        })
    }
}


function generateCard(meal) {

    const dish = document.createElement("div");
    dish.className = "dish";

    dish.innerHTML = `
    <div class="dish-img">
        <img src="${meal.strMealThumb}" alt="">
        <div class="label">Random Receipe</div>
    </div>
    <div class="dish-text">
        <h5>${meal.strMeal}</h5>
        <i class="fa fa-heart" aria-hidden="true" data-id="${meal.idMeal}"></i>
    </div>    
    `;

    const hert = dish.querySelector(".dish-text .fa-heart");

    hert.addEventListener("click", (e) => {
        if (hert.classList.contains("active")) {
            hert.classList.remove("active");
            const mId = e.target.getAttribute('data-id');
            removeCard(mId);
            removetoLocal(meal.idMeal);
        } else {
            addtoLocal(meal.idMeal);
            hert.classList.add("active");
        }
    });

    dish.addEventListener("click", (e) => {
        popCard(meal);
    })

    main.appendChild(dish);

}

async function addtoLocal(id) {
    const lts = getlocalMeal();

    localStorage.setItem("mealId", JSON.stringify([...lts, id]));

    let meal = await searchId(id);
    addFavorites(meal);

}

function removetoLocal(id) {

    const lts = getlocalMeal();
    localStorage.setItem("mealId", JSON.stringify(lts.filter((ids) => ids !== id)));

}

function removeCard(mId) {
    document.querySelectorAll(".fav-card").forEach((ids) => {
        const md = ids.getAttribute('data-id');
        if (mId === md) {
            ids.remove();
        }
    })
}


function getlocalMeal() {
    const localMeal = JSON.parse(localStorage.getItem("mealId"));
    return localMeal === null ? [] : localMeal;
}

function popCard(data) {
    
    const div = document.createElement("div");
    div.className = "popup";

    div.innerHTML = `
    <div id="popclose">
    <i class="fa fa-close"></i>
    </div>
    <h5>${data.strMeal}</h5>
    <img src="${data.strMealThumb}" alt="">
    <p>${data.strInstructions}</p>
    `;
    document.body.appendChild(div);
    document.querySelectorAll(".fa-close").forEach((its) => {
        its.addEventListener("click", (e) => {
            e.target.parentElement.parentElement.remove();
        })
    })
}


function addFavorites(data) {

    const fav = document.querySelector(".favorites");

    fav.addEventListener("click", (e) => {
        if (e.target.classList.contains("fa-close")) {
            e.target.parentElement.parentElement.remove();
            removetoLocal(e.target.getAttribute("data-id"));
        }
    })

    const div = document.createElement("div");
    div.className = "fav-card";
    div.setAttribute("data-id", data[0].idMeal);
    div.innerHTML = `
    <div class="fav-img">
    <img src="${data[0].strMealThumb}" alt="${data[0].strMeal}">
    </div>
    <div class="fav-txt">
    <h6>${data[0].strMeal}</h6>
    </div>
    <div class="close">
    <i class="fa fa-close"  data-id=${data[0].idMeal}></i>
    </div>    
    `;
    div.addEventListener("click", (e) => {
        popCard(data[0]);
    });

    fav.appendChild(div);
}

async function searchId(id) {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    const data = await res.json();
    return data.meals;
}

async function searchMeal(data) {
    const check = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${data}`);
    const res = await check.json();
    return res.meals;
}

getMeal(URL);
initialDisplay();
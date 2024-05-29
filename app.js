const apiUnsplash = 'Jks3FBD-d3v-tKY93iOblbu5QCrkKwZP2MfyhQ1RqpQ';
const apiWeather= '9aeed6f7114f4596a3ce2e7f1e6ab30f';

const formEl = document.querySelector("form");
const searchInputEl = document.getElementById("search-input");
const searchResultsEl = document.querySelector(".search-results");
const showMoreButtonEl = document.getElementById("show-more-button");
const scrollToTopButtonEl = document.getElementById("scroll-to-top-button");
const temperatureEl = document.getElementById("temperature");
const descriptionEl = document.getElementById("description");
const informationEl = document.querySelector(".information");

const weatherApiUrl = 'https://api.openweathermap.org/data/2.5/weather';
const unsplashApiUrl = 'https://api.unsplash.com/search/photos';

let page = 1;
let inputdata="";

async function getOutfitType(){
    const weather = await getWeather();
    if(weather === null){
        return "invalid location";
    } else if(weather.temperature >= 25){
        return "summer outfit";
    } else if(weather.temperature >= 20){
        return "spring outfit";
    } else if(weather.temperature >= 10){
        return "autumn outfit";
    } else {
        return "winter outfit";
    }
}

async function getWeather(){
    const userLocation= searchInputEl.value;
    const url = `${weatherApiUrl}?q=${userLocation}&appid=${apiWeather}&units=metric`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error('Location not found:', userLocation);
            return null;
        }
        const data = await response.json();
        return {
            temperature: Math.round(data.main.temp),
            description: data.weather[0].description
        };
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return null;
    }
}

async function searchImages(outfitType, isFromSearchButton) { 
    if (outfitType === "invalid location") {
        searchResultsEl.innerHTML = "Invalid location. Please enter a valid location.";
        return;
    }

    const url = `${unsplashApiUrl}?page=${page}&query=${outfitType}&client_id=${apiUnsplash}`; 

    try {
        console.log(`Fetching images for query: ${outfitType}`); // Debugging info
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (page === 1) {
            searchResultsEl.innerHTML = "";
        }

        const results = data.results;
        if (results.length === 0) {
            searchResultsEl.innerHTML = "No results found.";
        }

        results.map((result) => {
            const imageWrapper = document.createElement("div");
            imageWrapper.classList.add("search-result");
            const image = document.createElement("img");
            image.src = result.urls.small;
            const imageLink = document.createElement("a");
            imageLink.href = result.links.html;
            imageLink.target = "_blank";


            imageWrapper.appendChild(image);
            searchResultsEl.appendChild(imageWrapper);

            searchResultsEl.style.display="flex";
            imageWrapper.style.display = "block";
        });

        if (isFromSearchButton) {
            searchResultsEl.scrollIntoView({ behavior: 'smooth' });
        }

        page++;

        if (page > 1) {
            showMoreButtonEl.style.display = "block";
            scrollToTopButtonEl.style.display = "flex";
            informationEl.style.display = "flex";

        }
    } catch (error) {
        console.error('Error fetching images:', error);
        searchResultsEl.innerHTML = "An error occurred while fetching images.";
    }
}

formEl.addEventListener("submit", async (event) => {
    event.preventDefault();
    page = 1;
    const outfitType = await getOutfitType();
    searchImages(outfitType, true);

     // Get the location and weather information
     const location = searchInputEl.value;
     const weather = await getWeather();
 
     // Update the information div
     const locationEl = document.getElementById('location');
     const temperatureEl = document.getElementById('temperature');
     const descriptionEl = document.getElementById('description');
 
     locationEl.textContent = `Outfit ideas, inspiration, and themes for ${weather.temperature}° weather in ${location} with ${weather.description}:`;
     descriptionEl.scrollIntoView({ behavior: 'smooth' });
});

showMoreButtonEl.addEventListener("click", async () => {
    const outfitType = await getOutfitType();
    searchImages(outfitType, false);
});

const chk = document.getElementById('chk');

chk.addEventListener('change', () => {
    document.body.classList.toggle('dark');
    if (document.body.classList.contains('dark')) {
        document.getElementById('header').style.backgroundImage = "url('backgroundDark.png')";
        document.body.style.color = 'white';
    } else {
        document.getElementById('header').style.backgroundImage = "url('backgroundLight.png')";
        document.body.style.color = 'black';
    }
});

scrollToTopButtonEl.addEventListener('click', function() {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
});

scrollToTopButtonEl.style.display = "none";

window.addEventListener('scroll', function() {
    if (window.scrollY === 0) {
        scrollToTopButtonEl.style.display = "none";
    } else {
        scrollToTopButtonEl.style.display = "block";
    }
});



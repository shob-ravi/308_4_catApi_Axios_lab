import * as Carousel from './Carousel.js';
// You have axios, you don't need to import it
console.log(axios);

// The breed selection input element.
const breedSelect = document.getElementById('breedSelect');
// The information section div element.
const infoDump = document.getElementById('infoDump');
// The progress bar div element.
const progressBar = document.getElementById('progressBar');
// The get favourites button element.
const getFavouritesBtn = document.getElementById('getFavouritesBtn');

// Step 0: Store your API key here for reference and easy access.
const API_KEY = "live_289lU4RWiIZ6xmZ1FG8GgobI6mHJBPz5T8VGcrWzb14GPTfbvwXC1DaYBzaFQMQ6";
var breedinfo = [];
const config={
  onDownloadProgress:updateprogress
}
/**
 * 1. Create an async function "initialLoad" that does the following:
 * - Retrieve a list of breeds from the cat API using fetch().
 * - Create new <options> for each of these breeds, and append them to breedSelect.
 *  - Each option should have a value attribute equal to the id of the breed.
 *  - Each option should display text equal to the name of the breed.
 * This function should execute immediately.
 */

initialLoad();
async function initialLoad() {
  console.log();
  const response = await axios.get("https://api.thecatapi.com/v1/breeds",config); //.then((response)=>response.json());
  const data1 = breedinfo = await response.data;
  // console.log(data1);
  data1.forEach((item) => {
    const optionsEl = document.createElement("option");
    optionsEl.value = item.id;
    optionsEl.textContent = item.name;
    breedSelect.appendChild(optionsEl);
  });
}
/**
 * 2. Create an event handler for breedSelect that does the following:
 * - Retrieve information on the selected breed from the cat API using fetch().
 *  - Make sure your request is receiving multiple array items!
 *  - Check the API documentation if you're only getting a single object.
 * - For each object in the response array, create a new element for the carousel.
 *  - Append each of these new elements to the carousel.
 * - Use the other data you have been given to create an informational section within the infoDump element.
 *  - Be creative with how you create DOM elements and HTML.
 *  - Feel free to edit index.html and styles.css to suit your needs, but be careful!
 *  - Remember that functionality comes first, but user experience and design are important.
 * - Each new selection should clear, re-populate, and restart the Carousel.
 * - Add a call to this function to the end of your initialLoad function above to create the initial carousel.
 */



async function loadCatValue(catID) {
  // const response = await fetch("https://api.thecatapi.com/v1/breeds/" + catID);
  // const catDetails = await response.json();
  const catImageDetails = await getCatImgUrl(catID);
  console.log("Cat_Image_Details::" + JSON.stringify(catImageDetails));
  //console.log("Cat_Count::" + catImageDetails.length);
  if (catImageDetails && catImageDetails.length > 0) {
    catImageDetails.forEach((image)=>{
      const carouselItem = Carousel.createCarouselItem(
        image.url,
        "",
        image.id
      );
      Carousel.appendCarousel(carouselItem);
    });
    // console.log("catID::" + catImageDetails[0].id);
    // console.log("url::" + catImageDetails[0].url);
    Carousel.start();
    const breed = breedinfo.find(a=>a.id===catID);
    loadInfo(breed);
  }
  //console.log(catDetails);
}

function loadInfo(breedInfo){
  infoDump.innerHTML = `
  <h2>${breedInfo.name}</h2>
  <p>${breedInfo.description}</p>`;
}

async function getCatImgUrl(catName) {
  try{
    const response = await axios.get(
      "https://api.thecatapi.com/v1/images/search?breed_ids=" + catName,config
    );
   
    return await response.data;
  } 
  catch (error) {
    console.error("Error fetching cat images:", error);
    return [];
  
}}

breedSelect.addEventListener("change", () => {
  //const optionValue = document.querySelector("option");
  console.log("breedSelect.value::"+breedSelect.value);
  const optionValue = breedSelect.value;
  console.log(optionValue);
  loadCatValue(optionValue);
});
/**
 * 3. Fork your own sandbox, creating a new one named "JavaScript Axios Lab."
 */
/**
 * 4. Change all of your fetch() functions to axios!
 * - axios has already been imported for you within index.js.
 * - If you've done everything correctly up to this point, this should be simple.
 * - If it is not simple, take a moment to re-evaluate your original code.
 * - Hint: Axios has the ability to set default headers. Use this to your advantage
 *   by setting a default header with your API key so that you do not have to
 *   send it manually with all of your requests! You can also set a default base URL!
 */
/**
 * 5. Add axios interceptors to log the time between request and response to the console.
 * - Hint: you already have access to code that does this!
 * - Add a console.log statement to indicate when requests begin.
 * - As an added challenge, try to do this on your own without referencing the lesson material.
 */
axios.interceptors.request.use((request) => {
  
  document.body.style.cursor = "progress"; // Indicate loading
  progressBar.style.width = "0%"; // Reset progress bar
  request.startTime = new Date().getTime();
  console.log("startTime" + request.startTime);
  
  return request;
});
axios.interceptors.response.use((response) => {  
  const endTime = new Date().getTime();
  const finalTime = endTime - response.config.startTime;
  console.log(`Request took ${finalTime} milliseconds.`);
  console.log("finalTime:" + finalTime);
  return response;
});

/**
 
 * 6. Next, we'll create a progress bar to indicate the request is in progress.
 * - The progressBar element has already been created for you.
 *  - You need only to modify its "width" style property to align with the request progress.
 * - In your request interceptor, set the width of the progressBar element to 0%.
 *  - This is to reset the progress with each request.
 * - Research the axios onDownloadProgress config option.
 * - Create a function "updateProgress" that receives a ProgressEvent object.
 *  - Pass this function to the axios onDownloadProgress config option in your event handler.
 * - console.log your ProgressEvent object within updateProgess, and familiarize yourself with its structure.
 *  - Update the progress of the request using the properties you are given.
 * - Note that we are not downloading a lot of data, so onDownloadProgress will likely only fire
 *   once or twice per request to this API. This is still a concept worth familiarizing yourself
 *   with for future projects.
 */
function updateprogress(evt){
console.log("evt:" +evt);
progressBar.style.width = "0%";
progressBar.max = evt.total;
console.log("evt:total" +evt.total);
progressBar.value = evt.loaded;
console.log("evt:loaded" +evt.loaded);
const percentage = Math.floor(evt.loaded*100/evt.total);
console.log(`download progress:${percentage}`);
progressBar.style.width = percentage+ "%";
progressBar.textContent = `${percentage}%`;
// progressBar.textContent=percentage;
}
// const config={
//   onDownloadProgress:updateprogress
// }
// axios.onDownloadProgress=updateprogress
/**
 * 7. As a final element of progress indication, add the following to your axios interceptors:
 * - In your request interceptor, set the body element's cursor style to "progress."
 * - In your response interceptor, remove the progress cursor style from the body element.
 */
/**
 * 8. To practice posting data, we'll create a system to "favourite" certain images.
 * - The skeleton of this function has already been created for you.
 * - This function is used within Carousel.js to add the event listener as items are created.
 *  - This is why we use the export keyword for this function.
 * - Post to the cat API's favourites endpoint with the given ID.
 * - The API documentation gives examples of this functionality using fetch(); use Axios!
 * - Add additional logic to this function such that if the image is already favourited,
 *   you delete that favourite using the API, giving this function "toggle" functionality.
 * - You can call this function by clicking on the heart at the top right of any image.
 */
export async function favourite(imgId) {
  const imageCount = await getFavorites(imgId);
  if (imageCount.length > 0) {
    await deleteFavorites(imgId);
    console.log("Removed from favorites.");
  }
  else {
    await postFavorites(imgId);
    console.log("Added to favorites.");
  }
}

async function postFavorites(imgId) {
  var results = "";
  try {
    const response = await axios.post(
      "https://api.thecatapi.com/v1/favourites/", {
      image_id: `${imgId}`
    },
      {
        headers: {
          'x-api-key': `${API_KEY}`
        }
      }
    );
    results = await response.message;
  }
  catch (ex) {
    console.log("EXCEPTION::" + ex);
  }
  return results;
}

async function getFavorites(imgId) {
  const response = await axios.get(
    "https://api.thecatapi.com/v1/favourites?image_id=" + imgId, {
    headers: {
      'x-api-key': `${API_KEY}`
    }
  }
  );
  return response.data;
}

async function deleteFavorites(imgId) {
  try {
    alert("Inside delete");
    const favourite = await getFavorites(imgId);
    console.log("TEMP::"+JSON.stringify(favourite));
    console.log("Favourite_Id::"+favourite[0].id);
    const response = await axios.delete(
      `https://api.thecatapi.com/v1/favourites/${favourite[0].id}`, {
      headers: {
        'x-api-key': `${API_KEY}`
      }
    }
    );
    console.log("Favorite deleted successfully:", response.data);
  } catch (error) {
    if (error.response) {
      console.error("Error deleting favorite:", error.response.data);
    } else {
      console.error("Network Error:", error.message);
    }
  }
}

/**
 * 9. Test your favourite() function by creating a getFavourites() function.
 * - Use Axios to get all of your favourites from the cat API.
 * - Clear the carousel and display your favourites when the button is clicked.
 *  - You will have to bind this event listener to getFavouritesBtn yourself.
 *  - Hint: you already have all of the logic built for building a carousel.
 *    If that isn't in its own function, maybe it should be so you don't have to
 *    repeat yourself in this section.
 */

getFavouritesBtn.addEventListener('click', ()=>{
    GetFavourites();
})
async function GetFavourites(){
  const response = await axios.get(
    "https://api.thecatapi.com/v1/favourites", {
    headers: {
      'x-api-key': `${API_KEY}`
    }
  }
  );
  console.log("Response::"+JSON.stringify(response.data));
  const count = response.data.length;
   Carousel.clear();
   response.data.forEach(element => {
     const newItem = Carousel.createCarouselItem(element.image.url, "", element.image.id);
     Carousel.appendCarousel(newItem);
    Carousel.start();
   });
}
/**
 * 10. Test your site, thoroughly!
 * - What happens when you try to load the Malayan breed?
 *  - If this is working, good job! If not, look for the reason why and fix it!
 * - Test other breeds as well. Not every breed has the same data available, so
 *   your code should account for this.
 */	

import { getPhoto } from "./pixabay-api";
import Notiflix from "notiflix";
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const formEl = document.getElementById("search-form");
const gallery = document.querySelector(".gallery");


formEl.addEventListener("submit", onSubmit);

let page = 1;

async function onSubmit(event) {
    event.preventDefault();
    const searchQuery = event.target.elements.searchQuery.value;
   
    try {
        const {data: {hits, total}} = await getPhoto(searchQuery, page);
        if(hits.length === 0){
            Notiflix.Notify.failure ('Sorry, there are no images matching your search query. Please try again.');
        }
        gallery.innerHTML = createMarkup(hits);    
    } catch (error) {
        
    }
}

function createMarkup(arr) {
    return arr.map(item => `  
    <div class="photo-card">
     <img src="${item.largeImageURL}" alt="${item.tags}" loading="lazy" />
     <div class="info">
       <p class="info-item">
         <b>Likes:</b> ${item.likes}
       </p>
       <p class="info-item">
         <b>Views:</b>${item.views}
       </p>
       <p class="info-item">
         <b>Comments:</b>${item.comments}
       </p>
       <p class="info-item">
         <b>Downloads:</b>${item.downloads}
       </p>
     </div>
   </div>`).join ("");

}
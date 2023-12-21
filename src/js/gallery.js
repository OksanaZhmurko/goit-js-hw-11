
import { getPhoto } from "./pixabay-api";
import Notiflix from "notiflix";
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const formEl = document.getElementById("search-form");
const gallery = document.querySelector(".gallery");
const loadMoreBtnEl =  document.querySelector(".load-more");

//function showLoadMoreButton() {
  loadMoreBtnEl.classList.remove("is-hidden");
//}

//function hideLoadMoreButton() {
  loadMoreBtnEl.classList.add("is-hidden");
//}

formEl.addEventListener("submit", onSubmit);
loadMoreBtnEl.addEventListener("click", onLoadMoreBtnClick);

let page = 1;
let query = null;
let totalHits = 0;

async function onSubmit(event) {
  event.preventDefault();
  loadMoreBtnEl.classList.add("is-hidden");
  page = 1;
  query = event.target.elements.searchQuery.value.trim;
 
  try {
      const { data: { hits, total } } = await getPhoto(query, page);
      totalHits = Math.ceil(total / 40);

      if (hits.length === 0) {
        gallery.innerHTML = "";
         return Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
      }   
      gallery.innerHTML = createMarkup(hits); 

      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);

      if (totalHits > 1) {
         loadMoreBtnEl.classList.remove("is-hidden");
      }
  } catch (error) {
    Notiflix.Notify.failure("Error");
  } finally{
    event.target.reset()
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

async function onLoadMoreBtnClick() {
  page += 1;
  try {
    const { data: { hits} } = await getPhoto(query, page);
  
    gallery.insertAdjacentHTML("beforeend", createMarkup(hits)); 
   
   
    if (page >= totalHits){
      loadMoreBtnEl.classList.add("is-hidden"); 
      Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    }
  } catch (error) {
    Notiflix.Notify.failure("Error");
  }
}
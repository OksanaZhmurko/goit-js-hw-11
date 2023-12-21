
import { getPhoto } from "./pixabay-api";
import Notiflix from "notiflix";
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const formEl = document.getElementById("search-form");
const gallery = document.querySelector(".gallery");
const loadMoreBtnEl = document.querySelector(".load-more");

formEl.addEventListener("submit", onSubmit);
loadMoreBtnEl.addEventListener("click", onLoadMoreBtnClick);

let page = 1;
let query = null;
let totalHits = 500; 

async function onSubmit(event) {
  event.preventDefault();
  loadMoreBtnEl.classList.add("is-hidden");
  page = 1;
  query = event.target.elements.searchQuery.value.trim();

  if (!query) {
    return Notiflix.Notify.failure("Sorry, there are no images. Please enter a search query.");
  }

  try {
    const { data: { hits, total, totalHits: receivedTotalHits } } = await getPhoto(query, page);
    totalHits = Math.min(500, receivedTotalHits); // Обновляем totalHits

    if (hits.length === 0) {
      gallery.innerHTML = "";
      return Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    }
    gallery.innerHTML = createMarkup(hits);

    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);

    if (totalHits > 40) {
      loadMoreBtnEl.classList.remove("is-hidden");
    }
  } catch (error) {
    Notiflix.Notify.failure("Error");
  } finally {
    event.target.reset();
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
          <b>Views:</b> ${item.views}
        </p>
        <p class="info-item">
          <b>Comments:</b> ${item.comments}
        </p>
        <p class="info-item">
          <b>Downloads:</b> ${item.downloads}
        </p>
      </div>
    </div>`).join("");
}

async function onLoadMoreBtnClick() {
  page += 1;
  try {
    const { data: { hits, total, totalHits: receivedTotalHits } } = await getPhoto(query, page);

    gallery.insertAdjacentHTML("beforeend", createMarkup(hits));

    if (page >= Math.ceil(totalHits / 40)) {
      loadMoreBtnEl.classList.add("is-hidden");
      Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    }
  } catch (error) {
    Notiflix.Notify.failure("Error");
  }
}

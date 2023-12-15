import axios from "axios";

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = "41266296-2db9ccd17cff29e4a711737d2";

export function getPhoto(q, page){
    return axios.get(BASE_URL, {
        params: {
            q,
            page,
            per_page: 40,
            image_type: "photo", 
            orientation: "horizontal", 
            safesearch: true,
            key: API_KEY
        }
    });
}




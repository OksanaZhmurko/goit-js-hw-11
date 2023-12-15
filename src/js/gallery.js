
import { getPhoto } from "./pixabay-api";

getPhoto("cat", 1)
.then(res => {
    console.log(res);
})

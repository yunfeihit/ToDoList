import "./styles.css";

import {loadPage} from "./controller.js";

document.addEventListener('DOMContentLoaded', () => {
    try {
        loadPage();
    } catch (error) {
        console.error("Error loading the page:", error.message);
        const theLoadingPart = document.querySelector('#main-content-after-addBtn');
        //check if the page is correctlly loaded
        if(!theLoadingPart) {
            theLoadingPart.innerHTML = "<p>Oops! something went wrong, pls reload the page!</p>"
        }
    };
})











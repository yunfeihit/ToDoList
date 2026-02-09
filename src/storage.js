import {todoList} from "./todo.js";
import {projectList} from "./project.js";

// combine all data(todoList and projectList) to an object and return it (to store it later)
// (should not store severals object or arrays!) 
function updateOriData() {
    const oriData = {
        todos: todoList,
        projects: projectList
    };
    return oriData;
}

const STORAGE_KEY = 'todoAppData';

function saveData() {
    const theOriData = updateOriData(); // must update the data first!
    localStorage.setItem(STORAGE_KEY, JSON.stringify(theOriData));
}

//(return 'rowDataFromStorage', which need to be rehydrated by funciton 'rehydrateData' in controller.js)
function loadData() {
    try {
        const jsonData = localStorage.getItem(STORAGE_KEY);
        return jsonData ? JSON.parse(jsonData) : null;// 'JSON.parse(null)' is not safe
    } catch(err) {
        console.error("Failed to load data:", err);
        return null;
    }
}


//for test only
function logData() {
    const theData = updateOriData();
    console.log(theData);
}

export {saveData, loadData, logData};
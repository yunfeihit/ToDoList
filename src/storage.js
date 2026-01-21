import {todoList} from "./todo.js";
import {projectList} from "./project.js";

//when add a todo or project, update the 'oridata'
function updateOriData() {
    const oriData = {
        todos: todoList,
        projects: projectList
    };
    return oriData;
}

const STORAGE_KEY = 'todoAppData';

function saveData(oriData) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(oriData));
}

function loadData() {
    const jsonData = localStorage.getItem(STORAGE_KEY);
    return jsonData ? JSON.parse(jsonData) : null;
}

//test function
function logData() {
    const theData = updateOriData();
    console.log(theData);
}


export {saveData, loadData, updateOriData, logData};
import {todoList, addTodo, removeTodo, assignTodoProject} from "./todo.js";
import {projectList, addProject, removeProject} from "./project.js";
import {updateOriData, saveData, loadData} from "./storage.js";
import {content, todoInputDialog, addNewTodoBtn, todoInputForm, renderProjectList} from "./dom.js";


//Inner Function: sava app data
function saveAppData() {
    const appData = updateOriData();
    saveData(appData);
    //Test: log it now
    console.log(appData);
}

//Inner Function : load app data
function loadAppData() {
    return loadData();
}

//--------------- new todo dialog ----------------------
//add new todo btn eventListener
addNewTodoBtn.addEventListener('click', () => todoInputDialog.showModal())

//gather new todo information when dialog is closed
todoInputDialog.addEventListener('close', () => {
    if(todoInputDialog.returnValue != 'submit') {
        todoInputForm.reset();
        return;
    }    

    const title = todoInputForm.elements['title'].value;
    const description = todoInputForm.elements['description'].value;
    const date = todoInputForm.elements['date'].value;
    const priority = todoInputForm.elements['priority'].value;
    const project = todoInputForm.elements['project'].value;

    // four steps to store a new todo:
    // 1. make a new todo object
    //('isDone' is not collected here)
    const todoMetaData = {
        title: title,
        description: description,
        date: date,
        priority: priority,
        project: project
    }
    // 2. add the new todo object to the todoList
    addTodo(todoMetaData);
    // 3. save app data
    saveAppData();
    
    todoInputForm.reset();
})


function renderProjectListWhenCreateTodo() {
    projectList.forEach(item => {
        const newRenderProject = document.createElement('option');
        newRenderProject.value = item;
        renderProjectList.appendChild(newRenderProject);
    })
}
















//Main Function:
function loadPage() {
    renderProjectListWhenCreateTodo();

}




export {loadPage};
import {todoList, addTodo, removeTodo, assignTodoProject} from "./todo.js";
import {projectList, addProject, removeProject} from "./project.js";
import {updateOriData, saveData, loadData} from "./storage.js";
import {content, todoInputDialog, addNewTodoBtn, todoInputForm, showProjectList, renderMainContent,  renderProjectsInSidebar, createAddProjectBtn, createAddProjectDialog} from "./dom.js";


//Inner Function: sava app data to storage
function saveAppData() {
    const appData = updateOriData();
    saveData(appData);
    //Test: log it to see if worked
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

    renderMainContent();

})

//Function: show project list when click the <input>
function showProjectListWhenInputTodo() {
    projectList.forEach(item => {
        const newRenderProject = document.createElement('option');
        newRenderProject.value = item;
        showProjectList.appendChild(newRenderProject);
    })
}







//Main Function:
function loadPage() {
    //make the project <input>, only do it once
    showProjectListWhenInputTodo();

    renderMainContent();

    //render projects in sidebar
    renderProjectsInSidebar();
 
    const addProjectContainer = document.querySelector('#add-project-container');
    //put the addProjectBtn in the placeHolder 'add-project-container' first
    const addProjectButton = createAddProjectBtn(addProjectContainer);

    //if it a 'addProjectButton' and click on it, switch to the 'addProjectDialog'
    addProjectContainer.addEventListener('click', (event) => {
        if (event.target.closest('#add-project-btn')) {
            const theAddProjectDialogObject = createAddProjectDialog();

            //add eventListener on the 'add' button
            const addProjectButton = theAddProjectDialogObject.addProjectButton;
            addProjectButton.addEventListener('click', () => {
                if (theAddProjectDialogObject.addProjectInput.value) {
                    addProject(theAddProjectDialogObject.addProjectInput.value);
                    renderProjectsInSidebar();
                    renderMainContent();     
                    //for test
                    console.log(updateOriData());         
                }
            })
        } else if (event.target.id === 'cancel-add-project') {
            createAddProjectBtn();
        }
    })





    //for test
    console.log(updateOriData());
}


export {loadPage};
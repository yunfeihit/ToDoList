import {todoList, addTodo, removeTodo} from "./todo.js";
import {projectList, addProject, removeProject} from "./project.js";
import {saveData, loadData, logData} from "./storage.js";
import {content, todoInputDialog, todoInputForm, showProjectList, showProjectListAfterSelect, renderMainContent,  renderProjectsInSidebar, createAddProjectBtn, createAddProjectDialog, renderProjectsAndTodosInMainContent, updateTodoItemColor} from "./dom.js";


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

    // thres steps to store a new todo:
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
    saveData();
    todoInputForm.reset();
    renderMainContent();
})
//--------------- new todo dialog ----------------------

//Inner Function: (to be used as an eventListener) fold all todo items, only shows the project 
function foldAllTodoItems() {
    const projectWraps = document.querySelectorAll('.project-todo-wrap');
    projectWraps.forEach(projectWrap => {
        const todosAfterThisProjects = projectWrap.querySelectorAll('.todo-and-description-wrap');
        todosAfterThisProjects.forEach(item => item.remove());
    });
    const theEmptyBlock = document.querySelector('#empty-block');
    theEmptyBlock.remove();
    const theTodoWithoutProjects = document.querySelectorAll('.the-todo-without-project');
    theTodoWithoutProjects.forEach(item => item.remove());
}


//Main Function:
function loadPage() {
    //make the project <input>, only do it once
    showProjectListAfterSelect();

    renderMainContent();

    //render projects in sidebar
    renderProjectsInSidebar();
 
    const addProjectContainer = document.querySelector('#add-project-container');
    //put the addProjectBtn in the placeHolder 'add-project-container' first
    const addProjectButton = createAddProjectBtn(addProjectContainer);

    //if it a 'addProjectButton' and click on it, switch to the 'addProjectDialog'
    let ifMainContentIsExpand = true;
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
                }
            })
        } else if (event.target.id === 'cancel-add-project') {
            createAddProjectBtn();
        }
    })
    const sidebarProjectBtn = document.querySelector('#sidebar-project');
    sidebarProjectBtn.addEventListener('click', () => {
        renderMainContent();
        ifMainContentIsExpand = !ifMainContentIsExpand ? false : true;
        if (ifMainContentIsExpand) {
            foldAllTodoItems();
            ifMainContentIsExpand = false;
        } else {
            return;
        }       
    });

    const sidebarTodoBtn = document.querySelector('#sidebar-todo');
    sidebarTodoBtn.addEventListener('click', () => {
        renderMainContent();
        ifMainContentIsExpand = true;
    });
    updateTodoItemColor();

    const sideBarCanlenderBtn = document.querySelector('#sidebar-canlender');
    const mainContentafterAddBtn = document.querySelector('#main-content-after-addBtn');
    sideBarCanlenderBtn.addEventListener('click', () => {
        mainContentafterAddBtn.innerHTML = '';
        const tobeContinued = document.createElement('div');
        tobeContinued.id = 'tobeContinued';
        tobeContinued.textContent = 'to be continued...'
        mainContentafterAddBtn.appendChild(tobeContinued);
    })
}


export {loadPage};
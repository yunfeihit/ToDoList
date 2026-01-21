import {projectList, addProject, removeProject, renameProject} from "./project.js"
import {todoList} from "./todo.js";
import {logData} from "./storage.js";
import rightArrow from "./imgs/arrow_right_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";
import downArrow from "./imgs/arrow_down_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";
import projectIcon from "./imgs/format_list_bulleted_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";
import addIcon from "./imgs/add_2_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"
import moreActionIcon from "./imgs/more_vert_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"

const content = document.querySelector('#content');
const mainContentafterAddBtn = document.querySelector('#main-content-after-addBtn');
const todoInputDialog = document.querySelector('#todo-input-dialog');
const addNewTodoBtn = document.querySelector('#add-new-todo-btn');
const todoInputForm = document.querySelector('#todo-input-form');
const showProjectList = document.querySelector('#show-project-list');


//Inner Function: create project item(within a div wrap, and a extra projectAndTodo container, put the related todos after)
function createProjectItem(projectName) {
    const projectAndTodosPackage =document.createElement('div');
    const projectDiv = document.createElement('div');
    const imgInProjectDiv = document.createElement('img');
    const pInProjectDiv = document.createElement('p');

    pInProjectDiv.textContent = projectName;
    imgInProjectDiv.src = rightArrow;
    projectDiv.classList.add('project-item');
    projectDiv.id = projectName.replaceAll(' ', '-'); //to replace the space of project name, otherwise the id name will be illegal
    projectAndTodosPackage.classList.add('project-todo-wrap');
    projectAndTodosPackage.id = `${projectName.replaceAll(' ', '-')}-todo-wrap`;

    projectDiv.appendChild(imgInProjectDiv);
    projectDiv.appendChild(pInProjectDiv);
    projectAndTodosPackage.appendChild(projectDiv);

    return projectAndTodosPackage;//return it to add todos after
}

// Inner Function: create todo item(within wrap)
function createTodoItem(todoObject) {
    const wrappedTodoItem = document.createElement('div');
    const todoTitle = document.createElement('p');

    wrappedTodoItem.classList.add('todo-wrap')
    todoTitle.textContent = todoObject.title;
    todoTitle.classList.add('todo-title');
    todoTitle.id = `${todoObject.title}-title`

    wrappedTodoItem.appendChild(todoTitle);
    return wrappedTodoItem;
}

// Inner Function: render todos after each project
function renderTodosAfterProject(projectName) {
    // append todo after the project
    const thisProjectsTodoList = todoList.filter(todoItem => todoItem.project === projectName);

    thisProjectsTodoList.forEach(thisProjectsTodo => {
        const wrappedTodoItem = createTodoItem(thisProjectsTodo);
        const theProjectPackage = document.querySelector(`#${projectName.replaceAll(' ', '-')}-todo-wrap`);
        theProjectPackage.appendChild(wrappedTodoItem);
    })
}

// Inner Function: render all project and related todos in main content
function renderProjectsAndTodosInMainContent() {
    projectList.forEach(project => {
        const projectAndTodosPackage = createProjectItem(project);
        mainContentafterAddBtn.appendChild(projectAndTodosPackage);
        renderTodosAfterProject(project);
    })
}

// Inner Function: render the todos without project
function renderTodosWithoutProject() {
    const todoListWithoutProject = todoList.filter(item => 
        !projectList.includes(item.project)
    );

    //to make some distance before todos without projcet
    const emptyBlock = document.createElement('div');
    emptyBlock.id = "empty-block";
    mainContentafterAddBtn.appendChild(emptyBlock);

    todoListWithoutProject.forEach(todoWithoutProject => {
        const wrappedTodoItemWithoutProject = createTodoItem(todoWithoutProject);
        mainContentafterAddBtn.appendChild(wrappedTodoItemWithoutProject);
    })
}

//Inner Function: create a add project button at the placeholder 'add-project-container' and return the button
function createAddProjectBtn() {
    const theContainer = document.querySelector('#add-project-container');

    //if render, always clear first
    theContainer.innerHTML = '';

    //special add project btn in sidebar
    const addProjectBtnWrap = document.createElement('div');
    const addProjectIcon = document.createElement('img');
    const addProjectP = document.createElement('p');

    addProjectBtnWrap.appendChild(addProjectIcon);
    addProjectBtnWrap.appendChild(addProjectP);

    //make the format consistent with other projects in sidebar
    addProjectBtnWrap.classList.add('project-in-sidebar');
    addProjectBtnWrap.id = 'add-project-btn';
    addProjectIcon.src = addIcon;
    addProjectP.textContent = 'Add Project';

    theContainer.appendChild(addProjectBtnWrap);

    return addProjectBtnWrap;
}

// Inner Function: create add new project dialog at the placeholder 'add-project-container', return the add button, cancel button and the input as an object
function createAddProjectDialog() {
    const theContainer = document.querySelector('#add-project-container')
    //if render, always clear the container first
    theContainer.innerHTML = '';

    const addProjectDialogContainer = document.createElement('div');
    addProjectDialogContainer.id = 'add-project-dialog-container';
    
    const addProjectInput = document.createElement('input');
    addProjectInput.type = 'text';
    addProjectInput.placeholder = 'new project';

    const addProjectButton = document.createElement('button');
    addProjectButton.id = 'add-project';
    addProjectButton.textContent = 'Add';

    const cancelActionButton = document.createElement('button');
    cancelActionButton.id = 'cancel-add-project';
    cancelActionButton.textContent = 'Cancel';   

    addProjectDialogContainer.appendChild(addProjectInput);
    addProjectDialogContainer.appendChild(addProjectButton);
    addProjectDialogContainer.appendChild(cancelActionButton);

    theContainer.appendChild(addProjectDialogContainer);

    return {
        addProjectInput: addProjectInput,
        addProjectButton: addProjectButton,
        cancelActionButton: cancelActionButton
    }
}

//Inner Function: make the add project popup menu close when click outside of it
function setupProjectPopupMenuOutsideClick(popup, btn) {
    document.addEventListener('click', (event) => {
        if (popup.classList.contains('show') &&
            !popup.contains(event.target) &&
            !btn.contains(event.target)
        ) {
            popup.classList.remove('show');
        }
    })
}

// Function: render projects in side bar
function renderProjectsInSidebar() {
    const projectsInSidebarContainer = document.querySelector('#projects-in-sidebar-container'); 
    projectsInSidebarContainer.innerHTML = '';

    projectList.forEach(project => {
        const projectWrap = document.createElement('div');
        const projectName = document.createElement('p');
        const projectIconImg = document.createElement('img');
        const moreActionImg = document.createElement('img');

        projectWrap.classList.add('project-in-sidebar');
        projectName.textContent = project;
        projectIconImg.src = projectIcon;
        moreActionImg.src = moreActionIcon;
        moreActionImg.classList.add('edit-project-popup-btn');

        projectWrap.appendChild(projectIconImg);
        projectWrap.appendChild(projectName);
        projectWrap.appendChild(moreActionImg);
    
        projectsInSidebarContainer.appendChild(projectWrap);

        //small pop-up menu (delete and rename the project)
        const popupMenu = document.createElement('div');
        popupMenu.classList.add('edit-project-popup-menu');
        const deleteOptionBtn = document.createElement('div');
        deleteOptionBtn.textContent = 'delete';
        deleteOptionBtn.classList.add('animate-btn');
        deleteOptionBtn.id = 'delete-project-btn';
        const renameOptionBtn = document.createElement('div');
        renameOptionBtn.textContent = 'rename';
        renameOptionBtn.classList.add('animate-btn')
        popupMenu.appendChild(deleteOptionBtn);
        popupMenu.appendChild(renameOptionBtn);

        moreActionImg.addEventListener('click', () => {
            popupMenu.classList.toggle('show');
        })
        //(add the popupMenu to the nextsibling of porjectWrap)
        // projectWrap.parentNode.insertBefore(popupMenu, projectWrap.nextSibling);
        projectWrap.appendChild(popupMenu);

        //add eventListener:when click outside of the menu, close it
        setupProjectPopupMenuOutsideClick(popupMenu, moreActionImg);

        //function the delete project button
        //(for dynamic elements, attach event listeners when creating them, not in the controller.js)
        deleteOptionBtn.addEventListener('click', () => {
            removeProject(project);
            renderProjectsInSidebar();
            renderMainContent();
        })

        //function the rename project button
        //(for dynamic elements, attach event listeners when creating them, not in the controller.js)
        renameOptionBtn.addEventListener('click', () => {
            const renameProjectWrap = document.createElement('div');
            const renameProjectInput = document.createElement('input');
            const renameProjectBtn = document.createElement('div');
            const cancelRenameActionBtn = document.createElement('div');
            renameProjectWrap.classList.add('rename-project-wrap');
            renameProjectBtn.textContent = 'submit';
            cancelRenameActionBtn.textContent = 'cancel';
            renameProjectBtn.classList.add('animate-btn', 'rename-project-btn');
            cancelRenameActionBtn.classList.add('animate-btn', 'cancel-rename-btn');
            renameProjectWrap.appendChild(renameProjectInput);
            renameProjectWrap.appendChild(renameProjectBtn);
            renameProjectWrap.appendChild(cancelRenameActionBtn);

            renameProjectBtn.addEventListener('click', () => {
                if (renameProjectInput.value) {
                    const theNewProjectName = renameProjectInput.value;
                    renameProject(project, theNewProjectName);
                    renderProjectsInSidebar();
                    renderMainContent();
                }               
            })

            cancelRenameActionBtn.addEventListener('click', () => {
                renderProjectsInSidebar();
                renderMainContent();                
            })


            projectName.replaceWith(renameProjectWrap);

            popupMenu.classList.toggle('show');

        })

    })

}


// Export Function: show all projects and todos after project, and the todos without project
function renderMainContent() {
    //( always clear the content first if it's a update render)
    mainContentafterAddBtn.innerHTML = '';
    renderProjectsAndTodosInMainContent();
    renderTodosWithoutProject();
}

export {content, todoInputDialog, todoInputForm, addNewTodoBtn, showProjectList, renderMainContent, renderProjectsInSidebar, createAddProjectBtn, createAddProjectDialog};
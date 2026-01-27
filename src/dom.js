import {projectList, addProject, removeProject, renameProject} from "./project.js"
import {todoList, removeTodo} from "./todo.js";
import {logData} from "./storage.js";
import rightArrow from "./imgs/arrow_right_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";
import downArrow from "./imgs/arrow_down_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";
import projectIcon from "./imgs/format_list_bulleted_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";
import addIcon from "./imgs/add_2_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";
import moreActionIcon from "./imgs/more_vert_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";
import deleteIcon from "./imgs/delete_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";


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

    //add a eventListener on '.project-item', so it can fold/unfold the todos
    projectDiv.addEventListener('click', () => {
        const todosAppendedAfter = projectDiv.parentElement.querySelector('.todo-wrap');
        if (todosAppendedAfter) {
            todosAppendedAfter.remove()
        } else {
            renderTodosAfterProject(projectName);
        }
    })

    projectDiv.appendChild(imgInProjectDiv);
    projectDiv.appendChild(pInProjectDiv);
    projectAndTodosPackage.appendChild(projectDiv);

    return projectAndTodosPackage;//return it to add todos after
}

// Inner Function: stop event propagation: 
const stopClick = (e) => e.stopPropagation();

// Inner Function: create todo item
function createTodoItem(todoObject) {
    //wrap: div (wrap todo-item and the description)
    const wrappedTodoAndDescription = document.createElement('div');
    wrappedTodoAndDescription.classList.add('todo-and-description-wrap')

    //inner-wrap: div (wrap only todo items)
    const wrappedTodoItem = document.createElement('div');
    wrappedTodoItem.classList.add('todo-wrap');

    //Inner Function: render todo title with a checkbox(isDone)
    function renderTodoTitle(todoCheckBoxWrap, todoObject) {
        todoCheckBoxWrap.replaceChildren();
        const todoCheckBox = document.createElement('input');
        todoCheckBox.type = 'checkbox';
        todoCheckBox.classList.add('todo-isDone-value');
        todoCheckBoxWrap.classList.add('todo-isDone-item');
        todoCheckBox.checked = todoObject.isDone;
        todoCheckBox.addEventListener('change', () => {
            todoObject.isDone = todoCheckBox.checked;//change the data, dont need to rerender it now, since the status is matched
            updateTodoItemColor();
        });
        todoCheckBox.addEventListener('click', stopClick);//stop propagation
        const todoTitle = document.createElement('p');
        todoTitle.textContent = todoObject.title;
        todoTitle.classList.add('todo-title');
        todoTitle.id = `${todoObject.title}-title`
        todoCheckBoxWrap.appendChild(todoCheckBox);
        todoCheckBoxWrap.appendChild(todoTitle);

        todoTitle.addEventListener('click', () => renderTodoTitleInput(todoCheckBoxWrap, todoObject));
    }

    //Inner Function: 
    function renderTodoTitleInput(todoCheckBoxWrap, todoObject) {
        todoCheckBoxWrap.replaceChildren();
        const changeTodoTitleInput = document.createElement('input');
        todoCheckBoxWrap.appendChild(changeTodoTitleInput);
        changeTodoTitleInput.classList.add('change-todo-tite-input');

        const finishEditing = () => {
            const newValue = changeTodoTitleInput.value.trim();
            if (newValue) {
                todoObject.title = newValue;
            }
            renderTodoTitle(todoCheckBoxWrap, todoObject);
        }

        changeTodoTitleInput.addEventListener('click', stopClick);
        changeTodoTitleInput.addEventListener('blur', finishEditing);
        changeTodoTitleInput.addEventListener('change', finishEditing);

    }

    //isDone: checkbox & title: title
    const todoCheckBoxWrap = document.createElement('div');
    renderTodoTitle(todoCheckBoxWrap, todoObject);
    
    //Inner Function: 
    function renderDuedate(todoDuedateWrap, todoObject) {
        todoDuedateWrap.replaceChildren();
        const todoDuedateLabel = document.createElement('label');
        todoDuedateLabel.classList.add('todo-duedate-item');
        const todoDuedateLabelP = document.createElement('p');
        todoDuedateLabelP.textContent = 'Duedate:'
        todoDuedateLabel.appendChild(todoDuedateLabelP)
        const todoDuedate = document.createElement('div');
        todoDuedate.textContent = todoObject.dueDate;
        todoDuedateLabel.appendChild(todoDuedate);
        todoDuedate.classList.add('todo-dueDate');
        todoDuedateWrap.appendChild(todoDuedateLabel);
        todoDuedate.addEventListener('click', () => renderDuedateInput(todoDuedateWrap, todoObject));
    }

    //Inner Function: 
    function renderDuedateInput(todoDuedateWrap, todoObject) {
        todoDuedateWrap.replaceChildren();
        const todoDuedateLabel = document.createElement('label');
        todoDuedateLabel.textContent = 'Duedate:'
        todoDuedateLabel.classList.add('todo-duedate-item');
        const todoDuedateInput = document.createElement('input');
        todoDuedateInput.type = 'date';
        todoDuedateInput.value = todoObject.dueDate || '';
        todoDuedateLabel.appendChild(todoDuedateInput);
        todoDuedateWrap.appendChild(todoDuedateLabel);
        const finishEditing = () => {
            if(todoDuedateInput.value) {
                todoObject.dueDate = todoDuedateInput.value;
            }
            renderDuedate(todoDuedateWrap, todoObject);
        };
        todoDuedateInput.addEventListener('change', finishEditing);
        todoDuedateInput.addEventListener('blur', finishEditing);
        todoDuedateInput.addEventListener('click', stopClick);
    }

    //dueDate:date
    const todoDuedateWrap = document.createElement('div');
    todoDuedateWrap.classList.add('todo-duedate-item-wrap');
    renderDuedate(todoDuedateWrap, todoObject);

    //priority: <select>
    const todoPrioritySelect = document.createElement('select');
    todoPrioritySelect.classList.add('todo-priority');
    const todoPriorityLabel = document.createElement('label');
    const todoPriorityLabelP = document.createElement('p');
    todoPriorityLabelP.textContent = 'Priority:';
    todoPriorityLabel.appendChild(todoPriorityLabelP);
    todoPriorityLabel.classList.add('todo-priority-item');
    const optionTop = document.createElement('option');
    optionTop.textContent = 'top';
    optionTop.value = 'top';
    const optionMedium = document.createElement('option');
    optionMedium.textContent = 'medium';
    optionMedium.value = 'medium';
    const optionLow = document.createElement('option');
    optionLow.textContent = 'low';
    optionLow.value = 'low';
    const optionUnset = document.createElement('option');
    optionUnset.textContent = 'unset';
    optionUnset.value = 'unset';
    todoPrioritySelect.appendChild(optionTop);
    todoPrioritySelect.appendChild(optionMedium);
    todoPrioritySelect.appendChild(optionLow);
    todoPrioritySelect.appendChild(optionUnset);
    todoPriorityLabel.appendChild(todoPrioritySelect);
    todoPrioritySelect.value = todoObject.priority;
    todoPrioritySelect.addEventListener('change', () => {
        todoObject.priority = todoPrioritySelect.value;
        updateTodoItemColor();
    })

    //project: <select>
    const todoProjectSelect = document.createElement('select');
    todoProjectSelect.classList.add('todo-project');
    const todoProjectLabel = document.createElement('label');
    todoProjectLabel.classList.add('todo-project-item');
    const todoProjectLabelP = document.createElement('p');
    todoProjectLabelP.textContent = 'Project:';
    todoProjectLabel.appendChild(todoProjectLabelP);
    projectList.forEach((project) => {
        const option = document.createElement('option');
        option.textContent = project;
        option.value = project;
        todoProjectSelect.appendChild(option);
    })
    const optionNone = document.createElement('option');
    optionNone.textContent = 'none';
    optionNone.value = 'none';
    todoProjectSelect.appendChild(optionNone);
    todoProjectLabel.appendChild(todoProjectSelect);
    todoProjectSelect.value = todoObject.project;
    todoProjectSelect.addEventListener('change', () => {
        todoObject.project = todoProjectSelect.value;
        renderMainContent();
    })

    //description: hide div
    const todoDescription = document.createElement('div');
    todoDescription.classList.add('todo-description', 'hide');
    todoDescription.innerHTML = `Description:<br>${todoObject.description}`;
    
    //delete icon
    const deleteTodoBtn = document.createElement('img');
    deleteTodoBtn.classList.add('delete-item');
    deleteTodoBtn.src = deleteIcon;
    deleteTodoBtn.addEventListener('click', () => {
        //call the dialog to confirm first
        const deleteTodoWarningDialog = document.querySelector('#delete-todo-warning-dialog');
        const deleteTodoYesBtn = document.querySelector('#delete-todo-yes-btn');
        const deleteTodoCancelBtn = document.querySelector('#delete-todo-cancel-btn');
        deleteTodoWarningDialog.showModal();
        deleteTodoYesBtn.addEventListener('click', () => {
            deleteTodoWarningDialog.close();
            removeTodo(todoObject.title);
            renderMainContent();
        })
        deleteTodoCancelBtn.addEventListener('click', () => {
            deleteTodoWarningDialog.close();
        })
    })
    deleteTodoBtn.addEventListener('click', stopClick);

    //wrap them 
    wrappedTodoItem.appendChild(todoCheckBoxWrap);
    wrappedTodoItem.appendChild(todoDuedateWrap);
    wrappedTodoItem.appendChild(todoPriorityLabel);
    wrappedTodoItem.appendChild(todoProjectLabel);
    wrappedTodoItem.appendChild(deleteTodoBtn);
    wrappedTodoAndDescription.appendChild(wrappedTodoItem);
    wrappedTodoAndDescription.appendChild(todoDescription);

    //add a eventListener on todo item, taggle the description
    wrappedTodoItem.addEventListener('click', () => {
        todoDescription.classList.toggle('hide');
    })

    //in the todo item, if there is a click component, add a stop propagation eventListener
    todoProjectSelect.addEventListener('click', stopClick);
    todoPrioritySelect.addEventListener('click', stopClick);
    todoDuedateWrap.addEventListener('click', stopClick);

    updateTodoItemColor();

    return wrappedTodoAndDescription;
}

// Inner Function: update todo item's color reagrding the priority and isDone
function updateTodoItemColor() {
    const theTodoItems = document.querySelectorAll('.todo-wrap');
    theTodoItems.forEach(theTodoItem => {
        const thePriority = theTodoItem.querySelector('.todo-priority').value;
        const theIsDone = theTodoItem.querySelector('.todo-isDone-value').checked;
        const theDeleteBtn = theTodoItem.querySelector('.delete-item');
        let theBackgroundColor;
        let theColor;
        let theFontWeight;
        let theDeleteBtnColor;
        if (theIsDone === true) {
            theBackgroundColor = '#95a5a6';
        } else {
            switch(thePriority) {
                case 'top':
                    theBackgroundColor = '#e74c3c';
                    theColor = 'white';
                    theFontWeight = 'bolder';
                    theDeleteBtnColor = 'invert(1)'
                    break;
                case 'medium':
                    theBackgroundColor = '#f39c12';
                    theColor = 'white';
                    theFontWeight = 'bolder';
                    theDeleteBtnColor = 'invert(1)'
                    break;
                case 'low':
                    theBackgroundColor = '#2ecc71';
                    theColor = 'white';
                    theFontWeight = 'bolder';
                    theDeleteBtnColor = 'invert(1)'
                    break;
                default:
                    theBackgroundColor = 'white';
                    theColor = 'black';
                    theFontWeight = 'normal';
                    theDeleteBtnColor = ''
            }
        }
        theTodoItem.style.backgroundColor = theBackgroundColor;
        theTodoItem.style.color = theColor;
        theTodoItem.style.fontWeight = theFontWeight;
        theDeleteBtn.style.filter = theDeleteBtnColor;
    })
}

// Inner Function: render todos after each project
function renderTodosAfterProject(projectName) {
    // append todo after the project
    const thisProjectsTodoList = todoList.filter(todoItem => todoItem.project === projectName);

    thisProjectsTodoList.forEach(thisProjectsTodo => {
        const wrappedTodoItem = createTodoItem(thisProjectsTodo);
        const theProjectPackage = document.querySelector(`#${projectName.replaceAll(' ', '-')}-todo-wrap`);
        theProjectPackage.appendChild(wrappedTodoItem);
    });
    updateTodoItemColor();

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
        wrappedTodoItemWithoutProject.classList.add('the-todo-without-project');
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
    addProjectBtnWrap.classList.add('animate-btn');
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

let popupListenerRegistered = false;
//Inner Function: make the add project popup menu close when click outside of it
function setupProjectPopupMenuOutsideClick(popup, btn) {
    if (popupListenerRegistered) return;
    popupListenerRegistered = true;

    document.addEventListener('click', (event) => {
        document.querySelectorAll('.edit-project-popup-menu.show')
            .forEach(menu => {
                if(!menu.contains(event.target)) {
                    menu.classList.remove('show');
                }
            })
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

        moreActionImg.addEventListener('click', (e) => {
            e.stopPropagation();
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
    updateTodoItemColor();
    //for test only:
    logData();
}

export {content, todoInputDialog, todoInputForm, addNewTodoBtn, showProjectList, renderMainContent, renderProjectsInSidebar, createAddProjectBtn, createAddProjectDialog, renderProjectsAndTodosInMainContent, updateTodoItemColor};
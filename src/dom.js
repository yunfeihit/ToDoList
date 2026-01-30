import {projectList, addProject, removeProject, renameProject} from "./project.js"
import {todoList, removeTodo, returnTodoCountDown} from "./todo.js";
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

//--------------- new todo <dialog> ----------------------
addNewTodoBtn.addEventListener('click', () => todoInputDialog.showModal())

// render the project list('<option>') after the <select>
function showProjectListAfterSelect() {
    projectList.forEach(item => {
        const newRenderProject = document.createElement('option');
        newRenderProject.value = item;
        showProjectList.appendChild(newRenderProject);
    })
}

//--------------- Helper function ----------------------
const stopClick = (e) => e.stopPropagation();

//--------------- Reusable function ----------------------
function popupWarningDialog(callbackfunction) {
    const deleteTodoWarningDialog = document.querySelector('#delete-warning-dialog');
    const deleteTodoYesBtn = document.querySelector('#delete-yes-btn');
    const deleteTodoCancelBtn = document.querySelector('#delete-cancel-btn');
    deleteTodoWarningDialog.showModal();
    deleteTodoYesBtn.addEventListener('click', () => {
        deleteTodoWarningDialog.close();
        callbackfunction();
        // removeTodo(todoObject.title);
        // renderMainContent();
    }, {once: true})
    deleteTodoCancelBtn.addEventListener('click', () => {
        deleteTodoWarningDialog.close();
    }, {once: true})
}

// return the Wrap to append todos later
function createProjectItem(projectName) {
    const projectAndTodosPackage =document.createElement('div'); //wrap the project item and meant for append the todo package later
    const projectWrap = document.createElement('div');
    const projectIcon = document.createElement('img');
    const projectNameEl = document.createElement('p');

    projectNameEl.textContent = projectName;
    projectIcon.src = rightArrow;
    projectWrap.classList.add('project-item');
    projectWrap.id = projectName.replaceAll(' ', '-'); //to replace the space of project name, otherwise the id name will be illegal
    projectAndTodosPackage.classList.add('project-todo-wrap');
    projectAndTodosPackage.id = `${projectName.replaceAll(' ', '-')}-todo-wrap`;

    //click to fold/unfold the todos
    projectWrap.addEventListener('click', () => {
        const todosAppendedAfter = projectWrap.parentElement.querySelector('.todo-wrap');
        if (todosAppendedAfter) {
            todosAppendedAfter.remove()
        } else {
            renderTodosAfterProject(projectName);
        }
    })

    projectWrap.appendChild(projectIcon);
    projectWrap.appendChild(projectNameEl);
    projectAndTodosPackage.appendChild(projectWrap);

    return projectAndTodosPackage;//return it to append todos
}

function createTodoItem(todoObject) {
    //(wrap todo-item and the description)
    const wrappedTodoAndDescription = document.createElement('div');
    wrappedTodoAndDescription.classList.add('todo-and-description-wrap');

    //(wrap only todo items)
    const wrappedTodoItem = document.createElement('div');
    wrappedTodoItem.classList.add('todo-wrap');

    //(render todo title with a isDone checkbox)
    function renderTodoTitle(todoCheckBoxWrap, todoObject) {
        todoCheckBoxWrap.replaceChildren();//always clear before render

        const todoCheckBox = document.createElement('input');
        todoCheckBox.type = 'checkbox';
        todoCheckBox.classList.add('todo-isDone-value');
        todoCheckBoxWrap.classList.add('todo-isDone-item');
        todoCheckBox.checked = todoObject.isDone;
        todoCheckBox.addEventListener('change', () => {
            todoObject.isDone = todoCheckBox.checked;
            updateTodoItemColor();
        });
        todoCheckBox.addEventListener('click', stopClick);//since there are too many eventListeners, always remmeber to stop propagation

        const todoTitle = document.createElement('p');
        todoTitle.textContent = todoObject.title;
        todoTitle.classList.add('todo-title');
        todoTitle.id = `${todoObject.title}-title`

        todoCheckBoxWrap.appendChild(todoCheckBox);
        todoCheckBoxWrap.appendChild(todoTitle);

        todoTitle.addEventListener('click', () => renderTodoTitleInput(todoCheckBoxWrap, todoObject));
    }

    function renderTodoTitleInput(todoCheckBoxWrap, todoObject) {
        todoCheckBoxWrap.replaceChildren();

        const changeTodoTitleInput = document.createElement('input');
        todoCheckBoxWrap.appendChild(changeTodoTitleInput);
        changeTodoTitleInput.classList.add('change-todo-title-input');

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

    //isDone-checkbox & title:
    const todoCheckBoxWrap = document.createElement('div');
    renderTodoTitle(todoCheckBoxWrap, todoObject);
    
    function renderDuedate(todoDuedateWrap, todoObject) {
        todoDuedateWrap.replaceChildren();

        const todoDuedateLabel = document.createElement('label');
        todoDuedateLabel.classList.add('todo-duedate-item');
        const todoDuedateLabelP = document.createElement('p');
        todoDuedateLabelP.textContent = 'Duedate:'
        todoDuedateLabel.appendChild(todoDuedateLabelP)

        const todoDuedate = document.createElement('div');
        todoDuedate.textContent = todoObject.dueDate ? todoObject.dueDate.toISOString().split('T')[0] : "---- -- --";
        todoDuedate.classList.add('todo-dueDate');

        todoDuedateLabel.appendChild(todoDuedate);
        todoDuedateWrap.appendChild(todoDuedateLabel);
        todoDuedate.addEventListener('click', () => renderDuedateInput(todoDuedateWrap, todoObject));
    }

    function renderDuedateInput(todoDuedateWrap, todoObject) {
        todoDuedateWrap.replaceChildren();

        const todoDuedateLabel = document.createElement('label');
        todoDuedateLabel.textContent = 'Duedate:'
        todoDuedateLabel.classList.add('todo-duedate-item');
        const todoDuedateInput = document.createElement('input');
        todoDuedateInput.type = 'date';
        todoDuedateInput.value = todoObject.dueDate
            ? todoObject.dueDate.toISOString().split('T')[0]
            : '';  

        todoDuedateLabel.appendChild(todoDuedateInput);
        todoDuedateWrap.appendChild(todoDuedateLabel);

        const finishEditing = () => {
            if(todoDuedateInput.value) {
                todoObject.dueDate = new Date(todoDuedateInput.value);
            }
            renderDuedate(todoDuedateWrap, todoObject);
        };

        todoDuedateInput.addEventListener('change', finishEditing);
        todoDuedateInput.addEventListener('blur', finishEditing);
        todoDuedateInput.addEventListener('click', stopClick);
    }

    //dueDate:
    const todoDuedateWrap = document.createElement('div');
    todoDuedateWrap.classList.add('todo-duedate-item-wrap');
    renderDuedate(todoDuedateWrap, todoObject);

    //priority:
    const todoPriorityLabel = document.createElement('label');
    const todoPriorityLabelP = document.createElement('p');
    todoPriorityLabelP.textContent = 'Priority:';
    todoPriorityLabel.appendChild(todoPriorityLabelP);
    todoPriorityLabel.classList.add('todo-priority-item');

    const todoPrioritySelect = document.createElement('select');
    todoPrioritySelect.classList.add('todo-priority');
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

    //project:
    const todoProjectLabel = document.createElement('label');
    todoProjectLabel.classList.add('todo-project-item');
    const todoProjectLabelP = document.createElement('p');
    todoProjectLabelP.textContent = 'Project:';
    todoProjectLabel.appendChild(todoProjectLabelP);

    const todoProjectSelect = document.createElement('select');
    todoProjectSelect.classList.add('todo-project');

    projectList.forEach((project) => {
        const option = document.createElement('option');
        option.textContent = project;
        option.value = project;
        todoProjectSelect.appendChild(option);
    })
    //add a none(project) option manually
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

    //description:
    const todoDescriptionWrap = document.createElement('div');

        function renderDescription(todoDescriptionWrap, todoObject) {
            todoDescriptionWrap.replaceChildren();

            const todoDescription = document.createElement('div');
            todoDescriptionWrap.appendChild(todoDescription);    
            todoDescriptionWrap.classList.add('todo-description', 'hide');
            todoDescription.innerHTML = `Description:<br>${todoObject.description}`;
            todoDescription.addEventListener('click', () => renderDescriptionInput(todoDescriptionWrap, todoObject));
        }
        function renderDescriptionInput(todoDescriptionWrap, todoObject) {
            todoDescriptionWrap.replaceChildren();

            const todoDescriptionInputTitle = document.createElement('div');
            todoDescriptionInputTitle.textContent = 'Description:';
            const todoDescriptionInput = document.createElement('input');
            todoDescriptionInput.classList.add('todo-description-input');
            todoDescriptionInput.type = 'text';
            todoDescriptionInput.value = todoObject.description;
            const finishEditing = () => {
                const newDescription = todoDescriptionInput.value.trim();
                if (newDescription) {
                    todoObject.description = newDescription;
                    renderDescription(todoDescriptionWrap, todoObject);
                    todoDescriptionWrap.classList.toggle('hide');
                }
            };
            todoDescriptionInput.addEventListener('blur', finishEditing);
            todoDescriptionInput.addEventListener('change', finishEditing);
            todoDescriptionInput.addEventListener('click', stopClick);
            todoDescriptionWrap.appendChild(todoDescriptionInputTitle);
            todoDescriptionWrap.appendChild(todoDescriptionInput);
        }
    renderDescription(todoDescriptionWrap, todoObject);
    
    //countDown:
    const todoCountdownWrap = document.createElement('div');
    todoCountdownWrap.classList.add('todo-countdown-item')
    const todoCountdownLabel = document.createElement('label');
    const todoCountdown = document.createElement('div');
    todoCountdownWrap.appendChild(todoCountdownLabel);
    todoCountdownLabel.textContent = 'Countdown:';
    todoCountdownWrap.appendChild(todoCountdown);
    todoCountdown.textContent = returnTodoCountDown(todoObject);


    //delete icon:
    const deleteTodoBtn = document.createElement('img');
    deleteTodoBtn.classList.add('delete-item');
    deleteTodoBtn.src = deleteIcon;
    deleteTodoBtn.addEventListener('click', () => {
        //Inner Function: the delete action to callback
        const removeTodoAction = () => {
            removeTodo(todoObject.title);
            renderMainContent();
        }
        popupWarningDialog(removeTodoAction);
    })
    deleteTodoBtn.addEventListener('click', stopClick);

    //wrap them 
    wrappedTodoItem.appendChild(todoCheckBoxWrap);
    wrappedTodoItem.appendChild(todoDuedateWrap);
    wrappedTodoItem.appendChild(todoPriorityLabel);
    wrappedTodoItem.appendChild(todoProjectLabel);
    wrappedTodoItem.appendChild(todoCountdownWrap);
    wrappedTodoItem.appendChild(deleteTodoBtn);
    wrappedTodoAndDescription.appendChild(wrappedTodoItem);
    wrappedTodoAndDescription.appendChild(todoDescriptionWrap);

    //add a eventListener on todo item, taggle the description
    wrappedTodoItem.addEventListener('click', () => {
        todoDescriptionWrap.classList.toggle('hide');
    })

    //in the todo item, if there is a click component, add a stop propagation eventListener
    todoProjectSelect.addEventListener('click', stopClick);
    todoPrioritySelect.addEventListener('click', stopClick);
    todoDuedateWrap.addEventListener('click', stopClick);

    updateTodoItemColor();

    return wrappedTodoAndDescription;
}

//(update todo item's color reagrding the priority and isDone status)
function updateTodoItemColor() {
    const theTodoItems = document.querySelectorAll('.todo-wrap');
    theTodoItems.forEach(theTodoItem => {
        const thePriority = theTodoItem.querySelector('.todo-priority').value;
        const theIsDone = theTodoItem.querySelector('.todo-isDone-value').checked;
        const theDeleteBtn = theTodoItem.querySelector('.delete-item');
        let theBackgroundColor;
        let theColor;//font color
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

function renderProjectsAndTodosInMainContent() {
    projectList.forEach(
        project => {
        const projectAndTodosPackage = createProjectItem(project);
        mainContentafterAddBtn.appendChild(projectAndTodosPackage);
        renderTodosAfterProject(project);
    })
}

//(render the todos dont belong to any project)
function renderTodosWithoutProject() {
    const todoListWithoutProject = todoList.filter(item => 
        !projectList.includes(item.project)
    );

    //create a blank block to make some distance before todos without projcet
    const emptyBlock = document.createElement('div');
    emptyBlock.id = "empty-block";
    mainContentafterAddBtn.appendChild(emptyBlock);

    todoListWithoutProject.forEach(todoWithoutProject => {
        const wrappedTodoItemWithoutProject = createTodoItem(todoWithoutProject);
        wrappedTodoItemWithoutProject.classList.add('the-todo-without-project');
        mainContentafterAddBtn.appendChild(wrappedTodoItemWithoutProject);
    })
}

//(create a add project button at the placeholder 'add-project-container')
//(return the button)
function createAddProjectBtn() {
    const theContainer = document.querySelector('#add-project-container');
    theContainer.innerHTML = '';//if render, always clear first

    const addProjectBtnWrap = document.createElement('div');
    const addProjectIcon = document.createElement('img');
    const addProjectP = document.createElement('p');

    addProjectBtnWrap.appendChild(addProjectIcon);
    addProjectBtnWrap.appendChild(addProjectP);

    addProjectBtnWrap.classList.add('project-in-sidebar'); //make the format consistent with other projects in sidebar
    addProjectBtnWrap.classList.add('animate-btn');
    addProjectBtnWrap.id = 'add-project-btn';
    addProjectIcon.src = addIcon;
    addProjectP.textContent = 'Add Project';

    theContainer.appendChild(addProjectBtnWrap);

    return addProjectBtnWrap;
}

//(create a add new project dialog at the placeholder 'add-project-container')
//(return the dialog as an object)
function createAddProjectDialog() {
    const theContainer = document.querySelector('#add-project-container')
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
//(make the add project popup menu close when click outside of it)
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

        //small pop-up menu(delete and rename the project):
        //(it actually append after each projectWrap item, use class 'show' to taggle visable/invisable)
        const popupMenu = document.createElement('div');
        popupMenu.classList.add('edit-project-popup-menu');
        const deleteOptionBtn = document.createElement('div');
        deleteOptionBtn.textContent = 'delete';
        deleteOptionBtn.classList.add('animate-btn');
        const renameOptionBtn = document.createElement('div');
        renameOptionBtn.textContent = 'rename';
        renameOptionBtn.classList.add('animate-btn')
        popupMenu.appendChild(deleteOptionBtn);
        popupMenu.appendChild(renameOptionBtn);

        moreActionImg.addEventListener('click', (e) => {
            e.stopPropagation();
            popupMenu.classList.toggle('show');
        })

        projectWrap.appendChild(popupMenu);

        //add eventListener:when click outside of the menu, close it
        setupProjectPopupMenuOutsideClick(popupMenu, moreActionImg);

        //function the delete project button
        //(for dynamic elements, attach event listeners when creating them, not in the controller.js)
        deleteOptionBtn.addEventListener('click', () => {
            const removeProjectAction = () => {
                removeProject(project);
                renderProjectsInSidebar();
                renderMainContent();
            }
            popupWarningDialog(removeProjectAction);
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
}


export {content, todoInputDialog, todoInputForm, showProjectList, showProjectListAfterSelect, renderMainContent, renderProjectsInSidebar, createAddProjectBtn, createAddProjectDialog, renderProjectsAndTodosInMainContent, updateTodoItemColor};
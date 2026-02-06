//!Important role: dom.js should not know any function from controller.js, also should not import anything from controller.js(the dependency direction must be one-way: controller.js-->dom.js)
import {projectList, removeProject, renameProject} from "./project.js"
import {
    todoList, 
    removeTodo, 
    returnTodoCountDown, 
    updateTodoIsdone,
    updateTodoTitle,
    updateTodoDuedate,
    updateTodoPriority,
    updateTodoProject,
    updateTodoDescription
} from "./todo.js";
// import imgs:
import rightArrow from "./imgs/arrow_right_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";
import projectIcon from "./imgs/format_list_bulleted_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";
import addIcon from "./imgs/add_2_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";
import moreActionIcon from "./imgs/more_vert_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";
import deleteIcon from "./imgs/delete_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";


const content = document.querySelector('#content');
const mainContentafterAddBtn = document.querySelector('#main-content-after-addBtn');
const todoInputDialog = document.querySelector('#todo-input-dialog');
const addNewTodoBtn = document.querySelector('#add-new-todo-btn');
const todoInputForm = document.querySelector('#todo-input-form');
const projectOptionsAnchor = document.querySelector('#show-project-list');

//--------------- new todo <dialog> ----------------------
addNewTodoBtn.addEventListener('click', () => todoInputDialog.showModal())

//(function to handle the 'todoMetaData' when 'todoInputDialog' is closed)
//(!if a function query DOM or attach eventListener, is should in the dom.js)
//(!DOM-binding utility: bind eventListener or other actions with DOM, the handler binded can be defined later or now, if the handler is not about DOM render, it should be defined in the controller.js or other files)
//(!'handler' is a function defined in controller.js and passed as an argument)
function bindTodoDialogClose(handler) {
    todoInputDialog.addEventListener('close', () => {
        //(if the dialog is not closed by submit, do nothing but just return)
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
        handler(todoMetaData);
    })
}

//(when click on the 'project' button on the sidebar, fold todos and only show the project)
function bindSidebarProjectBtn(handler) {
    const sidebarProjectBtn = document.querySelector('#sidebar-project');
    sidebarProjectBtn.addEventListener('click', handler)
}

function bindSidebarTodoBtn(handler) {
    const sidebarTodoBtn = document.querySelector('#sidebar-todo');
    sidebarTodoBtn.addEventListener('click', handler)
}

function bindSidebarCalendarBtn(handler) {
    const sideBarCalendarBtn = document.querySelector('#sidebar-Calendar');
    sideBarCalendarBtn.addEventListener('click', handler)
}

// render the project list('<option>') after the <select>
function showProjectListAfterSelect() {
    projectOptionsAnchor.innerHTML = '';
    projectList.forEach(item => {
        const newRenderProject = document.createElement('option');
        newRenderProject.value = item;
        projectOptionsAnchor.appendChild(newRenderProject);
    })
}

//--------------- Helper function ----------------------
const stopClick = (e) => e.stopPropagation();

//--------------- Reusable function ----------------------
//(pop up warning dialog before run the 'callback function' first, need confirm to continue)
function popupWarningDialog(callbackfunction) {
    const deleteTodoWarningDialog = document.querySelector('#delete-warning-dialog');
    const deleteTodoYesBtn = document.querySelector('#delete-yes-btn');
    const deleteTodoCancelBtn = document.querySelector('#delete-cancel-btn');
    deleteTodoWarningDialog.showModal();
    deleteTodoYesBtn.addEventListener('click', () => {
        deleteTodoWarningDialog.close();
        callbackfunction();
    }, {once: true})//('{once: true}' means: After this listener run once, automatically remove it)
    deleteTodoCancelBtn.addEventListener('click', () => {
        deleteTodoWarningDialog.close();
    }, {once: true})
}

//(create project item in the main-content)
function createProjectItem(projectName, todoHandlers) {
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
    //(this eventListener only act on the DOM, it should in the dom.js)
    projectWrap.addEventListener('click', () => {
        const todosAppendedAfter = projectWrap.parentElement.querySelector('.todo-wrap');
        if (todosAppendedAfter) {
            todosAppendedAfter.remove()
        } else {
            renderTodosAfterProject(
                projectName,
                todoHandlers
            );
        }
    })

    projectWrap.appendChild(projectIcon);
    projectWrap.appendChild(projectNameEl);
    projectAndTodosPackage.appendChild(projectWrap);

    return projectAndTodosPackage;//return it to append todos
}

function createTodoItem(
    todoObject, 
    todoHandlers
) {
    //(wrap todo-item and the description)
    const wrappedTodoAndDescription = document.createElement('div');
    wrappedTodoAndDescription.classList.add('todo-and-description-wrap');

    //(wrap only todo items)
    const wrappedTodoItem = document.createElement('div');
    wrappedTodoItem.classList.add('todo-wrap');

    //(render todo title with a 'isDone' checkbox)
    function renderTodoTitle(todoCheckBoxWrap, todoObject) {
        todoCheckBoxWrap.replaceChildren();//always clear before render

        const todoCheckBox = document.createElement('input');
        todoCheckBox.type = 'checkbox';
        todoCheckBox.classList.add('todo-isDone-value');
        todoCheckBoxWrap.classList.add('todo-isDone-item');
        todoCheckBox.checked = todoObject.isDone;//initialization
        todoCheckBox.addEventListener('change', () => 
            {
                todoHandlers.onCheckboxToggle(todoObject, todoCheckBox.checked);
                updateTodoItemColor();
            }
            
        //     () => {
        //     //(!!use a function to uncouple DOM from data layer)
        //     updateTodoIsdone(todoObject, todoCheckBox.checked);
        //     updateTodoItemColor();
        // }
        );
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
                todoHandlers.onTitleChange(todoObject, newValue);
                // updateTodoTitle(todoObject, newValue);
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
                todoHandlers.onDuedateChange(todoObject, todoDuedateInput.value);
                // const theNewDuedate = new Date(todoDuedateInput.value);
                // updateTodoDuedate(todoObject, theNewDuedate);
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
    todoPrioritySelect.addEventListener('change', () => 
        {
            todoHandlers.onPriorityChange(todoObject, todoPrioritySelect.value);
            updateTodoItemColor();
        }
    //     () => {
    //     updateTodoPriority(todoObject, todoPrioritySelect.value);
    //     updateTodoItemColor();
    // }
    )

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
        todoHandlers.onProjectChange(todoObject, todoProjectSelect.value);
        // updateTodoProject(todoObject, todoProjectSelect.value);
        renderMainContent(
            todoHandlers
        );
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
                    todoHandlers.onDescriptionChange(todoObject, newDescription);
                    // updateTodoDescription(todoObject, newDescription);
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
            removeTodo(todoObject.id);
            renderMainContent(todoHandlers);
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

function renderTodosAfterProject(
    projectName,
    todoHandlers
) {
    // append todo after the project
    const thisProjectsTodoList = todoList.filter(todoItem => todoItem.project === projectName);

    thisProjectsTodoList.forEach(thisProjectsTodo => {
        const wrappedTodoItem = createTodoItem(
            thisProjectsTodo,
            todoHandlers
        );
        const theProjectPackage = document.querySelector(`#${projectName.replaceAll(' ', '-')}-todo-wrap`);
        theProjectPackage.appendChild(wrappedTodoItem);
    });
    updateTodoItemColor();
}

function renderProjectsAndTodosInMainContent(todoHandlers) {
    projectList.forEach(
        project => {
        const projectAndTodosPackage = createProjectItem(
            project,
            todoHandlers
        );
        mainContentafterAddBtn.appendChild(projectAndTodosPackage);
        renderTodosAfterProject(
            project,
            todoHandlers
        );
    })
}

//(render the todos dont belong to any project)
function renderTodosWithoutProject(todoHandlers) {
    const todoListWithoutProject = todoList.filter(item => 
        !projectList.includes(item.project)
    );

    //create a blank block to make some distance before todos without project
    const emptyBlock = document.createElement('div');
    emptyBlock.id = "empty-block";
    mainContentafterAddBtn.appendChild(emptyBlock);

    todoListWithoutProject.forEach(todoWithoutProject => {
        const wrappedTodoItemWithoutProject = createTodoItem(
            todoWithoutProject,
            todoHandlers
        );
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

function buildAddProjectComponent(onAddProject) {
    createAddProjectBtn();
    const addProjectContainer = document.querySelector('#add-project-container')

    addProjectContainer.addEventListener('click', (event) => {
        if (event.target.closest('#add-project-btn')) {
            const theAddProjectDialogObject = createAddProjectDialog();

            theAddProjectDialogObject.addProjectButton.addEventListener('click', () => {
                onAddProject(theAddProjectDialogObject.addProjectInput.value);
            });

            theAddProjectDialogObject.cancelActionButton.addEventListener('click', () => {
                createAddProjectBtn();
            })
        }
    })
}

//(since this eventLisntener added to every project on the sidebar, but only need to work once, set the variable 'popuplistenerRegisterd' to make the eventListener work only once, because the variable will be passed 'true' the first time the eventListener called)
let popupListenerRegistered = false;
//(make the add project popup menu close when click outside of it)
function setupProjectPopupMenuOutsideClick() {
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
        setupProjectPopupMenuOutsideClick();

        //function the delete project button
        //(for dynamic elements, attach event listeners when creating them, not in the controller.js)
        deleteOptionBtn.addEventListener('click', () => {
            const removeProjectAction = () => {
                removeProject(project);
                renderProjectsInSidebar();
                renderMainContent(todoHandlers);
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
                    renderMainContent(todoHandlers);
                }               
            })

            cancelRenameActionBtn.addEventListener('click', () => {
                renderProjectsInSidebar();
                renderMainContent(todoHandlers);                
            })


            projectName.replaceWith(renameProjectWrap);

            popupMenu.classList.toggle('show');

        })

    })
    return 
}

//(call back in eventListener:fold all todo items, only shows the project)
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

function renderCalendarPage() {
    const mainContentafterAddBtn = document.querySelector('#main-content-after-addBtn');
    mainContentafterAddBtn.innerHTML = '';
    const tobeContinued = document.createElement('div');
    tobeContinued.id = 'tobeContinued';
    tobeContinued.textContent = 'to be continued...'
    mainContentafterAddBtn.appendChild(tobeContinued);
}

// Export Function: show all projects and todos after project, and the todos without project
function renderMainContent(todoHandlers) {
    //( always clear the content first if it's a update render)
    mainContentafterAddBtn.innerHTML = '';
    renderProjectsAndTodosInMainContent(todoHandlers);
    renderTodosWithoutProject(todoHandlers);
    updateTodoItemColor();
}


export {content, todoInputDialog, todoInputForm, projectOptionsAnchor, showProjectListAfterSelect, renderMainContent, renderProjectsInSidebar, createAddProjectBtn, createAddProjectDialog, renderProjectsAndTodosInMainContent, updateTodoItemColor, foldAllTodoItems, buildAddProjectComponent, renderCalendarPage, bindTodoDialogClose, bindSidebarProjectBtn, bindSidebarTodoBtn, bindSidebarCalendarBtn};
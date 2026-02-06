//!Important rules: controller.js can know the dom.js
import {
    Todo, 
    todoList, 
    addTodo, 
    // removeTodo,
    // updateTodoIsdone,
    // updateTodoTitle,
    // updateTodoDuedate,
    // updateTodoPriority,
    // updateTodoProject,
    // updateTodoDescription
} from "./todo.js";
import {projectList, addProject, removeProject} from "./project.js";
import {saveData, loadData, logData} from "./storage.js";
import {showProjectListAfterSelect, renderMainContent,  renderProjectsInSidebar,foldAllTodoItems, buildAddProjectComponent, renderCalendarPage, bindTodoDialogClose, bindSidebarProjectBtn, bindSidebarTodoBtn, bindSidebarCalendarBtn} from "./dom.js";

function isTodoTitleDuplicate(todoMetaData) {
    return todoList.some(todo => todo.title === todoMetaData.title);
}

function handleTodoSubmit(todoMetaData) {
    if (isTodoTitleDuplicate(todoMetaData)) {
        alert('This todo title already exist!');
        return false;
    };
    addTodo(todoMetaData);
    saveData();
    renderMainContent();
}

//(rehydrate data from 'JSON.parse(jsonData)', in which todo si turn to plain object, object is fine)
function rehydrateData(rawDataFromStorage) {
    if (!rawDataFromStorage) return null;
    const rehydratedTodos = rawDataFromStorage.todos.map(rowTodo => 
        new Todo(
            rowTodo.title,
            rowTodo.description,
            rowTodo.dueDate,
            rowTodo.priority,
            rowTodo.isDone,
            rowTodo.project,
            rowTodo.id
        )
    );
    const theRehydratedData = {
        todos: rehydratedTodos,
        projects: rawDataFromStorage.projects
    };
    return theRehydratedData;
}

function bootstrapApp() {
    const savedData = loadData();

    todoList.length = 0;
    projectList.length = 0;

    if(savedData) {
        const rehydrateddata = rehydrateData(savedData);
        todoList.push(...rehydrateddata.todos);
        projectList.push(...rehydrateddata.projects)

        // savedData.projects.forEach(project => {
        //     projectList.push(project);
        // })
        // savedData.todos.forEach(todo => {
        //     todoList.push(
        //         new Todo(
        //             todo.title,
        //             todo.description,
        //             todo.dueDate,
        //             todo.priority,
        //             todo.isDone,
        //             todo.project,
        //             todo.id
        //        )
        //     )
        // })   
    } else {
        //add some project examples to show them in the first loading page
        projectList.push(
            'live',
            'learn JS'
        );
        //add some todo examples to shows them in the first loading page
        todoList.push(
            new Todo(
                'be happy', 
                'the most important job ever', 
                '2226-12-31', 
                'top', 
                false, 
                'live'
            ),
            new Todo(
                'eat', 
                'body is a temple', 
                '2226-12-31', 
                'medium'
            ),
            new Todo(
                'learn object', 
                'object is the basic concept in JS', 
                '2025-12-31', 
                'medium', 
                true, 
                "learn JS")
        )
    }
}

// function handleAddProjectBtn(addProjectValueFromInput) {
//     if (addProjectValueFromInput) {
//         const success = addProject(addProjectValueFromInput);
//         if (!success) alert('This project already exist!');
//         renderProjectsInSidebar();
//         renderMainContent();             
//     }
// }


function handleSidebarProjectBtn(appState) {
    renderMainContent();
    if (appState.ifMainContentIsExpand) {
        foldAllTodoItems();
        appState.ifMainContentIsExpand = false;
    } else {
        return;
    } 
}

function handleSidebarTodoBtn(appState) {
    renderMainContent();
    appState.ifMainContentIsExpand = true;
}

function handleSidebarCalendarBtn() {
    renderCalendarPage();
}

function bindAddProjectBtn(addProjectBtn, handler) {
    addProjectBtn.addEventListener('click', handler)
}

function handleAddProjectBtn(newProjectInput) {
    if (newProjectInput) {
        const success = addProject(newProjectInput);
        if (!success) alert('This project already exist!');
        renderProjectsInSidebar();
        renderMainContent();             
    }
}

function onAddProject(newProjectName) {
    if (!newProjectName) return;

    const success = addProject(newProjectName);
    if(!success) alert('This projcet already exist!');

    renderProjectsInSidebar();
    renderMainContent();
}

function handleTodoCheckboxClick(todoObject, newIsdone) {
    todoObject.isDone = newIsdone;
}

function handleTodoInputChanged(todoObject, newTitle) {
    todoObject.title = newTitle;
}

function handleTodoDuedateChanged(todoObject, newDuedateValue) {
    const theNewDuedate = new Date(newDuedateValue);
    todoObject.dueDate = theNewDuedate;
}

function handleTodoPriorityChanged(todoObject, newPriority) {
    todoObject.priority = newPriority;
}

function handleTodoProjectChanged(todoObject, newProject) {
    todoObject.project = newProject;
}

function handleTodoDescriptionChanged(todoObject, newDescription) {
    todoObject.description = newDescription;
}

const todoHandlers = {
    onCheckboxToggle: handleTodoCheckboxClick,
    onTitleChange: handleTodoInputChanged,
    onDuedateChange: handleTodoDuedateChanged,
    onPriorityChange: handleTodoPriorityChanged,
    onProjectChange: handleTodoProjectChanged,
    onDescriptionChange: handleTodoDescriptionChanged
}

//Main Function:
function loadPage() {
    //initialize:
    bootstrapApp();
    //todo input dialog:
    showProjectListAfterSelect();
    bindTodoDialogClose(handleTodoSubmit);
    //main content:
    renderMainContent(todoHandlers);
    //sidebar:
    renderProjectsInSidebar();
    buildAddProjectComponent(onAddProject);
    const appState = {ifMainContentIsExpand: true};//(!!improtant: should not use a variable like: 'let ifMainContentIsExpand = ture', since only the copy of varible will be changed inside a funcion. using object will be the reference, change the status directlly)
    bindSidebarProjectBtn(() => handleSidebarProjectBtn(appState)); 
    bindSidebarTodoBtn(() => handleSidebarTodoBtn(appState));
    bindSidebarCalendarBtn(handleSidebarCalendarBtn);
}


export {loadPage};
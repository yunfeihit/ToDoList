//!Important rules: controller.js can know the dom.js
import {Todo, todoList, addTodo, removeTodo} from "./todo.js";
import {projectList, addProject, removeProject, renameProject} from "./project.js";
import {saveData, loadData} from "./storage.js";
import {showProjectListAfterSelect, renderMainContent,  renderProjectsInSidebar,foldAllTodoItems, buildAddProjectComponent, renderCalendarPage, bindTodoDialogClose, bindSidebarProjectBtn, bindSidebarTodoBtn, bindSidebarCalendarBtn, popupWarningDialog, updateTodoItemColor} from "./dom.js";

//(return 'true' if todoMetaData.title is already exist)
function isTodoTitleDuplicate(todoMetaData) {
    return todoList.some(todo => todo.title === todoMetaData.title);
}

//(the handler 'handleTodoSubmit' still need some other handlers 'appHandlers' be passed as parameter)
function handleTodoSubmit(todoMetaData, appHandlers) {
    if (isTodoTitleDuplicate(todoMetaData)) {
        alert('This todo title already exist!');
        return false;//(if todoMetaData's title is duplicated, return false and donot execute following code)
    };
    addTodo(todoMetaData);
    saveData();
    renderMainContent(appHandlers);
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

function handleSidebarProjectBtn(appState) {
    if (appState.ifMainContentIsExpand) {
        foldAllTodoItems();
        appState.ifMainContentIsExpand = false;
    } else {
        return;
    } 
}

function handleSidebarTodoBtn(appState, appHandlers) {
    renderMainContent(appHandlers);
    appState.ifMainContentIsExpand = true;
}

function handleSidebarCalendarBtn() {
    renderCalendarPage();
}

function handleAddProjectBtn(newProjectName, appHandlers) {
    if (!newProjectName) return;

    const success = addProject(newProjectName);
    if(!success) alert('This projcet already exist!');

    renderProjectsInSidebar(appHandlers);
    renderMainContent(appHandlers);

    saveData();
}

function handleTodoCheckboxClick(todoObject, newIsdone) {
    todoObject.isDone = newIsdone;
    updateTodoItemColor();
    saveData();
}

function handleTodoInputChanged(todoObject, newTitle) {
    todoObject.title = newTitle;
    saveData();
}

function handleTodoDuedateChanged(todoObject, newDuedateValue) {
    const theNewDuedate = new Date(newDuedateValue);
    todoObject.dueDate = theNewDuedate;
    saveData();
}

function handleTodoPriorityChanged(todoObject, newPriority) {
    todoObject.priority = newPriority;
    saveData();
}

function handleTodoProjectChanged(todoObject, newProject, appHandlers) {
    todoObject.project = newProject;
    renderMainContent(appHandlers);
    saveData();
}

function handleTodoDescriptionChanged(todoObject, newDescription) {
    todoObject.description = newDescription;
    saveData();
}

function handleDeleteTodo(todoObject, appHandlers) {
    const removeTodoAction = () => {
        removeTodo(todoObject.id);
        renderMainContent(appHandlers);
        saveData();
    }
    popupWarningDialog(removeTodoAction);
}

function handleDeleteProject(project, appHandlers) {
    const removeProjectAction = () => {
        removeProject(project);
        renderProjectsInSidebar(appHandlers);
        renderMainContent(appHandlers);
    }
    popupWarningDialog(removeProjectAction);

    saveData();
}

function handleRenameProject(project, newProjectName, appHandlers) {
    if (newProjectName) {
        renameProject(project, newProjectName);
        renderProjectsInSidebar(appHandlers);
        renderMainContent(appHandlers);
        saveData();
    }  
}


const appHandlers = {
    onCheckboxToggle: handleTodoCheckboxClick,
    onTitleChange: handleTodoInputChanged,
    onDuedateChange: handleTodoDuedateChanged,
    onPriorityChange: handleTodoPriorityChanged,
    onProjectChange: handleTodoProjectChanged,
    onDescriptionChange: handleTodoDescriptionChanged,
    onClickDeleteTodoBtn: handleDeleteTodo,
    onclickDeleteProjectBtn: handleDeleteProject,
    onClickRenameProject: handleRenameProject
}

//Main Function:
function loadPage() {
    //initialize:
    bootstrapApp();
    //todo input dialog:
    showProjectListAfterSelect();
    bindTodoDialogClose(handleTodoSubmit, appHandlers);
    //main content:
    renderMainContent(appHandlers);
    //sidebar:
    renderProjectsInSidebar(appHandlers);
    buildAddProjectComponent(handleAddProjectBtn, appHandlers);
    const appState = {ifMainContentIsExpand: true};//(!!improtant: should not use a variable like: 'let ifMainContentIsExpand = ture', since only the copy of varible will be changed inside a funcion. using object will be the reference, change the status directlly)
    bindSidebarProjectBtn(() => handleSidebarProjectBtn(appState, appHandlers)); 
    bindSidebarTodoBtn(() => handleSidebarTodoBtn(appState, appHandlers));
    bindSidebarCalendarBtn(handleSidebarCalendarBtn);
}


export {loadPage};
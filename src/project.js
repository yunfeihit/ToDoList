import {todoList} from "./todo.js";

const projectList = [];

//add some project examples
const projectExample1 = "live";
const projectExample2 = "learn JS";
projectList.push(projectExample1, projectExample2);

//Export Function: add project
function addProject(newProject) {
    projectList.push(newProject);
}

//Export Function: delete project(need index)
function removeProject(projectName) {
    const theProjectIndex = projectList.indexOf(projectName);
    projectList.splice(theProjectIndex, 1);
}

//Export Function: rename project, also change the todo's belonging project name
function renameProject(projectName, newName) {
    const theProjectIndex = projectList.indexOf(projectName);
    projectList[theProjectIndex] = newName;

    //also change the todo's belonging project name
    todoList.forEach((todo) => {
        if(todo.project === projectName) {
            todo.project = newName;
        }
    })
    
}


export {projectList, addProject, removeProject, renameProject};
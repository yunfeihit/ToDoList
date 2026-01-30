import {todoList} from "./todo.js";

const projectList = [];

//add some project examples to show them in the first loading page
const projectExample1 = "live";
const projectExample2 = "learn JS";
projectList.push(projectExample1, projectExample2);

function addProject(newProject) {
    projectList.push(newProject);
}

function removeProject(projectName) {
    const theProjectIndex = projectList.indexOf(projectName);
    if (theProjectIndex === -1) return; //if cant find the name, do nothing
    projectList.splice(theProjectIndex, 1);
}

//(also change the todo's belonging project name)
function renameProject(projectName, newName) {
    const theProjectIndex = projectList.indexOf(projectName);
    projectList[theProjectIndex] = newName;

    todoList.forEach((todo) => {
        if(todo.project === projectName) {
            todo.project = newName;
        }
    })    
}


export {projectList, addProject, removeProject, renameProject};
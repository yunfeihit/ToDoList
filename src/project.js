import {todoList} from "./todo.js";

const projectList = [];

function addProject(newProject) {
    if (projectList.includes(newProject)) {
        console.warn("Project already exists!");
        return false;
    } else {
        projectList.push(newProject);
        return true;
    }
}

function removeProject(projectName) {
    const theProjectIndex = projectList.indexOf(projectName);
    if (theProjectIndex === -1) {
        console.warn('There is no such project!')
        return false; //if cant find the name, do nothing
    }
    projectList.splice(theProjectIndex, 1);
}

function renameProject(projectName, newName) {
    if (projectList.includes(newName)) return false;

    const theProjectIndex = projectList.indexOf(projectName);
    if (theProjectIndex === -1) {
        console.warn("There is no such project!");
        return false;
    } else {
        projectList[theProjectIndex] = newName;
        
        //(!also need to change the todo's belonging project name)
        todoList.forEach((todo) => {
            if(todo.project === projectName) {
                todo.project = newName;
            }
        });
        return true;  
    }
  
}


export {projectList, addProject, removeProject, renameProject};
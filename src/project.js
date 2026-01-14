const projectList = [];

//add some project examples
const projectExample1 = "live";
const projectExample2 = "learn JS";
projectList.push(projectExample1, projectExample2);

//Function: add project
function addProject(newProject) {
    projectList.push(newProject);
}

//Function: delete project(need index)
function removeProject(i) {
    projectList.splice(i, 1);
}



export {projectList, addProject, removeProject};
import {formatDistanceToNow} from "date-fns";

//class Todo
class Todo {
    constructor(title, description, dueDate, priority, isDone = false, project = null) {
        this.title = title;
        this.description = description;
        if (!dueDate) {
            this.dueDate = null
        } else {
            this.dueDate = dueDate instanceof Date ? dueDate : new Date(dueDate);
        }
        this.priority = priority;
        this.isDone = isDone;
        this.project = project;
    }
}

const todoList = [];

//add some todo examples and store them in the todoList
const todoExample1 = new Todo('be happy', 'the most important job ever', '2226-12-31', 'top', false, 'live');
const todoExample2 = new Todo('eat', 'body is a temple', '2226-12-31', 'medium');
const todoExample3 = new Todo('learn object', 'object is the basic concept in JS', '2025-12-31', 'medium', true, "learn JS");
todoList.push(todoExample1, todoExample2, todoExample3);

//Function: add todo
//'todoMetaData' should be an object collected from the DOM
function addTodo(todoMetaData) {
    const newTodo = new Todo(
        todoMetaData.title,
        todoMetaData.description,
        todoMetaData.date,  //duedate
        todoMetaData.priority,
        false, //for default parameter: 'isDone'
        todoMetaData.project
    );
    todoList.push(newTodo);
}


//Function: delete todo
function removeTodo(todoName) {
    const theIndex = todoList.findIndex(obj => obj.title === todoName);
    if (theIndex === -1) return;
    todoList.splice(theIndex, 1);
}


//is this necessary?
function assignTodoProject(todo, newProject) {
    todo.project = newProject;
}

function returnTodoCountDown (todoObject) {
    if (!todoObject.dueDate) {
        return "---- -- --";
    } else {
        return formatDistanceToNow(
            todoObject.dueDate, 
            {addSuffix: true}
        );
    }
}

export {Todo, todoList, addTodo, removeTodo, assignTodoProject, returnTodoCountDown};





















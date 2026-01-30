import {formatDistanceToNow} from "date-fns";

//class Todo
class Todo {
    constructor(
        title, 
        description, 
        dueDate, 
        priority, 
        isDone = false, 
        project = null
    ) {
        this.title = title;
        this.description = description;
        // validate dueDate: 
        // (1) must be 'Date' instance 
        // (2) null is null(not new Date(0))
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

//add some todo examples to shows them in the first loading page
const todoExample1 = new Todo(
    'be happy', 
    'the most important job ever', 
    '2226-12-31', 
    'top', 
    false, 
    'live'
);
const todoExample2 = new Todo(
    'eat', 
    'body is a temple', 
    '2226-12-31', 
    'medium'
);
const todoExample3 = new Todo(
    'learn object', 
    'object is the basic concept in JS', 
    '2025-12-31', 
    'medium', 
    true, 
    "learn JS");
todoList.push(
    todoExample1, 
    todoExample2, 
    todoExample3
);

//'todoMetaData' is an object collected from the dialog DOM(it doesnt has a 'isDone' argument to pass, since the logic that you cannot create a todo that already done)
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

function removeTodo(todoName) {
    const theIndex = todoList.findIndex(obj => obj.title === todoName);
    if (theIndex === -1) return;//if cant find the name, do nothing
    todoList.splice(theIndex, 1);
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

export {
    Todo, 
    todoList, 
    addTodo, 
    removeTodo, 
    returnTodoCountDown
};





















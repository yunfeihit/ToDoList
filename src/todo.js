import {formatDistanceToNow} from "date-fns";

//class Todo
class Todo {
    constructor(
        title, 
        description, 
        dueDate, 
        priority, 
        isDone = false, 
        project = null,
        id = crypto.randomUUID()
    ) {
        this.title = title;
        this.description = description;
        // validate dueDate: 
        // (1) must be 'Date' instance. if not, turn it
        // (2) null is null(not new Date(0))
        if (!dueDate) {
            this.dueDate = null
        } else {
            this.dueDate = dueDate instanceof Date ? dueDate : new Date(dueDate);
        }
        this.priority = priority;
        this.isDone = isDone;
        this.project = project;
        this.id = id;
    }
}

const todoList = [];

//'todoMetaData' is an object collected from the dialog DOM(it doesnt has a 'isDone' argument to pass, since the logic that you cannot create a todo that already done)
function addTodo(todoMetaData) {
    if (todoList.some(todo => todo.title === todoMetaData.title)) {
        console.warn('Todo title is already exist!')
        return false;
    } else {
        const newTodo = new Todo(
            todoMetaData.title,
            todoMetaData.description,
            todoMetaData.date,  //duedate
            todoMetaData.priority,
            false, //for default parameter: 'isDone'
            todoMetaData.project
        );
        todoList.push(newTodo);
        return true;
    }
    
}

function removeTodo(todoId) {
    const theIndex = todoList.findIndex(obj => obj.id === todoId);
    if (theIndex === -1) return;//if cant find the name, do nothing
    todoList.splice(theIndex, 1);
}

function returnTodoCountDown (todoObject) {
    if (!todoObject.dueDate) {
        return "---- -- --";//if todo's duedate is not set, the countdown is meaningless, return fixed characters
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
    returnTodoCountDown,
};





















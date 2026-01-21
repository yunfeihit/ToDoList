//class Todo
class Todo {
    constructor(title, description, dueDate, priority, isDone = false, project = null) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.isDone = isDone;
        this.project = project;
    }
}

const todoList = [];

//add some todo examples and store them in the todoList
const todoExample1 = new Todo('be happy', 'the most important job ever', '9999-12-31', 'top', false, 'live');
const todoExample2 = new Todo('eat', 'body is a temple', '9999-12-31', 'medium');
todoList.push(todoExample1, todoExample2);

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

//Function: delete todo(need index)
function removeTodo(i) {
    const todoListLength = todoList.length;
    if (0 <= i && i < todoListLength) {
        todoList.splice(i, 1);
    }
};

//is this necessary?
function assignTodoProject(todo, newProject) {
    todo.project = newProject;
}

export {Todo, todoList, addTodo, removeTodo, assignTodoProject};





















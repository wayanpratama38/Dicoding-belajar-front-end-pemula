const todos = [];
const RENDER_EVENT = "render-todo";
const SAVED_EVENT = 'data-saved';
const STORAGE_KEY = 'TODOS_APPS';


function generateID(){
    return +new Date();
    
};

function generateToDoObject(id,title,date,isCompleted){
    return {
        id,
        title,
        date,
        isCompleted,
    };
};

function addTodo(){
    const inputTitle = document.getElementById("title").value;
    const inputDate = document.getElementById("date").value;

    const generatedID = generateID();
    const todoObject = generateToDoObject(generatedID,inputTitle,inputDate,false);
    todos.push(todoObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    document.addEventListener(RENDER_EVENT,function(){
        const uncompletedTODOList = document.getElementById("todos");
        uncompletedTODOList.innerHTML = "";    


        const completedTODOList = document.getElementById("completed-todos")
        completedTODOList.innerHTML = "";
        
        for(const todoItem of todos){
            const todoElement = makeToDo(todoItem);
            if(!todoItem.isCompleted){
                uncompletedTODOList.append(todoElement);
            }else{
                completedTODOList.append(todoElement);
            }
        }
    });
    saveData();
};


// Finding To Do ID
function findToDoId(todoId){
    for(const todo of todos){
        if(todo.id === todoId){
            return todo;
        }
    }
    return null;
}

// Finding To Do Id Index
function findToDoIndex(todoId){
    for(const index of todos){
        if(index.id === todoId){
            console.log(todos.indexOf(index));
            return todos.indexOf(index);
        }
    }

    return -1;
}


// Adding Task To Completed
function addTaskToCompleted(todoId){
    const todoTarget = findToDoId(todoId);

    if(todoTarget == null) return;

    todoTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();

}

// Removing Task From Completed
function removeTaskFromCompleted(todoId){
    const todoTarget = findToDoIndex(todoId);

    if(todoTarget == -1) return;

    todos.slice(todoTarget,1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();

}

// Undo Task From Completed
function undoTaskFromCompleted(todoId){
    const todoTarget = findToDoId(todoId);

    if(todoTarget == null) return;

    todoTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

// Creating To Do List
function makeToDo(todoObject){
    const textTitle = document.createElement("h2");
    textTitle.innerText = todoObject.title;

    const textDate = document.createElement("p");
    textDate.innerText = todoObject.date;

    const textContainer = document.createElement("div");
    textContainer.classList.add("inner");
    textContainer.append(textTitle,textDate);

    const container = document.createElement("div");
    container.classList.add('item',"shadow");
    container.append(textContainer);
    container.setAttribute('id',`todo-${todoObject.id}`);

    if(todoObject.isCompleted){
        const undoButton = document.createElement("button");
        undoButton.classList.add("undo-button");

        undoButton.addEventListener("click",function(){
            undoTaskFromCompleted(todoObject.id);
        });

        const trashButton = document.createElement("button");
        trashButton.classList.add("trash-button");

        trashButton.addEventListener('click',function(){
            removeTaskFromCompleted(todoObject.id);
        });

        container.append(undoButton,trashButton);
    }else{
        const checkButton = document.createElement("button");
        checkButton.classList.add("check-button");

        checkButton.addEventListener("click",function(){
            addTaskToCompleted(todoObject.id);
        });

        container.append(checkButton);
    }
    return container;
}

// Saving Data into Local Storage
function saveData(){
    if(isStorageExist()){
        const parsed = JSON.stringify(todos);
        localStorage.setItem(STORAGE_KEY,parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

// Checking Storage Existence 
function isStorageExist(){
    if(typeof (Storage)!=='undefined'){
        return true;
    }else{
        alert("Browser doesn't support local storage");
        return false;
    }
}

function loadFromStrorage(){
    const serializedData = localStorage.getItem(STORAGE_KEY);
    const data = JSON.parse(serializedData);

    if(data!=null){
        for(const todoItem of data){
            todos.push(todoItem);
        }
    }


    document.dispatchEvent(new Event(RENDER_EVENT));
}
document.addEventListener("DOMContentLoaded", function(){
    const submitForm = document.getElementById("form");
    submitForm.addEventListener("submit",function(event){
        event.preventDefault();
        addTodo();
    });

    if(isStorageExist()){
        loadFromStrorage();
    }
});

console.log("Hello World");

console.log(todos);
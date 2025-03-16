// Initialize book, event and storage key
const book = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book"
const STORAGE_KEY = "BOOKSHELF_APPS";

// Initialize edit mode and current edit book id
let isEditMode = false;
let currentEditBookID = null;

// Generate Book ID
function generateBookID(){
    return +new Date();
};

// Generate book object
function generateBookObject(id,title,author,year,isComplete){
    return{
        id,
        title,
        author,
        year: parseInt(year),
        isComplete
    };
};

// Add book to book list
function addBook(){
    const title= document.getElementById("bookFormTitle").value;
    const author = document.getElementById("bookFormAuthor").value;
    const year = document.getElementById("bookFormYear").value;
    const isBookCompleted = document.getElementById("bookFormIsComplete").checked;

    if(isEditMode){
        const bookIndex = findBookIndex(currentEditBookID);
        if (bookIndex !== -1) {
            book[bookIndex].title = title;
            book[bookIndex].author = author;
            book[bookIndex].year = year;
            book[bookIndex].isComplete = isBookCompleted;
        }
        isEditMode = false;
        currentEditBookID = null;
    }else{
        const generatedBookID = generateBookID();
        const bookObject = generateBookObject(generatedBookID,title,author,year,isBookCompleted);
        book.push(bookObject);
    
    }
    
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};

// Create Book Element
function makeBook(bookObject){
    const bookContainer = document.createElement("div");
    bookContainer.classList.add("bookList");

    const bookItem = document.createElement("div");
    bookItem.setAttribute("data-bookid",bookObject.id);
    bookItem.setAttribute("data-testid","bookItem");

    const title = document.createElement("h3");
    title.setAttribute("data-testid","bookItemTitle");
    title.innerText = bookObject.title;

    const author = document.createElement("p");
    author.setAttribute("data-testid","bookItemAuthor");
    author.innerText = `Penulis: ${bookObject.author}`;

    const year = document.createElement("p");
    year.setAttribute("data-testid","bookItemYear");
    year.innerText = `Tahun: ${bookObject.year}`;

    const actionWrapper = document.createElement("div");
    actionWrapper.classList.add("actionWraper");

    const isCompleteButton = document.createElement("button");
    isCompleteButton.setAttribute("data-testid","bookItemIsCompleteButton");

    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.setAttribute("data-testid","bookItemDeleteButton");
    deleteButton.setAttribute("id","deleteButton");
    deleteButton.addEventListener("click",function(event){
        event.preventDefault();
        deleteBook(bookObject.id);
    });

    const editButton = document.createElement("button");
    editButton.innerText = "Edit";
    editButton.setAttribute("data-testid","bookItemEditButton");
    editButton.setAttribute("id","editButton");
    editButton.addEventListener("click",function(event){
        event.preventDefault();
        editBook(bookObject.id);
    });

    if(bookObject.isComplete){
        isCompleteButton.innerText = "Undo";
        isCompleteButton.setAttribute("id","undoButton");

        isCompleteButton.addEventListener("click",function(){
            undoCompletedBook(bookObject.id);
        });
        actionWrapper.append(isCompleteButton,deleteButton,editButton);
    }else{
        isCompleteButton.innerText = "Finish";
        isCompleteButton.setAttribute("id","completeButton");

        isCompleteButton.addEventListener("click",function(){
            addToCompletedBook(bookObject.id);
        });
        actionWrapper.append(isCompleteButton,deleteButton,editButton);
    }

    bookItem.append(title,author,year,actionWrapper);
    bookContainer.append(bookItem);
    
    resetForm();
    return bookContainer;
}

// Add book to complete list
function addToCompletedBook(bookID){
    const bookTarget = findBookID(bookID);
    if(bookTarget == null) return;

    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

// Remove book from complete list
function undoCompletedBook(bookID){
    const bookTarget = findBookID(bookID);
    if(bookTarget == null) return;

    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

// Delete book from any list
function deleteBook(bookID){
    const bookIndex = findBookIndex(bookID);
    if(bookIndex == -1) return;

    book.splice(bookIndex,1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

// Enable edit book from any list
function editBook(bookID){
    const bookIndex = findBookIndex(bookID);
    if(bookIndex == -1) return;

    isEditMode = true;
    currentEditBookID = bookID;

    document.getElementById("formTitle").innerText = "Edit Book";    
    const editButton = document.getElementById("bookFormSubmit").innerText = "Save Edit";

    const title = document.getElementById("bookFormTitle");
    const author = document.getElementById("bookFormAuthor");
    const year = document.getElementById("bookFormYear");
    const isComplete = document.getElementById("bookFormIsComplete");

    title.value = book[bookIndex].title;
    author.value = book[bookIndex].author;
    year.value = book[bookIndex].year;
    isComplete.checked = book[bookIndex].isComplete;
}


// Reset form
function resetForm() {
    document.getElementById("formTitle").innerText = "Add New Book";
    let title = document.getElementById("bookFormTitle");
    let author = document.getElementById("bookFormAuthor");
    let year = document.getElementById("bookFormYear");
    let isComplete = document.getElementById("bookFormIsComplete");
    let submitButton = document.getElementById("bookFormSubmit");

    // Reset input 
    title.value = "";
    author.value = "";
    year.value = "";
    isComplete.checked = false;

    // Change submit button text
    submitButton.innerText = "Add Book";
}

// Find Book using Book ID Attribute
function findBookID(bookID){
    for(const bookItem of book){
        if(bookItem.id === bookID){
            return bookItem;
        }
    }
    return null;
}

// Find Book index using book id
function findBookIndex(bookId){
    for(const index of book){
        if(index.id === bookId){
            return book.indexOf(index);
        }
    }
    return -1;
}

// Search book by title from all list
function searchBook(title){
    const searchResult = [];
    for(const bookItem of book){
        if(bookItem.title.toLowerCase().includes(title.toLowerCase())){
            console.log(bookItem);
            searchResult.push(bookItem);
        }
    }
    return searchResult;
}

// Show search Book
function showSearchBook(searchResult){
    const unfinishedBookList = document.getElementById("incompleteBookList");
    const finishedBookList = document.getElementById("completeBookList");

    unfinishedBookList.innerHTML = "";
    finishedBookList.innerHTML = "";

    for(const bookItem of searchResult){
        const bookElement = makeBook(bookItem);
        if(bookItem.isComplete){
            finishedBookList.appendChild(bookElement);
        }else{
            unfinishedBookList.appendChild(bookElement);
        }
    }
}

// Save data to local storage
function saveData(){
    if(isStorageExist()){
        const parsed = JSON.stringify(book);
        localStorage.setItem(STORAGE_KEY,parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

// Load data from local storage
function loadFromStorage(){
    const serializedData = localStorage.getItem(STORAGE_KEY);
    const data = JSON.parse(serializedData);

    if(data !== null){
        for(const bookItem of data){
            book.push(bookItem);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}

// Check if storage exist
function isStorageExist(){
    if(typeof (Storage) === "undefined"){
        alert("Browser didn't support local storage");
        return false;
    }else{
        return true;
    }
}

// Custom event listener
document.addEventListener(RENDER_EVENT,function(){
    const unfinishedBookList = document.getElementById("incompleteBookList");
    unfinishedBookList.innerHTML = "";

    const finishedBookList = document.getElementById("completeBookList");
    finishedBookList.innerHTML = "";

    for(const bookItem of book){
        const bookElement = makeBook(bookItem);
        if(bookItem.isComplete){
            finishedBookList.append(bookElement);
        }else{
            unfinishedBookList.append(bookElement);
        }
    }
 });

 // DOM Content Loaded
document.addEventListener("DOMContentLoaded", function(){
    const submitForm = document.getElementById("bookForm");
    const searchButton = document.getElementById("searchSubmit");
    
    // Check if storage exist and load data from local storage
    if(isStorageExist()){
        loadFromStorage();
    }

    // Add book event listener when form submitted
    submitForm.addEventListener("submit",function(event){
        event.preventDefault();
        addBook();
    });

    // Search book event listener when search button clicked
    searchButton.addEventListener("click",function(event){
        event.preventDefault();
        const searchBookTitle = document.getElementById("searchBookTitle").value;

        if (searchBookTitle !== "") {
            const result = searchBook(searchBookTitle);
            showSearchBook(result);
        } else {
            document.dispatchEvent(new Event(RENDER_EVENT));
        }
    });
});
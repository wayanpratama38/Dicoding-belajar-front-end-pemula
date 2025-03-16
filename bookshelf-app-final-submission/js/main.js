// Do your work here...
console.log('Hello, world!');

const book = [];
const RENDER_EVENT = 'render-book';

// Generate Book ID
function generateBookID(){
    return +new Date();
    
};

// Generate book object
function generateBookObject(id,bookTitle,bookAuthor,bookYear,isCompleted){
    return{
        id,
        bookTitle,
        bookAuthor,
        bookYear,
        isCompleted
    };
};



function addBook(){
    const bookTitle= document.getElementById("bookFormTitle").value;
    const bookAuthor = document.getElementById("bookFormAuthor").value;
    const bookYear = document.getElementById("bookFormYear").value;
    const isBookCompleted = document.getElementById("bookFormIsComplete").checked;
    const generatedBookID = generateBookID();
    console.log(isBookCompleted);

    const bookObject = generateBookObject(generatedBookID,bookTitle,bookAuthor,bookYear,isBookCompleted);
    book.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    document.addEventListener(RENDER_EVENT,function(){
       const unfinishedBookList = document.getElementById("incompleteBookList");
       unfinishedBookList.innerHTML = "";

       const finishedBookList = document.getElementById("completeBookList");
       finishedBookList.innerHTML = "";

       for(const bookItem of book){
            const bookElement = makeBook(bookItem);
            if(bookItem.isCompleted){
                finishedBookList.append(bookElement);
            }else{
                unfinishedBookList.append(bookElement);
            }
       }
    });
}

// Create Book Element
function makeBook(bookObject){
    const bookContainer = document.createElement("div");
    bookContainer.classList.add("bookList");

    const bookItem = document.createElement("div");
    bookItem.setAttribute("data-bookid",bookObject.id);
    bookItem.setAttribute("data-testid","bookItem");

    const bookTitle = document.createElement("h3");
    bookTitle.setAttribute("data-testid","bookItemTitle");
    bookTitle.innerText = bookObject.bookTitle;

    const bookAuthor = document.createElement("p");
    bookAuthor.setAttribute("data-testid","bookItemAuthor");
    bookAuthor.innerText = `Penulis: ${bookObject.bookAuthor}`;

    const bookYear = document.createElement("p");
    bookYear.setAttribute("data-testid","bookItemYear");
    bookYear.innerText = `Tahun: ${bookObject.bookYear}`;

    const actionWrapper = document.createElement("div");
    actionWrapper.classList.add("actionWraper");

    const isCompleteButton = document.createElement("button");
    isCompleteButton.setAttribute("data-testid","bookItemIsCompleteButton");

    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete Book";
    deleteButton.setAttribute("data-testid","bookItemDeleteButton");
    deleteButton.addEventListener("click",function(){
        deleteBook(bookObject.id);
    });

    const editButton = document.createElement("button");
    editButton.innerText = "Edit Book";
    editButton.setAttribute("data-testid","bookItemEditButton");

    if(bookObject.isCompleted){
        isCompleteButton.innerText = "Undo Book";
        isCompleteButton.addEventListener("click",function(){
            undoCompletedBook(bookObject.id);
        });
        actionWrapper.append(isCompleteButton,deleteButton,editButton);
    }else{
        isCompleteButton.innerText = "Finish Book";
        isCompleteButton.addEventListener("click",function(){
            addToCompletedBook(bookObject.id);
        });
        actionWrapper.append(isCompleteButton,deleteButton,editButton);
    }

    bookItem.append(bookTitle,bookAuthor,bookYear,actionWrapper);
    bookContainer.append(bookItem);

    return bookContainer;
}

// Function to add book to complete list
function addToCompletedBook(bookID){
    const bookTarget = findBookID(bookID);
    if(bookTarget == null) return;

    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
}

// Function to remove book from complete list
function undoCompletedBook(bookID){
    const bookTarget = findBookID(bookID);
    if(bookTarget == null) return;

    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
}

// Function to delete book from any list
function deleteBook(bookID){
    const bookIndex = findBookIndex(bookID);
    if(bookIndex == -1) return;

    book.splice(bookIndex,1);
    document.dispatchEvent(new Event(RENDER_EVENT));
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


// Search Book by title from all list
function searchBook(bookTitle){
    const searchResult = [];
    for(const bookItem of book){
        if(bookItem.bookTitle.toLowerCase().includes(bookTitle.toLowerCase())){
            console.log(bookItem);
            searchResult.push(bookItem);
        }
    }
    return searchResult;
}

// Show Search Book
function showSearchBook(searchResult){
    const unfinishedBookList = document.getElementById("incompleteBookList");
    const finishedBookList = document.getElementById("completeBookList");

    unfinishedBookList.innerHTML = "";
    finishedBookList.innerHTML = "";

    for(const bookItem of searchResult){
        const bookElement = makeBook(bookItem);
        if(bookItem.isCompleted){
            finishedBookList.appendChild(bookElement);
        }else{
            unfinishedBookList.appendChild(bookElement);
        }
    }
}

document.addEventListener("DOMContentLoaded", function(){
    const submitForm = document.getElementById("bookForm");
    const searchButton = document.getElementById("searchSubmit");
    
    submitForm.addEventListener("submit",function(event){
        event.preventDefault();
        addBook();
    });

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

    // if(isStorageExist()){
    //     loadFromStrorage();
    // }
});
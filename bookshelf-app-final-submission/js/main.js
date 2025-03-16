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
    const isBookCompleted = document.getElementById("bookFormIsComplete").value;
    const generatedBookID = generateBookID();

    const bookObject = generateBookObject(generatedBookID,bookTitle,bookAuthor,bookYear,isBookCompleted);
    book.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    document.addEventListener(RENDER_EVENT,function(){
       console.log("render event"); 
       console.log(book);
    });
}


function makeBook(bookObject){

}













// 

document.addEventListener("DOMContentLoaded", function(){
    const submitForm = document.getElementById("bookForm");
    submitForm.addEventListener("submit",function(event){
        event.preventDefault();
        addBook();
    });

    // if(isStorageExist()){
    //     loadFromStrorage();
    // }
});
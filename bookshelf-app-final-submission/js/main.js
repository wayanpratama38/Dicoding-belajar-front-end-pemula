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


{/* <div class="bookList">
    <div data-bookid="456456456" data-testid="bookItem">
        <h3 data-testid="bookItemTitle">Judul Buku 2</h3>
        <p data-testid="bookItemAuthor">Penulis: Penulis Buku 2</p>
        <p data-testid="bookItemYear">Tahun: 2030</p>
        <div class="actionWraper">
            <button data-testid="bookItemIsCompleteButton">Selesai dibaca</button>
            <button data-testid="bookItemDeleteButton">Hapus Buku</button>
            <button data-testid="bookItemEditButton">Edit Buku</button>
        </div>
    </div>
</div> */}

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
    isCompleteButton.innerText = "Selesai dibaca";
    isCompleteButton.setAttribute("data-testid","bookItemIsCompleteButton");

    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Hapus Buku";
    deleteButton.setAttribute("data-testid","bookItemDeleteButton");

    const editButton = document.createElement("button");
    editButton.innerText = "Edit Buku";
    editButton.setAttribute("data-testid","bookItemEditButton");

    if(bookObject.isCompleted){
        actionWrapper.append(deleteButton,editButton);
    }else{
        actionWrapper.append(isCompleteButton,deleteButton,editButton);
    }
    bookItem.append(bookTitle,bookAuthor,bookYear,actionWrapper);
    bookContainer.append(bookItem);

    return bookContainer;

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
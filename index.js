const ulEl = document.querySelector('#list-panel ul');
const showPanelEl = document.querySelector('#show-panel');
const URL = 'http://localhost:3000';
const BOOKS_URL = `${URL}/books`;
const USERS_URL = `${URL}/users`;

const handleError = (error) => {
  console.error(error);
  return Promise.reject(error);
};

const fetchBooks = () => fetch(BOOKS_URL)
  .then(resp => resp.json())
  .catch(handleError);

const renderBook = (book) => {
  const liEl = document.createElement('li');
  liEl.innerText = book.title;
  return liEl;
};

const renderBookList = (books) => {
  ulEl.innerHTML = '';
  books.forEach((book) => {
    ulEl.appendChild(renderBook(book));
  });
};

const showErrorMessage = (error) => {
  ulEl.innerHTML = `
    <pre>ERROR: Cannot fetch books.\n${error}</pre>`;
};

document.addEventListener('DOMContentLoaded', () => {
  fetchBooks()
    .then(renderBookList)
    .catch(showErrorMessage);
});

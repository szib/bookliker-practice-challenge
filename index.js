const ulEl = document.querySelector('#list');
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

const fetchBook = bookId => fetch(`${BOOKS_URL}/${bookId}`)
  .then(resp => resp.json())
  .catch(handleError);

const renderShowPanel = (book) => {
  showPanelEl.innerHTML = `
    <h2>${book.title}</h2>
    <img src="${book.img_url}">
    <p>${book.description}</p>
    <ul>
      ${book.users.map(user => `<li>${user.username}</li>`).join('')}
    </ul>
  `;
};

const renderBook = (book) => {
  const liEl = document.createElement('li');
  liEl.innerText = book.title;

  liEl.addEventListener('click', (event) => {
    fetchBook(book.id)
      .then(renderShowPanel);
  });

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

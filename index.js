const ulEl = document.querySelector('#list');
const showPanelEl = document.querySelector('#show-panel');
const URL = 'http://localhost:3000';
const BOOKS_URL = `${URL}/books`;
const USERS_URL = `${URL}/users`;
let currentUser;

function handleError(error) {
  console.error(error);
  return Promise.reject(error);
}

function setCurrentUser(user) {
  currentUser = user;
  return user;
}

function fetchUser(userId) {
  return fetch(`${USERS_URL}/${userId}`)
    .then(resp => resp.json())
    .catch(handleError);
}

const fetchBooks = () => fetch(BOOKS_URL)
  .then(resp => resp.json())
  .catch(handleError);

const fetchBook = bookId => fetch(`${BOOKS_URL}/${bookId}`)
  .then(resp => resp.json())
  .catch(handleError);

function toggleCurrentUserIn(users) {
  if (users.filter(user => user.id === currentUser.id).length === 0) {
    return [...users, currentUser];
  }
  return users.filter(user => user.id !== currentUser.id);
}

function patchUsers(book) {
  const config = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      users: toggleCurrentUserIn(book.users),
    }),
  };

  return fetch(`${BOOKS_URL}/${book.id}`, config)
    .then(resp => resp.json())
    .catch(handleError);
}

function renderShowPanel(book) {
  showPanelEl.innerHTML = `
    <h2>${book.title}</h2>
    <img src="${book.img_url}">
    <p>${book.description}</p>
    <ul>
      ${book.users.map(user => `<li>${user.username}</li>`).join('')}
    </ul>
  `;
  showPanelEl.appendChild(readButton(book));
}

function readButton(book) {
  const btn = document.createElement('button');
  btn.innerText = `Toggle Read (${currentUser.username})`;
  btn.addEventListener('click', (event) => {
    event.preventDefault();
    patchUsers(book)
      .then(renderShowPanel);
  });
  return btn;
}

const renderBook = (book) => {
  const liEl = document.createElement('li');
  liEl.innerText = book.title;

  liEl.addEventListener('click', () => {
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
  fetchUser(1)
    .then(setCurrentUser);
  fetchBooks()
    .then(renderBookList)
    .catch(showErrorMessage);
});

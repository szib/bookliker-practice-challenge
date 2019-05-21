const ulEl = document.querySelector('#list');
const showPanelEl = document.querySelector('#show-panel');
const URL = 'http://localhost:3000';
const BOOKS_URL = `${URL}/books`;
const USERS_URL = `${URL}/users`;
let currentUser;

const api = (url, options = {}) => fetch(url, options)
  .then((response) => {
    if (response.ok) {
      return response.json();
    }
    return Promise.reject(response.json());
  });

function toggleCurrentUserIn(users) {
  if (users.filter(user => user.id === currentUser.id).length === 0) {
    return [...users, currentUser];
  }
  return users.filter(user => user.id !== currentUser.id);
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

    const options = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        users: toggleCurrentUserIn(book.users),
      }),
    };

    api(`${BOOKS_URL}/${book.id}`, options)
      .then(renderShowPanel);
  });
  return btn;
}

const renderBook = (book) => {
  const liEl = document.createElement('li');
  liEl.innerText = book.title;

  liEl.addEventListener('click', () => {
    api(`${BOOKS_URL}/${book.id}`)
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
  api(`${USERS_URL}/1`)
    .then((data) => { currentUser = data; });

  api(BOOKS_URL)
    .then(renderBookList)
    .catch(showErrorMessage);
});

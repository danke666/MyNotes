// Найти элементы на странице
const noteForm = document.getElementById('noteForm');
const notesList = document.getElementById('notesList');
const searchInput = document.getElementById('searchInput');
const categorySelect = document.getElementById('categorySelect');

// Функция для загрузки заметок из localStorage
function loadNotes() {
  const notes = JSON.parse(localStorage.getItem('notes')) || [];
  notes.forEach(note => addNoteToList(note));
}

// Функция для сохранения заметок в localStorage
function saveNotes() {
  const notes = Array.from(notesList.children).map(item => ({
    content: item.querySelector('.content').textContent,
    category: item.querySelector('.category').textContent,
    timestamp: item.querySelector('.timestamp').textContent,
  }));
  localStorage.setItem('notes', JSON.stringify(notes));
}

// Функция для добавления заметки в список
function addNoteToList({ content, category, timestamp }) {
  const noteItem = document.createElement('li');
  noteItem.classList.add('fade-in'); // Добавляем класс анимации появления

  // Текст заметки
  const noteContent = document.createElement('span');
  noteContent.textContent = content;
  noteContent.classList.add('content');

  // Категория заметки
  const noteCategory = document.createElement('span');
  noteCategory.textContent = ` [${category}]`;
  noteCategory.classList.add('category', 'text-secondary');

  // Время добавления
  const noteTimestamp = document.createElement('small');
  noteTimestamp.textContent = timestamp;
  noteTimestamp.classList.add('timestamp', 'text-muted', 'ms-2');

  // Кнопка редактирования
  const editButton = document.createElement('button');
  editButton.textContent = '✏️';
  editButton.classList.add('btn', 'btn-warning', 'btn-sm', 'ms-2');
  editButton.addEventListener('click', () => {
    const newContent = prompt('Измените текст заметки:', content);
    if (newContent) {
      noteContent.textContent = newContent;
      saveNotes();
    }
  });

  // Кнопка удаления
  const deleteButton = document.createElement('button');
  deleteButton.textContent = '❌';
  deleteButton.classList.add('btn', 'btn-danger', 'btn-sm', 'ms-2');
  deleteButton.addEventListener('click', () => {
    // Анимация исчезания перед удалением
    noteItem.classList.add('fade-out');
    noteItem.addEventListener('animationend', () => {
      noteItem.remove();
      saveNotes();
    });
  });

  // Сборка заметки
  noteItem.append(noteContent, noteCategory, noteTimestamp, editButton, deleteButton);
  notesList.appendChild(noteItem);
}

// Когда пользователь добавляет заметку
noteForm.addEventListener('submit', (event) => {
  event.preventDefault();

  // Получаем данные заметки
  const noteContent = document.getElementById('noteContent').value;
  const noteCategory = categorySelect.value;
  const timestamp = new Date().toLocaleString();

  if (noteContent) {
    const note = { content: noteContent, category: noteCategory, timestamp };
    addNoteToList(note);

    // Сохраняем заметки
    saveNotes();

    // Очищаем текстовое поле
    document.getElementById('noteContent').value = '';
  }
});

// Фильтрация заметок
searchInput.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase();
  Array.from(notesList.children).forEach(note => {
    const isVisible = note.textContent.toLowerCase().includes(query);
    note.style.display = isVisible ? '' : 'none';
  });
});

// Загрузка заметок при запуске
loadNotes();
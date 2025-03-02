import '/styles.css';

import '/src/app-bar.js';
import '/src/app-footer.js';
 
import '/src/note-form.js';
import '/src/notes-list.js';
import '/src/archived-notes-list.js';

const BASE_URL = 'https://notes-api.dicoding.dev/v2';

// Fungsi untuk menampilkan indikator loading
function showLoadingIndicator() {
  if (!document.getElementById('loading')) {
    document.body.insertAdjacentHTML('beforeend', '<div id="loading">Loading...</div>');
  }
}
function hideLoadingIndicator() {
  const loadingElement = document.getElementById('loading');
  if (loadingElement) loadingElement.remove();
}

// Fungsi untuk menampilkan alert error
function showError(message) {
  alert(`Error: ${message}`);
}

// Fetch daftar catatan dari API
async function fetchNotes() {
  showLoadingIndicator();
  try {
    const response = await fetch(`${BASE_URL}/notes`);
    if (!response.ok) throw new Error('Failed to fetch notes');
    const result = await response.json();
    
    // Membersihkan daftar sebelum menambahkan
    const noteList = document.getElementById('notes-list');
    const archivedNoteList = document.getElementById('archived-notes-list');
    noteList.innerHTML = '';
    archivedNoteList.innerHTML = '';
    
    // Menambahkan catatan ke daftar
    result.data.forEach(note => {
      const noteElement = createNoteElement(note);
      if (note.archived) {
        archivedNoteList.appendChild(noteElement);
      } else {
        noteList.appendChild(noteElement);
      }
    });
  } catch (error) {
    console.error('Error fetching notes:', error);
    showError(error.message);
  } finally {
    hideLoadingIndicator();
  }
}

// Fungsi untuk membuat elemen catatan
function createNoteElement(note) {
  const noteItem = document.createElement('div');
  noteItem.classList.add('note-item');
  noteItem.innerHTML = `
    <h3>${note.title}</h3>
    <p>${note.body}</p>
    <button onclick="toggleArchive('${note.id}', ${note.archived})">${note.archived ? 'Unarchive' : 'Archive'}</button>
    <button onclick="deleteNote('${note.id}')">Delete</button>
  `;
  return noteItem;
}

// Menambahkan catatan baru ke server
async function addNote(title, body) {
  showLoadingIndicator();
  try {
    const response = await fetch(`${BASE_URL}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, body }),
    });
    if (!response.ok) throw new Error('Failed to add note');
    fetchNotes();
  } catch (error) {
    console.error('Error adding note:', error);
    showError(error.message);
  } finally {
    hideLoadingIndicator();
  }
}

// Menghapus catatan dari server
async function deleteNote(id) {
  showLoadingIndicator();
  try {
    const response = await fetch(`${BASE_URL}/notes/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to delete note');
    fetchNotes();
  } catch (error) {
    console.error('Error deleting note:', error);
    showError(error.message);
  } finally {
    hideLoadingIndicator();
  }
}

// Event listener untuk form tambah catatan
document.querySelector("note-form").shadowRoot.getElementById("note-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const title = document.getElementById('title').value;
  const body = document.getElementById('body').value;
  if (title && body) {
    addNote(title, body);
    document.getElementById('title').value = '';
    document.getElementById('body').value = '';
  }
});

// Fetch data awal saat halaman dimuat
fetchNotes();
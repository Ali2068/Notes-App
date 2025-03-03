import './../styles.css';

import './app-bar.js';
import './app-footer.js';
 
import './note-form.js';
import './notes-list.js';
import './archived-notes-list.js';

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
    <button class="archive-btn">${note.archived ? 'Unarchive' : 'Archive'}</button>
    <button class="delete-btn">Delete</button>
  `;

  // Tambahkan event listener ke tombol archive
  noteItem.querySelector('.archive-btn').addEventListener('click', () => {
    toggleArchive(note.id, note.archived);
  });

  // Tambahkan event listener ke tombol delete
  noteItem.querySelector('.delete-btn').addEventListener('click', () => {
    deleteNote(note.id);
  });

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

// Fungsi untuk mengarsipkan atau membatalkan arsip catatan
async function toggleArchive(id, isArchived) {
  showLoadingIndicator();
  try {
    const endpoint = isArchived ? `${BASE_URL}/notes/${id}/unarchive` : `${BASE_URL}/notes/${id}/archive`;
    const response = await fetch(endpoint, {
      method: 'POST', // Dicoding API menggunakan POST untuk arsip/unarsip
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) throw new Error('Failed to toggle archive');

    fetchNotes(); // Refresh daftar catatan setelah perubahan
  } catch (error) {
    console.error('Error toggling archive:', error);
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

// Menangani event kustom dari note-form
document.addEventListener("note-added", (event) => {
  const { title, body } = event.detail;
  addNote(title, body);
});

// Fetch data awal saat halaman dimuat
fetchNotes();

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

// Fetch daftar catatan dari API
async function fetchNotes() {
  showLoadingIndicator();
  try {
    // Ambil catatan aktif
    const activeResponse = await fetch(`${BASE_URL}/notes`);
    if (!activeResponse.ok) throw new Error('Failed to fetch active notes');
    const activeResult = await activeResponse.json();

    // Ambil catatan yang diarsipkan
    const archivedResponse = await fetch(`${BASE_URL}/notes/archived`);
    if (!archivedResponse.ok) throw new Error('Failed to fetch archived notes');
    const archivedResult = await archivedResponse.json();

    // Pastikan elemen yang digunakan sesuai dengan ID dalam HTML
    const noteList = document.querySelector('notes-list');
    const archivedNoteList = document.querySelector('archived-notes-list');

    if (!noteList || !archivedNoteList) {
      throw new Error('Note list elements not found');
    }

    // Reset isi elemen, lalu tambahkan kembali judulnya
    noteList.innerHTML = `<h2>Active Notes</h2>`;
    archivedNoteList.innerHTML = `<h2>Archived Notes</h2>`;

    // Memasukkan catatan aktif
    activeResult.data.forEach(note => {
      const noteElement = createNoteElement(note);
      noteList.appendChild(noteElement);
    });

    // Memasukkan catatan arsip
    archivedResult.data.forEach(note => {
      const noteElement = createNoteElement(note);
      archivedNoteList.appendChild(noteElement);
    });

  } catch (error) {
    console.error('Error fetching notes:', error);
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

// Fungsi untuk menambahkan catatan baru
async function addNote(title, body) {
  showLoadingIndicator();
  try {
    const response = await fetch(`${BASE_URL}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, body }),
    });
    if (!response.ok) throw new Error('Failed to add note');
    fetchNotes(); // Perbarui daftar catatan setelah penambahan
  } catch (error) {
    console.error('Error adding note:', error);
    showError(error.message);
  } finally {
    hideLoadingIndicator();
  }
}

// Fungsi untuk menghapus catatan dari server
async function deleteNote(id) {
  showLoadingIndicator();
  try {
    const response = await fetch(`${BASE_URL}/notes/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to delete note');
    fetchNotes(); // Refresh daftar catatan setelah penghapusan
  } catch (error) {
    console.error('Error deleting note:', error);
    showError(error.message);
  } finally {
    hideLoadingIndicator();
  }
}

// Pastikan fungsi dapat diakses di seluruh aplikasi
window.addNote = addNote;
window.deleteNote = deleteNote;

// Menangani event kustom dari note-form
document.addEventListener("note-added", (event) => {
  const { title, body } = event.detail;
  addNote(title, body);
});

// Fetch data awal saat halaman dimuat
fetchNotes();

class NotesList extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
            <h2>Active Notes</h2>
            <div id="notes-list" class="notes-container"></div>`;
    }
}
customElements.define('notes-list', NotesList);

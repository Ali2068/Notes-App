class ArchivedNotesList extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <h2>Archived Notes</h2>
            <div id="archived-notes-list" class="notes-container"></div>`;
    }
}
customElements.define('archived-notes-list', ArchivedNotesList);
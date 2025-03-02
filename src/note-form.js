class NoteForm extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                form { display: flex; flex-direction: column; }
            </style>
            <form id="note-form">
                <input id="title" placeholder="Title" required>
                <textarea id="body" placeholder="Body" required></textarea>
                <button type="submit">Add Note</button>
            </form>`;
    }
}
customElements.define('note-form', NoteForm);
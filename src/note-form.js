class NoteForm extends HTMLElement {
    constructor() {
        super();

        // Template form
        this.innerHTML = `
            <style>
                form { display: flex; flex-direction: column; }
            </style>
            <form id="note-form">
                <input id="title" placeholder="Title" required>
                <textarea id="body" placeholder="Body" required></textarea>
                <button type="submit">Add Note</button>
            </form>
        `;

        // Event listener untuk menangani submit form
        this.querySelector("#note-form").addEventListener("submit", (event) => {
            event.preventDefault();
            const title = this.querySelector("#title").value;
            const body = this.querySelector("#body").value;

            if (title && body) {
                document.dispatchEvent(new CustomEvent("note-added", {
                    detail: { title, body }
                }));

                this.querySelector("#title").value = "";
                this.querySelector("#body").value = "";
            }
        });
    }
}

customElements.define('note-form', NoteForm);

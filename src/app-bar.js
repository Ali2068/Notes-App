class AppBar extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
            <style>
                .app-bar { 
                    font-size: 24px; 
                    padding: 10px; 
                    background: #333; 
                    color: white; 
                    text-align: center; 
                }
            </style>
            <header class="app-bar">My Notes</header>`;
    }
}
customElements.define('app-bar', AppBar);

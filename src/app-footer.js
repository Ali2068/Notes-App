class AppFooter extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                .footer { 
                    text-align: center; 
                    padding: 10px; 
                    background: #333; 
                    color: white; 
                }
            </style>
            <footer class="footer">&copy; 2025 Notes App by Ali Arrasyid</footer>`;
    }
}
customElements.define('app-footer', AppFooter);
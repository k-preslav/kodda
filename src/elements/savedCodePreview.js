class SavedCodePreview extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '../styles/saved.css';
    this.shadowRoot.appendChild(link);

    this.shadowRoot.innerHTML += `
      <div>
        <h1><slot name="title"></slot></h1>
        <p><slot name="description"></slot></p>
      </div>
    `;
  }
}

customElements.define('saved-code-preview', SavedCodePreview);

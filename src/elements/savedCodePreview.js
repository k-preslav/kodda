class SavedCodePreview extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '../styles/saved.css'; // Ensure this path is correct
    this.shadowRoot.appendChild(link);

    this.render();
  }

  render() {
    this.shadowRoot.innerHTML += `
      <div>
        <p id="title_p"><slot name="title"></slot></p>
        <p id="description_p"><slot name="description"></slot></p>
        <span slot="id" style="display:none;">${this.getAttribute('id')}</span>
      </div>
    `;
  }
}

customElements.define('saved-code-preview', SavedCodePreview);

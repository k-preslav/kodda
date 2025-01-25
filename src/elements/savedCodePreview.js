class SavedCodePreview extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const styleLink = document.createElement('link');
    styleLink.rel = 'stylesheet';
    styleLink.href = '../styles/saved.css';
    this.shadowRoot.appendChild(styleLink);

    const iconLink = document.createElement('link');
    iconLink.rel = 'stylesheet';
    iconLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css';
    this.shadowRoot.appendChild(iconLink);

    this.render();
  }

  render() {
    this.shadowRoot.innerHTML += `
      <div>
        <div id="titleSlot">
          <p id="title_p"><slot name="title"></slot></p>
          <button id="copyButton">
            <i class="fa-solid fa-copy"></i>
          </button>
        </div>
        <p id="description_p"><slot name="description"></slot></p>
        <span slot="id" style="display:none;">${this.getAttribute('id')}</span>
      </div>
    `;
  }
}

customElements.define('saved-code-preview', SavedCodePreview);

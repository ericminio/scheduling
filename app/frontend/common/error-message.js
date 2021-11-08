const errorMessageTemplate = document.createElement('template')
errorMessageTemplate.innerHTML = `
<style>
    #error-message {
        position: fixed;
        top: 0px;
        right: 0px;
        margin: 5px;
        padding: 10px;
        background-color: var(--background-error);
        color: var(--color-error);
        cursor: pointer;
        z-index: 42;
    }
</style>
<div id="error-message" class="hidden">
</div>
`;

class ErrorMessage extends HTMLElement {

    constructor() {
        super();
    }
    connectedCallback() {
        this.appendChild(errorMessageTemplate.content.cloneNode(true));
        this.querySelector('#error-message').addEventListener('click', ()=> { this.acknowledge(); } );
        eventBus.register(this, 'error');
        eventBus.register(this, 'acknowledge error')
    }
    update(error, event) {
        if (event == 'acknowledge error') {
            this.acknowledge();
        } else {
            this.querySelector('#error-message').classList.remove('hidden');
            this.querySelector('#error-message').innerHTML = error.message;
        }
    }
    acknowledge() {
        this.querySelector('#error-message').classList.add('hidden');
    }
};
customElements.define('yop-error-message', ErrorMessage);


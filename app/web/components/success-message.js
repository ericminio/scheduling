const successMessageTemplate = document.createElement('template')
successMessageTemplate.innerHTML = `
<style>
    #success-message {
        position: fixed;
        top: 0px;
        right: 0px;
        margin: 5px;
        padding: 10px;
        cursor: pointer;
        color: var(--color-success);
        background-color: var(--background-success);
        z-index: 42;
    }
</style>
<div id="success-message" class="hidden">
</div>
`;

class SuccessMessage extends HTMLElement {

    constructor() {
        super();
    }
    connectedCallback() {
        this.appendChild(successMessageTemplate.content.cloneNode(true));
        this.querySelector('#success-message').addEventListener('click', ()=> { this.acknowledge(); } );
        this.element = this.querySelector('#success-message');
        events.register(this, 'success');
    }
    update(value) {        
        this.opacity = 1.0;
        this.element.classList.remove('hidden');
        this.element.innerHTML = value.message;
        this.element.style.opacity = this.opacity;
        setTimeout(()=> { this.fade(); }, 1500);
    }
    fade() {
        this.opacity = 0.99 * this.opacity;
        this.element.style.opacity = this.opacity;
        if (this.opacity < 0.05) {
            this.acknowledge();
        }
        else {
            setTimeout(()=> { this.fade(); }, 7);
        }
    }
    acknowledge() {
        this.opacity = 0.01;
        this.querySelector('#success-message').classList.add('hidden');
    }
};
customElements.define('yop-success-message', SuccessMessage);


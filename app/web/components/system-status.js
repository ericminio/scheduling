const greenTemplate = document.createElement('template')
greenTemplate.innerHTML = `
    <style>
        .status-green {
            width: 100%;
            text-align: right;
            color: lightgreen;
            font-size: 0.75em;
        }
    </style>
    <div class="status-green">online</div>
`;
const redTemplate = document.createElement('template')
redTemplate.innerHTML = `
    <style>
        .status-red {
            width: 100%;
            text-align: right;
            color: red;
            font-size: 0.75em;
        }
    </style>
    <div class="status-red">offline</div>
`;

class SystemStatus extends HTMLElement {
    constructor() {
        super();
        this.greenContent = greenTemplate.content.cloneNode(true);
        this.redContent = redTemplate.content.cloneNode(true);
    }
    connectedCallback() {
        this.innerHTML = 'unknown';
        this.update();
    }
    update() {
        api.ping()
            .then(() => {
                this.innerHTML = ``;
                this.appendChild(this.greenContent);
            })
            .catch(() => {
                this.innerHTML = ``;
                this.appendChild(this.redContent);
            })
    }
};
customElements.define('system-status', SystemStatus);


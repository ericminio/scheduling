const greenTemplate = document.createElement('template')
greenTemplate.innerHTML = `
    <style>
        .status-green {
            color: var(--color-status-green);
            text-align: right;
            font-size: 0.75em;
            display: inline-block;
        }
    </style>
    <div class="status-green">online</div>
`;
const redTemplate = document.createElement('template')
redTemplate.innerHTML = `
    <style>
        .status-red {
            color: var(--color-status-red);
            text-align: right;
            font-size: 0.75em;
            display: inline-block;
        }
    </style>
    <div class="status-red">offline</div>
`;
const unknownTemplate = document.createElement('template')
unknownTemplate.innerHTML = `
    <style>
        .status-unknown {
            color: var(--color-status-unknown);
            text-align: right;
            font-size: 0.75em;
            display: inline-block;
        }
    </style>
    <div class="status-unknown">unknown</div>
`;

class SystemStatus extends HTMLElement {
    constructor() {
        super();
        this.greenContent = greenTemplate.content.cloneNode(true);
        this.redContent = redTemplate.content.cloneNode(true);
        this.unknownContent = unknownTemplate.content.cloneNode(true);
    }
    connectedCallback() {
        this.innerHTML = ``;
        this.appendChild(this.unknownContent);;
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


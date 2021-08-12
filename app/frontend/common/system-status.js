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
        this.refresh = parseInt(this.getAttribute("refresh") || (5 * 60 * 1000));
        this.greenContent = greenTemplate.innerHTML;
        this.redContent = redTemplate.innerHTML;
        this.unknownContent = unknownTemplate.innerHTML;
    }
    connectedCallback() {
        this.innerHTML = this.unknownContent;
        this.update();
    }
    update() {
        api.ping()
            .then(() => {
                this.innerHTML = this.greenContent;
            })
            .catch(() => {
                this.innerHTML = this.redContent;
            })
            .finally(()=> {
                this.again();
            });
    }
    again() {
        setTimeout(()=> { this.update(); }, this.refresh);
    }
};
customElements.define('system-status', SystemStatus);


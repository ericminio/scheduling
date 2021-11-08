const headerTemplate = document.createElement('template')

headerTemplate.innerHTML = `
    <style>
        .header {
            padding: var(--padding);
            text-align: center;
            background-color: var(--background-header);
            color: var(--color-header);
        }
        .header-table {
            width: 100%;
        }
        .header-table td {
            width: 30%;
        }
        .header-table .title {
            font-size: 1.75em;
        }
    </style>
    <div class="header">
        <table class="header-table">
            <tbody>
                <tr>
                    <td></td>
                    <td id="title" class="title">Scheduling</td>
                    <td style="text-align:right;">
                        <yop-logout></yop-logout>
                        <system-status></system-status>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
`

class Header extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.appendChild(headerTemplate.content.cloneNode(true))
        this.update();
        eventBus.register(this, 'configuration updated');
    }

    async update() {
        let configuration = await data.configuration();
        this.querySelector('#title').innerHTML = configuration.getTitle();
        
        let end = configuration.getOpeningHoursEnd();
        let start = configuration.getOpeningHoursStart();
        let root = document.documentElement;
        root.style.setProperty('--opening-hours-start', start);
        root.style.setProperty('--opening-hours-end', end);
    }
}
customElements.define('yop-header', Header)

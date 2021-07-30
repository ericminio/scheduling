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
        events.register(this, 'configuration updated');
    }

    async update() {
        let configuration = store.getObject('configuration');
        if (configuration === null || 
            configuration.title === undefined ||
            configuration['opening-hours'] === undefined) {
            configuration = await api.configuration();
            store.saveObject('configuration', configuration);            
        }
        this.querySelector('#title').innerHTML = configuration.title;
        
        let parts = configuration['opening-hours'].split('-');
        let end = parseInt(parts[1])
        let start = parseInt(parts[0])
        let root = document.documentElement;
        root.style.setProperty('--opening-hours-start', start);
        root.style.setProperty('--opening-hours-end', end);
    }
}
customElements.define('yop-header', Header)

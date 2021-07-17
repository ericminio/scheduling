const headerTemplate = document.createElement('template')

headerTemplate.innerHTML = `
    <style>
        .header {
            margin-bottom: var(--vertical-margin);
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
                    <td class="title">Scheduling</td>
                    <td>
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
    }
}
customElements.define('yop-header', Header)

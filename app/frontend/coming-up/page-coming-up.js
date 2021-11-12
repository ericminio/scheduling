const comingUpTemplate = document.createElement('template')
comingUpTemplate.innerHTML = `

<style>
    .coming-up-table {
        width: 100%;    
        border-spacing: 0px;    
    }
    .coming-up-table td {
        padding: 0px;
        vertical-align: top;
    }
    .coming-up-table ol {
        padding: 0px;
        margin-top: var(--vertical-margin);
        margin-bottom: var(--vertical-margin);
        margin-left: 0px;
        margin-right: 0px;
    }
    .column-one {
        width: var(--resourceAreaWidth);
    }
    .column-two, .column-three {
        width: calc(var(--agendaAreaWidth) / 2);
    }
    .column-two-three-together {
        width: var(--agendaAreaWidth);
    }

    .calendar-table .vertical-form {
        margin-top: 0px;
    }
</style>

<yop-menu></yop-menu>

<div style="position: relative;">
    <table class="coming-up-table">
        <tbody>
            <tr>
                <td class="column-one"></td>
                <td class="column-two-three-together" colspan="2">
                    <yop-day-selection></yop-day-selection>
                </td>
            </tr>
            <tr>
                <td class="column-one"></td>
                <td class="column-two-three-together" colspan="2">
                    <ol id="day-2015-09-21">
                        <li>2015-09-21 Birthday</li>
                    </ol>
                </td>
            </tr>
        </tbody>
    </table>
</div>
`;

class PageComingUp extends HTMLElement {

    constructor() {
        super();
    }
    async connectedCallback() {
        this.appendChild(comingUpTemplate.content.cloneNode(true))
    }
};
customElements.define('page-coming-up', PageComingUp);


const comingUpTemplate = document.createElement('template')
comingUpTemplate.innerHTML = `

<style>
    .calendar-table {
        width: 100%;    
        border-spacing: 0px;    
    }
    .calendar-table td {
        padding: 0px;
        vertical-align: top;
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

<div style="position: relative;">
    <table class="calendar-table">
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
                    <label id="day-2015-09-21">Birthday</label>
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


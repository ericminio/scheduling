const calendarTemplate = document.createElement('template')
calendarTemplate.innerHTML = `
<timeline>
    <hour class="common" style="left: calc(0 * 2 * var(--width) + var(--padding));">0</hour>
    <hour class="common" style="left: calc(8 * 2 * var(--width) + var(--padding));">8</hour>
    <hour class="common" style="left: calc(12 * 2 * var(--width) + var(--padding));">12</hour>
    <hour class="common" style="left: calc(16 * 2 * var(--width) + var(--padding));">16</hour>
    <hour class="common" style="left: calc(20 * 2 * var(--width) + var(--padding));">20</hour>
</timeline>
<events class="common" style="height: calc(2 * var(--height) + 2 * var(--padding));">
    <event class="common"
        id="event-E1" 
        data-start="00:00" 
        data-end="07:00"
        style="top:calc(0 * var(--height) + var(--padding)); left:calc(0 * 2 * var(--width) + var(--padding)); width:calc((7 - 0) * 2 * var(--width));"
        ></event>
    <event class="common"
        id="event-E3" 
        data-start="18:00" 
        data-end="20:00"
        style="top:calc(0 * var(--height) + var(--padding)); left:calc(18 * 2 * var(--width) + var(--padding)); width:calc((20 - 18 ) * 2 * var(--width));"
        ></event>
    <event class="common"
        id="event-E5" 
        data-start="8:00" 
        data-end="11:00"
        style="top:calc(1 * var(--height) + var(--padding)); left:calc(8 * 2 * var(--width) + var(--padding)); width:calc((11 - 8) * 2 * var(--width));"
        ></event>
    <event class="common"
        id="event-E6" 
        data-start="23:00" 
        data-end="24:00"
        style="top:calc(1 * var(--height) + var(--padding)); left:calc(23 * 2 * var(--width) + var(--padding)); width:calc((24 - 23) * 2 * var(--width));"
        ></event>
</events>
`

class Calendar extends HTMLElement {

    constructor() {
        super()
    }
    connectedCallback() {
        this.appendChild(calendarTemplate.content.cloneNode(true))
    }
}
customElements.define('yop-calendar', Calendar)
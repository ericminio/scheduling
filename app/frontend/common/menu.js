const menuTemplate = document.createElement('template')

menuTemplate.innerHTML = `
    <style>
        ul {
            margin: 0px;
            padding: 0px;
            list-style: none;
        }
        li {
            display: inline-block;
            vertical-align: top;
        }
        .ribbon {
            background-color: var(--background-menu);
            color: var(--color-menu);
            border-top: 2px solid var(--color-menu);
            border-bottom: 2px solid var(--color-menu);
            margin-bottom: var(--vertical-margin);
            font-size: 0.8em;
        }
        .menu {
            padding-top: var(--padding);
            padding-bottom: var(--padding);
            padding-left: var(--padding);
            cursor: pointer;
        }
        .with-separator {
            border-left: 1px solid var(--color-menu);
        }
    </style>
    <div class="ribbon">
        <ul>
            <yop-link to="/calendar-day">
                <li class="menu" id="menu-calendar">DAY</li>
            </yop-link>
            <yop-link to="/calendar-week">
                <li class="menu with-separator" id="menu-calendar-week">WEEK</li>
            </yop-link>
            <yop-link to="/configuration">
                <li class="menu with-separator" id="menu-configuration">CONFIGURATION</li>
            </yop-link>
        </ul>
    </div>
`

class Menu extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {        
        this.appendChild(menuTemplate.content.cloneNode(true))
    }
}
customElements.define('yop-menu', Menu)

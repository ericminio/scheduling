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
            border-top: 2px solid black;
            border-bottom: 2px solid black;
            background-color: white;
            padding-top: 10px;
            padding-left: 10px;
            margin-bottom: 25px;
        }
        .menu {
            color: black;
            font-size: 13px;
            margin-right: 25px;
            cursor: pointer;
        }
        .with-separator {
            border-left: 1px solid black;
            padding-left: 25px;
        }
    </style>
    <div class="ribbon">
        <ul>
            <yop-link to="/events">
                <li class="menu" id="menu-calendar">CALENDAR</li>
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

class Resource extends HTMLElement {
    constructor() {
        super()
    }
    digest(data, index) {
        this.id = `resource-${data.id}`;
        this.innerHTML = data.name;
        this.style = `
            top:${this.top(index)}; 
        `;
    }
    top(index) {
        return `calc(${index} * var(--height) + var(--padding))`;
    }
};
customElements.define('yop-calendar-resource', Resource);

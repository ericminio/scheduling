class ResourceRenderer extends HTMLElement {
    constructor() {
        super()
    }
    digest(resource, index) {
        this.id = `resource-${resource.id}`;
        this.innerHTML = resource.name;
        this.style = `
            top:${this.top(index)}; 
        `;
        this.addEventListener('click', (e)=> {
            e.stopPropagation();
            events.notify('show resource', resource);
        })
    }
    top(index) {
        return layout.top(index);
    }
};
customElements.define('yop-calendar-resource', ResourceRenderer);

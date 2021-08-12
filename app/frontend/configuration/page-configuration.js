const pageConfigurationTemplate = document.createElement('template')
pageConfigurationTemplate.innerHTML = `

<style>
    #configuration-panel {
        margin-left: var(--resourceAreaWidth);
    }
    #configuration-save-section {
        margin-top: var(--vertical-margin);
    }
</style>

<yop-menu></yop-menu>

<div id="configuration-panel">
    <h2>Configuration</h2>
    
    <h3>Title</h3>
    <input id="configuration-title" />

    <h3>Opening hours</h3>
    <input id="configuration-opening-hours" />

    <div id="configuration-save-section">
        <button id="save-configuration">Save</button>
    </div>
</div>
`;

class PageConfiguration extends HTMLElement {

    constructor() {
        super();
    }
    connectedCallback() {
        this.appendChild(pageConfigurationTemplate.content.cloneNode(true));
        this.querySelector('#save-configuration').addEventListener('click', ()=> {
            this.save();
        });
        this.update();
    }
    update() {
        data.configuration()
            .then((configuration)=>{
                this.querySelector('#configuration-title').value = configuration.getTitle();
                this.querySelector('#configuration-title').focus();
                this.querySelector('#configuration-opening-hours').value = configuration.getOpeningHours();
            })
            .catch(()=> {
                events.notify('maybe signed-out');
            });        
    }
    save() {
        let configuration = new Configuration({
            title: this.querySelector('#configuration-title').value,
            'opening-hours': this.querySelector('#configuration-opening-hours').value
        });
        api.saveConfiguration(configuration)
            .then(()=> {
                store.saveObject('configuration', configuration);
                events.notify('success', { message:'Configuration saved' });
                events.notify('configuration updated');
            });
    }
};
customElements.define('page-configuration', PageConfiguration);


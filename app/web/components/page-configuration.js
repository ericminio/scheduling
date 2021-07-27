const pageConfigurationTemplate = document.createElement('template')
pageConfigurationTemplate.innerHTML = `

<style>
    #configuration-panel {
        margin-left: var(--resourceAreaWidth);
    }
</style>

<div id="configuration-panel">
    <h2>Configuration</h2>
    
    <h3>Title</h3>
    <input id="configuration-title" />

    <div>
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
        api.configuration()
            .then((configuration)=>{
                this.querySelector('#configuration-title').value = configuration.title;
                this.querySelector('#configuration-title').focus();
            })
            .catch(()=> {
                events.notify('maybe signed-out');
            });        
    }
    save() {
        let configuration = {
            title: this.querySelector('#configuration-title').value
        };
        api.saveConfiguration(configuration)
            .then(()=> {
                store.saveObject('configuration', configuration);
                events.notify('configuration updated');
            });
    }
};
customElements.define('page-configuration', PageConfiguration);


const logoutTemplate = document.createElement('template')
logoutTemplate.innerHTML = `
<style>
    .logout {
        cursor: pointer;
        font-size: 0.75em;
        text-decoration: underline;
    }
</style>
<div id="logout" class="logout inline-block">logout</div>
`;

class Logout extends HTMLElement {

    constructor() {
        super();
    }
    connectedCallback() {
        this.appendChild(logoutTemplate.content.cloneNode(true));
        this.querySelector('#logout').addEventListener('click', ()=> { this.logout(); });
        events.register(this, 'maybe signed-out');
        events.register(this, 'connected');
        this.update();
    }
    logout() {
        store.delete('user');
        this.update(undefined, 'maybe signed-out');
    }
    update(value, event) {
        let user = store.get('user');
        if (user == null) {
            this.querySelector('#logout').classList.add('hidden');
            if (event == 'maybe signed-out') {
                navigate.to('/');
            }
        }
        else {
            this.querySelector('#logout').classList.remove('hidden');
        }
    }
};
customElements.define('yop-logout', Logout);


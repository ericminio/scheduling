const logoutTemplate = document.createElement('template')
logoutTemplate.innerHTML = `
<style>
    .logout {
        font-size: 0.75em;
    }
    .logout-greetings {
        display: inline-block;
    }
    .logout-link {
        display: inline-block;
        cursor: pointer;
        text-decoration: underline;
    }
</style>
<div id="logout" class="logout inline-block">
    <label id="logout-greetings" class="logout-greetings">Welcome, ?</label>
    <label class="logout-separator">&nbsp;|&nbsp;</label>
    <label id="logout-link" class="logout-link">logout</label>
</div>
`;

class Logout extends HTMLElement {

    constructor() {
        super();
    }
    connectedCallback() {
        this.appendChild(logoutTemplate.content.cloneNode(true));
        this.querySelector('#logout-link').addEventListener('click', ()=> { this.logout(); });
        this.update();
        events.register(this, 'maybe signed-out');
        events.register(this, 'connected');
        events.register(this, 'signing-in');
    }
    logout() {
        store.delete('user');
        this.update(undefined, 'maybe signed-out');
    }
    update(value, event) {
        if (event == 'signing-in') {
            this.querySelector('#logout-greetings').innerHTML = '';
            this.querySelector('#logout').classList.add('hidden');
            return;
        }
        let user = store.getObject('user');
        if (user == null) {
            this.querySelector('#logout').classList.add('hidden');
            if (event == 'maybe signed-out') {
                navigate.to('/');
            }
        }
        else {
            this.querySelector('#logout').classList.remove('hidden');
            this.querySelector('#logout-greetings').innerHTML = `Welcome, ${user.username}`;
        }
    }
};
customElements.define('yop-logout', Logout);


const pageSignInTemplate = document.createElement('template')
pageSignInTemplate.innerHTML = `

<div class="vertical-form login-form">
    <label >Login</label>
    <input id="username"/>
    <label >Password</label>
    <input id="password" type="password"/>
    
    <button id="signin">Sign in</button>
</div>
`;

class PageSignIn extends HTMLElement {

    constructor() {
        super();
    }
    connectedCallback() {
        this.appendChild(pageSignInTemplate.content.cloneNode(true));
        this.querySelector('#password').addEventListener('keypress', (e)=>{ 
            if (e.key == 'Enter') { this.login(); }
         });
        this.querySelector('#signin').addEventListener('click', ()=>{ this.login(); });
        this.querySelector('#username').focus();
        store.delete('user');
        events.notify('signing-in')
    }
    login() {
        let credentials = {
            username: this.querySelector('#username').value,
            password: this.querySelector('#password').value
        };
        api.signIn(credentials)
            .then((data)=> { 
                store.saveObject('user', data);
                events.notify('connected');
                navigate.to('/calendar-day'); 
            })
            .catch((error)=> { events.notify('error', error); })
            ;
    }
};
customElements.define('page-sign-in', PageSignIn);


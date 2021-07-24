const signInTemplate = document.createElement('template')
signInTemplate.innerHTML = `

<div class="vertical-form login-form">
    <label >Login</label>
    <input id="username"/>
    <label >Password</label>
    <input id="password" type="password"/>
    
    <button id="signin">Sign in</button>
</div>
`;

class SignIn extends HTMLElement {

    constructor() {
        super();
    }
    connectedCallback() {
        this.appendChild(signInTemplate.content.cloneNode(true));
        this.querySelector('#password').addEventListener('keypress', (e)=>{ 
            if (e.key == 'Enter') { this.login(); }
         });
        this.querySelector('#signin').addEventListener('click', ()=>{ this.login(); });
        this.querySelector('#username').focus();
        store.delete('user');
    }
    login() {
        let credentials = {
            username: this.querySelector('#username').value,
            password: this.querySelector('#password').value
        };
        api.signIn(credentials)
            .then((data)=> { 
                store.saveObject('user', data);
                navigate.to('/events'); 
            })
            .catch((error)=> { events.notify('error', error); })
            ;
    }
};
customElements.define('yop-sign-in', SignIn);


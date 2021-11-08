class Navigation {

    constructor(window) {
        this.window = window;
        this.window.onpopstate = ()=> {
            eventBus.notify('navigation');
        }
    }

    to(target) {
        history.pushState({}, null, target);
        eventBus.notify('navigation');
    }
}
var navigate = new Navigation(window);

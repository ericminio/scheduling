class Robot {
    constructor(World, By) {
        this.By = By;
        this.World = World;
        this.driver = World.driver;
        this.elements = [
            'yop-route',
            'yop-link'
        ]
    }
    async open(uri) {
        await this.World.driver.get(`http://localhost:${this.World.server.port}${uri}`);
    }
    async wait(ms) {
        await this.World.driver.sleep(ms);
    }
    async input(selector, value) {
        let field = await this.findElement(selector);
        await field.clear();
        await field.sendKeys(value);
    }
    async text(selector) {
        let field = await this.findElement(selector);
        return await field.getText();
    }
    async click(selector) {
        let element = await this.findElement(selector);
        await element.click();
    }
    async findElement(selector) {
        try {
            return await this.driver.findElement(this.By.css(selector))
        }
        catch (error) {
            let shadowRoots = []
            for (let i=0; i<this.elements.length; i++) {
                let name = this.elements[i]
                let doms = await this.driver.findElements(this.By.css(name))
                shadowRoots = shadowRoots.concat(doms)
            }
            for (let i=0; i<shadowRoots.length; i++) {
                let element = await this.inspect(shadowRoots[i], selector)
                if (element) { return element }
            }
    
            throw new Error('Unable to locate element: ' + selector)
        }
    }
    async inspect(dom, selector) {
        try {
            let search = 'return arguments[0].shadowRoot.querySelector("' + selector + '")'
            let element = await this.driver.executeScript(search, dom)
            if (element) { return element }
    
            var children = []
            for (let k=0; k<this.elements.length; k++) {
                let name = this.elements[k]
                let script = 'return arguments[0].shadowRoot.querySelectorAll("' + name + '")'
                let doms = await this.driver.executeScript(script, dom)
                children = children.concat(doms)
            }
            for (let i=0; i<children.length; i++) {
                let element = await this.inspect(children[i], selector)
                if (element) { return element }
            }
        }
        catch (error) {
            return undefined
        }
    }
}
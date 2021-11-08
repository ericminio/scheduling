const fs = require('fs');
const path = require('path');

let file = (name)=>{
    return fs.readFileSync(path.join(__dirname, name)).toString();
}
let yop = [
    './1.store.js',
    './2.event-bus.js',
    './3.navigate.js',
    './4.route.js',
    './5.link.js'
].reduce((acc, current)=> acc + file(current), '');

module.exports = yop;
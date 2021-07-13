const fs = require('fs');
const path = require('path');

let file = (name)=>{
    return fs.readFileSync(path.join(__dirname, name)).toString();
}
let yop = [
    './2.events.js',
    './3.route.js',
    './5.navigate.js',
    './link.js'
].reduce((acc, current)=> acc + file(current), '');

module.exports = yop;
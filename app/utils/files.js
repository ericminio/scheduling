const fs = require('fs');
const path = require('path');

const fileContent = (filename)=> fs.readFileSync(path.join(__dirname, '..', filename)).toString()
const code = (filename, classname)=> (new Function(`${fileContent(filename)}; return ${classname};`))()

module.exports = {
    code: code
};
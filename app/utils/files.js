const fs = require('fs');
const path = require('path');

const content = (file)=> fs.readFileSync(path.join(__dirname, '..', file)).toString()
const code = (file, name)=> (new Function(`${content(file)}; return ${name};`))()

const contents = (files)=> files.reduce((acc, file)=> acc += content(file), '');
const codes = (files, name)=> (new Function(`${contents(files)}; return ${name};`))()

module.exports = {
    code: code,
    codes: codes,
    content: content,
    contents: contents
};
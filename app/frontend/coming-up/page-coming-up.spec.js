const { expect } = require('chai');
const { yop, domain, data, components } = require('../assets');
const { JSDOM } = require("jsdom");

describe('Comin up page', ()=>{

    let html = `
        <!DOCTYPE html>
        <html lang="en">
            <body>
                <div id="container"></div>                
                <script>
                    ${yop}
                    ${domain}
                    ${data}     
                    ${components}
                    today = ()=> { return new Date(2015, 8, 21); }
                </script>
            </body>
        </html>
        `;
    let window;
    let document;
    let container;
    let sut;

    beforeEach(()=>{
        window = (new JSDOM(html, { url:'http://localhost', runScripts: "dangerously", resources: "usable" })).window;
        document = window.document;
        sut = document.createElement('page-coming-up');
        container = document.querySelector('#container');
    });

    let showSut = ()=> {
        container.appendChild(sut);
    }

    it('fetches data up to today + 30 days', ()=>{
        let range = {}
        sut.searchEvents.inRange = (start, end)=> {
            range = {
                start:start,
                end:end
            }
            return new Promise((resolve, reject)=> { 
                resolve({
                    events:[]
                });
            })
        }
        showSut();
        expect(range).to.deep.equal({ 
            start:"2015-09-21 00:00:00",
            end:"2015-10-21 00:00:00"
        })
    });
})
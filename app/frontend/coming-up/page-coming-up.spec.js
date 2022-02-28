const { expect } = require('chai');
const { yop, domain, data, components } = require('../assets');
const { JSDOM } = require('jsdom');
const { Event } = require('../../domain');

describe('Coming up page', ()=>{

    let html = `
        <!DOCTYPE html>
        <html lang='en'>
            <body>
                <div id='container'></div>                
                <script>
                    ${yop}
                    ${domain}
                    ${data}     
                    ${components}
                    today = ()=> { return new Date(2015, 8, 21); }
                </script>
            </body>
        </html>
        `;
    let window;
    let document;
    let container;
    let sut;
    let wait = 1;

    beforeEach(()=>{
        window = (new JSDOM(html, { url:'http://localhost', runScripts: 'dangerously', resources: 'usable' })).window;
        document = window.document;
        sut = document.createElement('page-coming-up');
        container = document.querySelector('#container');
    });

    let showSut = ()=> {
        container.appendChild(sut);
    }

    it('fetches future events', ()=>{
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
            start:'2015-09-21 00:00:00',
            end:undefined
        })
    });

    describe('event list', () => {

        beforeEach(() => {
            sut.searchEvents.inRange = (start, end)=> {
                return new Promise((resolve, reject)=> { 
                    resolve({
                        events:[
                            new Event({ id:'15', label:'wonderful', start:'2015-09-21 13:00', end:'2015-09-21 15:00'}),
                            new Event({ id:'42', label:'awesome', start:'2015-10-01 13:00', end:'2015-10-01 15:00'}),
                            new Event({ id:'25', label:'crazy', start:'2015-09-21 17:00', end:'2015-09-21 17:00'})
                        ]
                    });
                })
            }
        });

        it('has expected components', (done) => {
            showSut();
            setTimeout(() => {
                expect(document.querySelector('#coming-up-events #day-2015-09-21 #coming-up-event-15')).not.to.equal(null);
                expect(document.querySelector('#coming-up-events #day-2015-09-21 #coming-up-event-25')).not.to.equal(null);
                expect(document.querySelector('#coming-up-events #day-2015-10-01 #coming-up-event-42')).not.to.equal(null);
                done();
            }, wait)
        });

        it('displays labels', (done) => {
            showSut();
            setTimeout(() => {
                expect(document.querySelector('#coming-up-event-42').innerHTML).to.contain('awesome');
                done();
            }, wait)
        });

        it('displays time range', (done) => {
            showSut();
            setTimeout(() => {
                expect(document.querySelector('#coming-up-event-42').innerHTML).to.contain('13:00 - 15:00');
                done();
            }, wait)
        });

        it('displays day', (done) => {
            showSut();
            setTimeout(() => {
                expect(document.querySelector('#day-2015-09-21').innerHTML).to.contain('2015-09-21 Monday');
                done();
            }, wait)
        });
    })
})
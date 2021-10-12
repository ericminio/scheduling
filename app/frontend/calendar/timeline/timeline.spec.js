const { expect } = require('chai');
const { yop, domain, data, components } = require('../../assets');
const { JSDOM } = require("jsdom");

describe('Timeline', ()=>{

    let html = `
        <!DOCTYPE html>
        <html lang="en">
            <body>
                <yop-calendar-day></yop-calendar-day>
                <script>
                    ${yop}
                    ${domain}
                    ${data}
                    var api = {
                        getResources: ()=> {
                            return new Promise((resolve, reject)=>{
                                resolve({ resources:[]});
                            });
                        },
                        getEvents: ()=> {
                            return new Promise((resolve, reject)=>{
                                resolve({ events:[]});
                            });
                        }                        
                    };
                    store.saveObject('configuration', { title:'Resto', 'opening-hours':'12-15' });
                    ${components}
                </script>
            </body>
        </html>
        `;
    let window;
    let document;
    let calendar;
    let wait = 1;

    beforeEach((done)=>{
        window = (new JSDOM(html, { url:'http://localhost', runScripts: "dangerously", resources: "usable" })).window;
        document = window.document;
        calendar = document.querySelector('yop-calendar-day');
        setTimeout(done, wait);
    })

    it('is available', ()=>{
        expect(calendar).not.to.equal(null);
    })

    it('displays expected timeline markers', ()=>{
        let markers = document.querySelectorAll('yop-timeline-marker');
        expect(markers.length).to.equal(3);
    })

    it('starts with opening hours start', ()=>{
        let markers = document.querySelectorAll('yop-timeline-marker');
        expect(markers[0].innerHTML).to.equal('12');
    })

    it('ends with opening hours end minus 1', ()=>{
        let markers = document.querySelectorAll('yop-timeline-marker');
        expect(markers[markers.length-1].innerHTML).to.equal('14');
    })

    describe('when configuration is not already available', ()=> {
        let html = `
            <!DOCTYPE html>
            <html lang="en">
                <body>
                    <yop-calendar-day></yop-calendar-day>
                    <script>
                        ${yop}
                        ${domain}
                        ${data}
                        api.getResources = ()=> {
                            return new Promise((resolve, reject)=>{
                                resolve({ resources:[]});
                            });
                        };
                        api.getEvents = ()=> {
                            return new Promise((resolve, reject)=>{
                                resolve({ events:[]});
                            });
                        };
                        api.configuration = ()=> new Promise((resolve)=>{ resolve({
                            title: 'Agenda', 'opening-hours':'8-15'
                        }); });
                        ${components}
                    </script>
                </body>
            </html>
            `;

        beforeEach((done)=>{
            window = (new JSDOM(html, { url:'http://localhost', runScripts: "dangerously", resources: "usable" })).window;
            document = window.document;
            calendar = document.querySelector('yop-calendar-day');
            setTimeout(done, wait);
        })

        it('goes to api', (done)=>{
            setTimeout(()=> {
                expect(window.store.getObject('configuration')).to.deep.equal(
                    { title:'Agenda', 'opening-hours':'8-15', openingHoursStart:8, openingHoursEnd:15 });
                done();
            }, wait);
        });
    })

    describe('when configuration is not completely available', ()=> {
        let html = `
            <!DOCTYPE html>
            <html lang="en">
                <body>
                    <yop-calendar-day></yop-calendar-day>
                    <script>
                        ${yop}
                        ${domain}
                        ${data}
                        api.getResources = ()=> {
                            return new Promise((resolve, reject)=>{
                                resolve({ resources:[]});
                            });
                        };
                        api.getEvents = ()=> {
                            return new Promise((resolve, reject)=>{
                                resolve({ events:[]});
                            });
                        };
                        api.configuration = ()=> new Promise((resolve)=>{ resolve({
                            title: 'Agenda', 'opening-hours':'8-15'
                        }); });
                        store.saveObject('configuration', { title:'Resto' });
                        ${components}
                    </script>
                </body>
            </html>
            `;

        beforeEach((done)=>{
            window = (new JSDOM(html, { url:'http://localhost', runScripts: "dangerously", resources: "usable" })).window;
            document = window.document;
            calendar = document.querySelector('yop-calendar-day');
            setTimeout(done, wait);
        })

        it('goes to api', (done)=>{
            setTimeout(()=> {
                expect(window.store.getObject('configuration')).to.deep.equal(
                    { title:'Agenda', 'opening-hours':'8-15', openingHoursStart:8, openingHoursEnd:15 });
                done();
            }, wait);
        });
    })
})
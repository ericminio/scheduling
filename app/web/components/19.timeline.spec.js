const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { expect } = require('chai');
const yop = require('../yop');
const fs = require('fs');
const path = require('path');
const sut = ''
    + fs.readFileSync(path.join(__dirname, 'layout.js')).toString()
    + fs.readFileSync(path.join(__dirname, 'resource.js')).toString()
    + fs.readFileSync(path.join(__dirname, 'timeline-marker.js')).toString()
    + fs.readFileSync(path.join(__dirname, 'calendar-event.js')).toString()
    + fs.readFileSync(path.join(__dirname, 'calendar.js')).toString()
    ;

describe('Timeline', ()=>{

    let html = `
        <!DOCTYPE html>
        <html lang="en">
            <body>
                <yop-calendar></yop-calendar>
                <script>
                    ${yop}
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
                    ${sut}
                </script>
            </body>
        </html>
        `;
    let window;
    let document;
    let calendar;
    let wait = 10;

    beforeEach((done)=>{
        window = (new JSDOM(html, { url:'http://localhost', runScripts: "dangerously", resources: "usable" })).window;
        document = window.document;
        calendar = document.querySelector('yop-calendar');
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

    describe('when configuration is not already availble', ()=> {
        let html = `
            <!DOCTYPE html>
            <html lang="en">
                <body>
                    <yop-calendar></yop-calendar>
                    <script>
                        ${yop}
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
                            },
                            configuration: ()=> new Promise((resolve)=>{ resolve({
                                title: 'Agenda', 'opening-hours':'8-15'
                            }); })  
                        };
                        ${sut}
                    </script>
                </body>
            </html>
            `;

        beforeEach((done)=>{
            window = (new JSDOM(html, { url:'http://localhost', runScripts: "dangerously", resources: "usable" })).window;
            document = window.document;
            calendar = document.querySelector('yop-calendar');
            setTimeout(done, wait);
        })

        it('goes to api', (done)=>{
            setTimeout(()=> {
                expect(window.store.getObject('configuration')).to.deep.equal(
                    { title:'Agenda', 'opening-hours':'8-15'});
                done();
            }, 50);
        });
    })

    describe('when configuration is not completely availble', ()=> {
        let html = `
            <!DOCTYPE html>
            <html lang="en">
                <body>
                    <yop-calendar></yop-calendar>
                    <script>
                        ${yop}
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
                            },
                            configuration: ()=> new Promise((resolve)=>{ resolve({
                                title: 'Agenda', 'opening-hours':'8-15'
                            }); })  
                        };
                        store.saveObject('configuration', { title:'Resto' });
                        ${sut}
                    </script>
                </body>
            </html>
            `;

        beforeEach((done)=>{
            window = (new JSDOM(html, { url:'http://localhost', runScripts: "dangerously", resources: "usable" })).window;
            document = window.document;
            calendar = document.querySelector('yop-calendar');
            setTimeout(done, wait);
        })

        it('goes to api', (done)=>{
            setTimeout(()=> {
                expect(window.store.getObject('configuration')).to.deep.equal(
                    { title:'Agenda', 'opening-hours':'8-15'});
                done();
            }, 50);
        });
    })
})
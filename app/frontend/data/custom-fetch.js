const http = require('http');

module.exports = (port)=> (uri, options)=> { 
    return new Promise((resolve, reject)=> {
        const please = {
            hostname: 'localhost',
            port: port,
            path: uri,
            method: options.method
        };
        let request = http.request(please, answer => {   
            let payload = '';
            answer.on('data', chunk => {
                payload += chunk;
            });
            answer.on('end', ()=>{
                let body = JSON.parse(payload);
                let response = {
                    status: answer.statusCode,
                    json: ()=> {
                        return new Promise((resolve, reject)=>{
                            resolve(body);
                        })
                    }
                }
                resolve(response);
            });
            answer.on('error', error => {
                reject(error);
            })
        })
        request.on('error', error => {
            reject(error);
        })
        if (options.headers !== undefined) {
            request.setHeader('x-user-key', options.headers.get('x-user-key'));
        }
        if (options.body) { request.write(options.body); }
        request.end();
    });
};

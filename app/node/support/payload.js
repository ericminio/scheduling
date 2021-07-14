const payload = (request)=> {
    return new Promise((resolve, reject)=>{
        let payload = '';
        request.on('data', (chunk)=>{ payload += chunk; })
        request.on('end', ()=>{
            let incoming = JSON.parse(payload);
            resolve(incoming);
        });
        request.on('error', (error)=> reject(error));
    })
}

module.exports = payload;
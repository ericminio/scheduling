const payload = (request)=> {
    return new Promise((resolve, reject)=>{
        let payload = '';
        request.on('data', (chunk)=>{ 
            payload += chunk; 
        })
        request.on('end', ()=>{
            try {
                let incoming = JSON.parse(payload);
                resolve(incoming);
            }
            catch (error) {
                reject(error);
            }
        });
        request.on('error', (error)=> reject(error));
    })
}

module.exports = payload;
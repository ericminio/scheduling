module.exports = (request)=> {
    return new Promise((resolve, reject)=>{
        let payload = '';
        request.on('data', (chunk)=>{ 
            payload += chunk; 
        })
        request.on('end', ()=>{
            try {
                resolve(payload);
            }
            catch (error) {
                reject(error);
            }
        });
        request.on('error', (error)=> reject(error));
    })
};
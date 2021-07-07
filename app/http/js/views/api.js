let api = {
    getEvents: async ()=> {
        var p = new Promise((resolve, reject)=>{
            resolve({ events:[
                { id:'E0', start:'00:00', end:'07:00', line:0 },
                { id:'E1', start:'00:30', end:'07:00', line:1 },
                { id:'E2', start:'01:00', end:'07:00', line:2 },
                { id:'E3', start:'18:00', end:'20:00', line:0 },
                { id:'E5', start:'08:00', end:'11:00', line:1 },
                { id:'E6', start:'21:00', end:'24:00', line:1 } 
            ]});
        });
        return p;
    }
};
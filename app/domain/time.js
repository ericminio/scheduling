var today = ()=> {
    return new Date();
};

var nextDay = (input)=> {
    let parts = input.split('-');
    let year = parseInt(parts[0]);
    let month = parseInt(parts[1])-1;
    let day = parseInt(parts[2]);
    let incoming = new Date(year, month, day);
    let next = new Date(incoming.getTime() + 1000*60*60*24 * 1);
    return next;
};

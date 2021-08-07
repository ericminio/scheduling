var isValidDatetime = (date)=> {
    var pattern = /^\d\d\d\d-[0-1][0-9]-[0-3][0-9]\s\d\d:\d\d$/;
    return pattern.test(date);
};

var isAnOverbooking = (candidate, events)=> {
    for (var i=0; i<events.length; i++) {
        let event = events[i];
        if (candidate.getEnd() > event.getStart() &&
            candidate.getStart() < event.getEnd()) {
                for (var j=0; j<candidate.resources.length; j++) {
                    let id = candidate.resources[j].id;
                    let found = event.resources.find(r => r.id == id);
                    if (found !== undefined ) {
                        return true;
                    }
                }
            }
    }
    return false;
};

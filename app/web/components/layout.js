let layout = {
    left: (instant)=> {
        return `calc(var(--padding) + var(--minimalWidth) * (${instant.hours} * 60 + ${instant.minutes}) / var(--minimalWidthInMinutes))`
    },
    width: (start, end)=> {
        return `calc(var(--minimalWidth) * (${end.hours - start.hours} * 60 - ${start.minutes} + ${end.minutes}) / var(--minimalWidthInMinutes))`;
    }
};

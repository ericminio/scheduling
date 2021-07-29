let layout = {
    top: (index)=> {
        return `calc(${index} * var(--height) + var(--padding))`;
    },
    left: (instant)=> {
        return `calc(var(--padding) + var(--minimalWidth) * ((${instant.hours} - var(--opening-hours-start)) * 60 + ${instant.minutes}) / var(--minimalWidthInMinutes))`
    },
    width: (start, end)=> {
        return `calc(var(--minimalWidth) * (${end.hours - start.hours} * 60 - ${start.minutes} + ${end.minutes}) / var(--minimalWidthInMinutes))`;
    },
    totalHeight: (resourceCount)=> {
        return `calc(${resourceCount} * var(--height) + 2 * var(--padding))`;
    }
};

const DURATION = {
    WHOLE: 'w',
    HALF: 'h',
    QUARTER: 'q',
    EIGHT: 8,
    SIXTEENTH: 16
}

const RESTS = {

}

const DOTS = {
    index: 'index',
    all: 'all'
}

export const LETTERS = {
    A: { values: [ 'q' ] },
    B: { values: [ '16r', '8d' ] },
    C: { values: [ '8r', '8' ] },
    D: { values: [ '8dr', '16' ] },
    E: { values: [ '16', '8d' ] },
    F: { values: [ '16r', '16', '8' ] },
    G: { values: [ '8r', '16', '16' ] },
    H: { values: [ '8d', '16' ] },
    I: { values: [ '8', '8' ] },
    J: { values: [ '16r', '16', '16r', '16' ], beamOverRest: true  },
    K: { values: [ '16', '16', '8' ] },
    L: { values: [ '16r', '16', '16', '16' ] },
    M: { values: [ '8', '16', '16' ] },
    N: { values: [ '16', '8', '16' ] },
    O: { values: [ 'qr' ] },
}
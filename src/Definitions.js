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
    J: { values: [ '16r', '16', '16r', '16' ] },
    K: { values: [ '16', '16', '8' ] },
    L: { values: [ '16r', '16', '16', '16' ] },
    M: { values: [ '8', '16', '16' ] },
    N: { values: [ '16', '8', '16' ] },
    O: { values: [ '16', '16', '16', '16' ] },
    P: { values: [ 'qr' ] },
}

export const LETTERS_LEVELS = {
    easy: [ 'A', 'C', 'I', 'P' ],
    medium: [ 'E', 'G', 'H', 'K', 'M' ],
    hard: [ 'B', 'D', 'F', 'J', 'L', 'N' ]
}

export const TRIPLET_LETTERS = {
    Q: { values: [ 'q' ] },
    R: { values: [ '8r', '8', '8r' ] },
    S: { values: [ '8r', '8r', '8' ] },
    T: { values: [ '8', '8', '8r' ] },
    U: { values: [ '8r', '8', '8' ] },
    V: { values: [ '8', '8r', '8' ] },
    W: { values: [ '8', '8', '8' ] },
    X: { values: [ 'qr' ] },
}

export const TRIPLET_LETTERS_LEVELS = {
    easy: [ 'Q', 'W', 'X' ],
    medium: [ 'T', 'V' ],
    hard: [ 'R', 'S', 'U' ]
}
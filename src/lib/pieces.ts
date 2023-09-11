export type Piece = { id: number, amount: number; levels: number; display_name: string; note?: string,color?: 'white' | 'black' };

export type BoardPiece = {
    color: 'white' | 'black';
    piece_type:
        | 'marshal(king)'
        | 'knight'
        | 'pawn'
        | 'general'
        | 'spy'
        | 'archer'
        | 'cannon'
        | 'samurai'
        | 'musketeer'
        | 'lieutenantgeneral'
        | 'majorgeneral'
        | 'captain'
        | 'fortress'
};

export type BoardSquare = { id: number; pieces: Array<BoardPiece> }

export const piece_data: Piece[] = [
    { id: 1, amount: 4, levels: 3, display_name: 'Major General' },
    { id: 2, amount: 4, levels: 3, display_name: 'Lieutenant General' },
    { id: 3, amount: 6, levels: 3, display_name: 'General' },
    { id: 4, amount: 2, levels: 3, display_name: 'Archer' },
    { id: 5, amount: 2, levels: 3, display_name: 'Knight' },
    { id: 6, amount: 1, levels: 3, display_name: 'Musketeer' },
    {
        id: 7,
        amount: 1,
        levels: 1,
        display_name: 'Captain',
        note: 'The captain takes on the movement ability of the piece (friendly or opponent) that is directly below it.'
    },
    { id: 8, amount: 2, levels: 3, display_name: 'Samurai' },
    {
        id: 9,
        amount: 1,
        levels: 1,
        display_name: 'Fortress',
        note: "Fortresses can't stack on other pieces; they can only be stacked upon."
    },
    { id: 10, amount: 2, levels: 3, display_name: 'Cannon', },
    { id: 11, amount: 2, levels: 3, display_name: 'Spy', },
    { id: 12, amount: 9, levels: 3, display_name: 'Pawn', },
    {
        id: 14,
        amount: 1,
        levels: 1,
        display_name: 'Marshal (King)',
        note: 'The Marshal moves the same for all tiers. Pieces cannot be stacked on the Marshal.'
    }
];
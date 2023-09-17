export type Piece = {
    id: number | string,
    amount: number;
    levels: number;
    display_name: string;
    note?: string,
    color?: 'white' | 'black',
    position?: number,
    current_level?: number
};

export type BoardState = { id: number, pieces: Piece[] }[][];

export type GameState = {board_state: BoardState,turn: number,stack_turn: number}

export type PlayerData = {
    name: string;
    color: 'white' | 'black';
    piece_data: Piece[];
}

export type SocketDataAfterTurn = {board_state: BoardState,turn: number,stack_turn: number,player_data: PlayerData[], game_id: string};

export type Players = Record<string,{player_color: 'white' | 'black',name: string | null,ready: boolean}>
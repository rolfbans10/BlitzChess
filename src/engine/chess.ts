export enum PieceColor {
  BLACK = "black",
  WHITE = "white",
}

export enum PieceType {
  PAWN = "pawn",
  ROOK = "rook",
  BISHOP = "bishop",
  KNIGHT = "knight",
  QUEEN = "queen",
  KING = "king",
}

export interface Position {
  x: number;
  y: number;
}

export interface Piece {
  color: PieceColor;
  type: PieceType;
  pos: Position;
  captured: boolean;
}

export interface Square {
  piece: Piece | null;
}

export interface Player {
  name: string;
  color: PieceColor;
}

export interface ChessGame {
  board: Square[][];
  player1: Player;
  player2: Player;
}

export const getCleanBoard = (): Square[][] => {
  const board: Square[][] = [];
  for (let x = 0; x < 8; x++) {
    board.push([]);
    for (let y = 0; y < 8; y++) {
      board[x][y] = {
        piece: null,
      };
    }
  }
  return board;
};

export const setupInitialPositions = (): Square[][] => {
  const board = getCleanBoard();

  // place pawns
  for (let y = 0; y < 8; y++) {
    board[1][y].piece = {
      type: PieceType.PAWN,
      color: PieceColor.WHITE,
      captured: false,
      pos: {
        x: 1,
        y,
      },
    };
    board[6][y].piece = {
      type: PieceType.PAWN,
      color: PieceColor.BLACK,
      captured: false,
      pos: {
        x: 6,
        y,
      },
    };
  }

  return board;
};

// export const initChessGame = (): ChessGame => {
//   const board: Square[] = [];
//
//   return board;
// };

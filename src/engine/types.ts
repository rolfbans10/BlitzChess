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
  captured?: boolean;
  hasMoved?: boolean;
  moves?: Move[];
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
  toPlay: PieceColor;
  winner: PieceColor | null;
  moves: Move[];
  capturedPieces: Piece[];
  lastMove: Move | null;
  isGameOver: boolean;
  whiteMoves: Move[];
  blackMoves: Move[];
}

export interface Move {
  from: Position;
  to: Position;
  isCapture?: boolean;
  isCheck?: boolean;
  isPromotion?: boolean;
  isCastling?: boolean;
  isEnPassant?: boolean;
}

export type MoveFilter = (game: ChessGame, move: Move) => boolean;

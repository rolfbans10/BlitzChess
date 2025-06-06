import { ChessGame, Move, PieceColor, Square } from "@/engine/types";
import { getCleanBoard } from "@/engine/chess";
import { getPieceString } from "@/engine/utils";

export const createTestGame = (overrides?: Partial<ChessGame>): ChessGame => ({
  board: getCleanBoard(),
  toPlay: PieceColor.WHITE,
  player1: {
    name: "Player 1",
    color: PieceColor.WHITE,
  },
  player2: {
    name: "Player 2",
    color: PieceColor.BLACK,
  },
  winner: null,
  moves: [],
  capturedPieces: [],
  isGameOver: false,
  lastMove: null,
  whiteMoves: [],
  blackMoves: [],
  castlingRights: {
    whiteKingside: true,
    whiteQueenside: true,
    blackKingside: true,
    blackQueenside: true,
  },
  ...overrides,
});

export const findExtraMoves = (
  moves: Move[],
  expectedMoves: Move[],
): Move[] => {
  const extraMoves: Move[] = [];
  for (const move of moves) {
    let found = false;
    for (const expectedMove of expectedMoves) {
      if (
        move.from.x === expectedMove.from.x &&
        move.from.y === expectedMove.from.y &&
        move.to.x === expectedMove.to.x &&
        move.to.y === expectedMove.to.y
      ) {
        found = true;
      }
    }
    if (!found) {
      extraMoves.push(move);
    }
  }
  return extraMoves;
};

export const printBoard = (board: Square[][]) => {
  let boardString = "";
  const divider = "----".repeat(8) + "\n";
  boardString += divider;
  for (let x = 7; x >= 0; x--) {
    boardString += "| ";
    for (let y = 0; y < 8; y++) {
      const piece = board[x][y].piece;
      boardString += getPieceString(piece);
      boardString += " | ";
    }
    boardString += `${x + 1}\n`;
    boardString += divider;
  }
  boardString += "  a   b   c   d   e   f   g   h\n";
  console.error(boardString);
};

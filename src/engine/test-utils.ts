import { ChessGame, Move, PieceColor } from "@/engine/types";
import { getCleanBoard } from "@/engine/chess";

export const createTestGame = (overrides?: Partial<ChessGame>): ChessGame => ({
  board: getCleanBoard(),
  toPlay: PieceColor.WHITE,
  player1: {
    name: "player 1",
    color: PieceColor.WHITE,
  },
  player2: {
    name: "player 2",
    color: PieceColor.BLACK,
  },
  winner: null,
  moves: [],
  capturedPieces: [],
  isGameOver: false,
  lastMove: null,

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

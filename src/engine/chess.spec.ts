import {
  getCleanBoard,
  Piece,
  PieceColor,
  PieceType,
  setupInitialPositions,
  Square,
} from "@/engine/chess";

describe("chess", () => {
  describe("getCleanBoard()", () => {
    it("should return an empty board with no pieces", () => {
      const board: Square[][] = getCleanBoard();
      // assert that all pieces are null
      for (let x = 0; x < board.length; x++) {
        for (let y = 0; y < board[x].length; y++) {
          expect(board[x][y].piece).toBe(null);
        }
      }
    });
  });
  describe("setupInitialPosition()", () => {
    it("should put all the pieces in the initial position", () => {
      const board = setupInitialPositions();
      for (let x = 0; x < board.length; x++) {
        for (let y = 0; y < board[x].length; y++) {
          if (x === 1) {
            expect(board[x][y].piece?.type).toEqual(PieceType.PAWN);
            expect(board[x][y].piece?.color).toEqual(PieceColor.WHITE);
            expect(board[x][y].piece?.pos).toEqual({
              x,
              y,
            });
            expect(board[x][y].piece?.captured).toEqual(false);
          }
          if (x === 6) {
            expect(board[x][y].piece?.type).toEqual(PieceType.PAWN);
            expect(board[x][y].piece?.color).toEqual(PieceColor.BLACK);
            expect(board[x][y].piece?.pos).toEqual({
              x,
              y,
            });
            expect(board[x][y].piece?.captured).toEqual(false);
          }
        }
      }
    });
  });
});

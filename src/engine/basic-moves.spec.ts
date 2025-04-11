import { Move, Piece, PieceColor, PieceType } from "@/engine/types";
import {
  getAllPossibleBasicMoves,
  getBishopMoves,
  getKingMoves,
  getKnightMoves,
  getPawnMoves,
  getQueenMoves,
  getRookMoves,
} from "@/engine/basic-moves";
import { createTestGame, findExtraMoves } from "@/engine/test-utils";

describe("basic-moves", () => {
  describe("getPawnMoves", () => {
    it("should return one square forward for a white pawn with an empty square ahead", () => {
      const game = createTestGame();
      const pawn: Piece = {
        type: PieceType.PAWN,
        color: PieceColor.WHITE,
        hasMoved: true,
        pos: { x: 4, y: 4 },
      };

      game.board[4][4].piece = pawn;

      const moves = getPawnMoves(game, pawn);
      expect(moves).toEqual(
        expect.arrayContaining([{ from: { x: 4, y: 4 }, to: { x: 5, y: 4 } }]),
      );
    });

    it("should return two squares forward for a white pawn on its initial position", () => {
      const game = createTestGame();
      const pawn: Piece = {
        type: PieceType.PAWN,
        color: PieceColor.WHITE,
        hasMoved: false,
        pos: { x: 1, y: 4 },
      };

      game.board[1][4].piece = pawn;

      const moves = getPawnMoves(game, pawn);
      expect(moves).toEqual(
        expect.arrayContaining([
          { from: { x: 1, y: 4 }, to: { x: 2, y: 4 } },
          { from: { x: 1, y: 4 }, to: { x: 3, y: 4 } },
        ]),
      );
    });

    it("should return one square forward for a black pawn", () => {
      const game = createTestGame();
      game.toPlay = PieceColor.BLACK; // Black's turn
      const pawn: Piece = {
        type: PieceType.PAWN,
        color: PieceColor.BLACK,
        hasMoved: true,
        pos: { x: 4, y: 4 },
      };

      game.board[4][4].piece = pawn;

      const moves = getPawnMoves(game, pawn);
      expect(moves).toEqual(
        expect.arrayContaining([{ from: { x: 4, y: 4 }, to: { x: 3, y: 4 } }]),
      );
    });

    it("should return diagonal capture moves for a white pawn", () => {
      const game = createTestGame();
      const pawn: Piece = {
        type: PieceType.PAWN,
        color: PieceColor.WHITE,
        hasMoved: true,
        pos: { x: 4, y: 4 },
      };

      game.board[4][4].piece = pawn;
      game.board[5][3].piece = {
        type: PieceType.BISHOP,
        color: PieceColor.BLACK,
        pos: { x: 5, y: 3 },
        hasMoved: false,
      };
      game.board[5][5].piece = {
        type: PieceType.KNIGHT,
        color: PieceColor.BLACK,
        pos: { x: 5, y: 5 },
        hasMoved: false,
      };

      const moves = getPawnMoves(game, pawn);
      expect(moves).toEqual(
        expect.arrayContaining([
          { from: { x: 4, y: 4 }, to: { x: 5, y: 4 } },
          { from: { x: 4, y: 4 }, to: { x: 5, y: 5 } },
          { from: { x: 4, y: 4 }, to: { x: 5, y: 3 } },
        ]),
      );
    });

    it("should not allow forward movement if the square is occupied", () => {
      const game = createTestGame();
      const pawn: Piece = {
        type: PieceType.PAWN,
        color: PieceColor.WHITE,
        hasMoved: true,
        pos: { x: 4, y: 4 },
      };

      game.board[4][4].piece = pawn;
      game.board[5][4].piece = {
        type: PieceType.ROOK,
        color: PieceColor.BLACK,
        pos: { x: 5, y: 4 },
        hasMoved: false,
      };

      const moves = getPawnMoves(game, pawn);
      expect(moves).toEqual([]); // No valid moves
    });

    it("should handle promotion for a pawn reaching the last rank", () => {
      const game = createTestGame();
      const pawn: Piece = {
        type: PieceType.PAWN,
        color: PieceColor.WHITE,
        hasMoved: true,
        pos: { x: 6, y: 4 },
      };

      game.board[6][4].piece = pawn;

      const moves = getPawnMoves(game, pawn);
      expect(moves).toEqual(
        expect.arrayContaining([{ from: { x: 6, y: 4 }, to: { x: 7, y: 4 } }]),
      );
    });
  });
  describe("getRookMoves", () => {
    it("should return all horizontal and vertical moves for an unblocked rook at the center", () => {
      const game = createTestGame();
      const rook: Piece = {
        type: PieceType.ROOK,
        color: PieceColor.WHITE,
        hasMoved: true,
        pos: { x: 4, y: 4 },
      };

      game.board[4][4].piece = rook;

      const moves = getRookMoves(game, rook);

      const expectedMoves = [
        // Horizontal moves
        { from: { x: 4, y: 4 }, to: { x: 4, y: 5 } },
        { from: { x: 4, y: 4 }, to: { x: 4, y: 6 } },
        { from: { x: 4, y: 4 }, to: { x: 4, y: 7 } },
        { from: { x: 4, y: 4 }, to: { x: 4, y: 3 } },
        { from: { x: 4, y: 4 }, to: { x: 4, y: 2 } },
        { from: { x: 4, y: 4 }, to: { x: 4, y: 1 } },
        { from: { x: 4, y: 4 }, to: { x: 4, y: 0 } },
        // Vertical moves
        { from: { x: 4, y: 4 }, to: { x: 5, y: 4 } },
        { from: { x: 4, y: 4 }, to: { x: 6, y: 4 } },
        { from: { x: 4, y: 4 }, to: { x: 7, y: 4 } },
        { from: { x: 4, y: 4 }, to: { x: 3, y: 4 } },
        { from: { x: 4, y: 4 }, to: { x: 2, y: 4 } },
        { from: { x: 4, y: 4 }, to: { x: 1, y: 4 } },
        { from: { x: 4, y: 4 }, to: { x: 0, y: 4 } },
      ];

      expect(moves).toEqual(expect.arrayContaining(expectedMoves));
    });

    it("should stop at squares occupied by pieces of the same color", () => {
      const game = createTestGame();
      const rook: Piece = {
        type: PieceType.ROOK,
        color: PieceColor.WHITE,
        hasMoved: true,
        pos: { x: 4, y: 4 },
      };

      game.board[4][4].piece = rook;
      game.board[4][6].piece = {
        type: PieceType.PAWN,
        color: PieceColor.WHITE,
        hasMoved: false,
        pos: { x: 4, y: 6 },
      };
      game.board[6][4].piece = {
        type: PieceType.PAWN,
        color: PieceColor.WHITE,
        hasMoved: false,
        pos: { x: 6, y: 4 },
      };

      const moves = getRookMoves(game, rook);

      const expectedMoves = [
        // Horizontal moves
        { from: { x: 4, y: 4 }, to: { x: 4, y: 5 } },
        { from: { x: 4, y: 4 }, to: { x: 4, y: 3 } },
        { from: { x: 4, y: 4 }, to: { x: 4, y: 2 } },
        { from: { x: 4, y: 4 }, to: { x: 4, y: 1 } },
        { from: { x: 4, y: 4 }, to: { x: 4, y: 0 } },
        // Vertical moves
        { from: { x: 4, y: 4 }, to: { x: 5, y: 4 } },
        { from: { x: 4, y: 4 }, to: { x: 3, y: 4 } },
        { from: { x: 4, y: 4 }, to: { x: 2, y: 4 } },
        { from: { x: 4, y: 4 }, to: { x: 1, y: 4 } },
        { from: { x: 4, y: 4 }, to: { x: 0, y: 4 } },
      ];

      expect(moves).toEqual(expect.arrayContaining(expectedMoves));
    });

    it("should include capture moves for opposite-colored pieces", () => {
      const game = createTestGame();
      const rook: Piece = {
        type: PieceType.ROOK,
        color: PieceColor.WHITE,
        hasMoved: true,
        pos: { x: 4, y: 4 },
      };

      game.board[4][4].piece = rook;
      game.board[4][6].piece = {
        type: PieceType.PAWN,
        color: PieceColor.BLACK,
        hasMoved: false,
        pos: { x: 4, y: 6 },
      };
      game.board[6][4].piece = {
        type: PieceType.PAWN,
        color: PieceColor.BLACK,
        hasMoved: false,
        pos: { x: 6, y: 4 },
      };

      const moves = getRookMoves(game, rook);

      const expectedMoves = [
        // Horizontal moves
        { from: { x: 4, y: 4 }, to: { x: 4, y: 5 } },
        { from: { x: 4, y: 4 }, to: { x: 4, y: 6 } }, // Capture
        { from: { x: 4, y: 4 }, to: { x: 4, y: 3 } },
        { from: { x: 4, y: 4 }, to: { x: 4, y: 2 } },
        { from: { x: 4, y: 4 }, to: { x: 4, y: 1 } },
        { from: { x: 4, y: 4 }, to: { x: 4, y: 0 } },
        // Vertical moves
        { from: { x: 4, y: 4 }, to: { x: 5, y: 4 } },
        { from: { x: 4, y: 4 }, to: { x: 6, y: 4 } }, // Capture
        { from: { x: 4, y: 4 }, to: { x: 3, y: 4 } },
        { from: { x: 4, y: 4 }, to: { x: 2, y: 4 } },
        { from: { x: 4, y: 4 }, to: { x: 1, y: 4 } },
        { from: { x: 4, y: 4 }, to: { x: 0, y: 4 } },
      ];

      expect(moves).toEqual(expect.arrayContaining(expectedMoves));
    });

    it("should not allow moving through other pieces", () => {
      const game = createTestGame();
      const rook: Piece = {
        type: PieceType.ROOK,
        color: PieceColor.WHITE,
        hasMoved: true,
        pos: { x: 4, y: 4 },
      };

      game.board[4][4].piece = rook;
      game.board[4][6].piece = {
        type: PieceType.PAWN,
        color: PieceColor.WHITE,
        hasMoved: false,
        pos: { x: 4, y: 6 },
      };
      game.board[6][4].piece = {
        type: PieceType.PAWN,
        color: PieceColor.BLACK,
        hasMoved: false,
        pos: { x: 6, y: 4 },
      };

      const moves = getRookMoves(game, rook);

      const expectedMoves = [
        // Horizontal moves
        { from: { x: 4, y: 4 }, to: { x: 4, y: 5 } },
        { from: { x: 4, y: 4 }, to: { x: 4, y: 3 } },
        { from: { x: 4, y: 4 }, to: { x: 4, y: 2 } },
        { from: { x: 4, y: 4 }, to: { x: 4, y: 1 } },
        { from: { x: 4, y: 4 }, to: { x: 4, y: 0 } },
        // Vertical moves
        { from: { x: 4, y: 4 }, to: { x: 5, y: 4 } },
        { from: { x: 4, y: 4 }, to: { x: 3, y: 4 } },
        { from: { x: 4, y: 4 }, to: { x: 2, y: 4 } },
        { from: { x: 4, y: 4 }, to: { x: 1, y: 4 } },
        { from: { x: 4, y: 4 }, to: { x: 0, y: 4 } },
        { from: { x: 4, y: 4 }, to: { x: 6, y: 4 } }, // capture
      ];
      expect(moves).toEqual(expect.arrayContaining(expectedMoves));
    });
  });
  describe("getKnightMoves", () => {
    it("should return all possible moves for a knight", () => {
      const game = createTestGame();
      const knight: Piece = {
        type: PieceType.KNIGHT,
        color: PieceColor.WHITE,
        hasMoved: true,
        pos: { x: 4, y: 4 },
      };
      game.board[4][4].piece = knight;
      const moves = getKnightMoves(game, knight);
      const expectedMoves = [
        { from: { x: 4, y: 4 }, to: { x: 6, y: 5 } },
        { from: { x: 4, y: 4 }, to: { x: 6, y: 3 } },
        { from: { x: 4, y: 4 }, to: { x: 2, y: 5 } },
        { from: { x: 4, y: 4 }, to: { x: 2, y: 3 } },
        { from: { x: 4, y: 4 }, to: { x: 5, y: 6 } },
        { from: { x: 4, y: 4 }, to: { x: 5, y: 2 } },
        { from: { x: 4, y: 4 }, to: { x: 3, y: 6 } },
        { from: { x: 4, y: 4 }, to: { x: 3, y: 2 } },
      ];
      expect(moves).toEqual(expect.arrayContaining(expectedMoves));
    });
    it("should not move outside the board from the corner", () => {
      const game = createTestGame();

      const knight: Piece = {
        type: PieceType.KNIGHT,
        color: PieceColor.WHITE,
        hasMoved: false,
        pos: { x: 0, y: 0 },
      };

      game.board[0][0].piece = knight;

      const moves = getKnightMoves(game, knight);

      const expectedMoves = [
        { from: { x: 0, y: 0 }, to: { x: 2, y: 1 } },
        { from: { x: 0, y: 0 }, to: { x: 1, y: 2 } },
      ];

      expect(moves.length).toBe(expectedMoves.length);
      expect(moves).toEqual(expect.arrayContaining(expectedMoves));
    });

    it("should block movement to squares occupied by same-colored pieces", () => {
      const game = createTestGame();

      const knight: Piece = {
        type: PieceType.KNIGHT,
        color: PieceColor.WHITE,
        hasMoved: false,
        pos: { x: 4, y: 4 },
      };

      const friendlyPiece: Piece = {
        type: PieceType.PAWN,
        color: PieceColor.WHITE,
        hasMoved: false,
        pos: { x: 6, y: 5 },
      };

      game.board[4][4].piece = knight;
      game.board[6][5].piece = friendlyPiece;

      const moves = getKnightMoves(game, knight);

      const expectedMoves = [
        { from: { x: 4, y: 4 }, to: { x: 6, y: 3 } },
        { from: { x: 4, y: 4 }, to: { x: 2, y: 5 } },
        { from: { x: 4, y: 4 }, to: { x: 2, y: 3 } },
        { from: { x: 4, y: 4 }, to: { x: 5, y: 6 } },
        { from: { x: 4, y: 4 }, to: { x: 5, y: 2 } },
        { from: { x: 4, y: 4 }, to: { x: 3, y: 6 } },
        { from: { x: 4, y: 4 }, to: { x: 3, y: 2 } },
      ];

      expect(moves.length).toBe(expectedMoves.length);
      expect(moves).toEqual(expect.arrayContaining(expectedMoves));
    });
    it("should allow captures of opponent pieces", () => {
      const game = createTestGame();

      const knight: Piece = {
        type: PieceType.KNIGHT,
        color: PieceColor.WHITE,
        hasMoved: false,
        pos: { x: 4, y: 4 },
      };

      const enemyPiece: Piece = {
        type: PieceType.PAWN,
        color: PieceColor.BLACK,
        hasMoved: false,
        pos: { x: 6, y: 5 },
      };

      game.board[4][4].piece = knight;
      game.board[6][5].piece = enemyPiece;

      const moves = getKnightMoves(game, knight);

      const expectedMoves = [
        { from: { x: 4, y: 4 }, to: { x: 6, y: 5 } }, // Capture move
        { from: { x: 4, y: 4 }, to: { x: 6, y: 3 } },
        { from: { x: 4, y: 4 }, to: { x: 2, y: 5 } },
        { from: { x: 4, y: 4 }, to: { x: 2, y: 3 } },
        { from: { x: 4, y: 4 }, to: { x: 5, y: 6 } },
        { from: { x: 4, y: 4 }, to: { x: 5, y: 2 } },
        { from: { x: 4, y: 4 }, to: { x: 3, y: 6 } },
        { from: { x: 4, y: 4 }, to: { x: 3, y: 2 } },
      ];

      expect(moves.length).toBe(expectedMoves.length);
      expect(moves).toEqual(expect.arrayContaining(expectedMoves));
    });
  });
  describe("getBishopMoves", () => {
    it("should return all valid diagonal moves from the center of the board", () => {
      const game = createTestGame();

      const bishop: Piece = {
        type: PieceType.BISHOP,
        color: PieceColor.WHITE,
        hasMoved: false,
        pos: { x: 4, y: 4 },
      };

      game.board[4][4].piece = bishop;

      const moves = getBishopMoves(game, bishop);

      const expectedMoves = [
        // Top-right diagonal
        { from: { x: 4, y: 4 }, to: { x: 5, y: 5 } },
        { from: { x: 4, y: 4 }, to: { x: 6, y: 6 } },
        { from: { x: 4, y: 4 }, to: { x: 7, y: 7 } },
        // Bottom-right diagonal
        { from: { x: 4, y: 4 }, to: { x: 3, y: 5 } },
        { from: { x: 4, y: 4 }, to: { x: 2, y: 6 } },
        { from: { x: 4, y: 4 }, to: { x: 1, y: 7 } },
        // Bottom-left diagonal
        { from: { x: 4, y: 4 }, to: { x: 3, y: 3 } },
        { from: { x: 4, y: 4 }, to: { x: 2, y: 2 } },
        { from: { x: 4, y: 4 }, to: { x: 1, y: 1 } },
        { from: { x: 4, y: 4 }, to: { x: 0, y: 0 } },
        // Top-left diagonal
        { from: { x: 4, y: 4 }, to: { x: 5, y: 3 } },
        { from: { x: 4, y: 4 }, to: { x: 6, y: 2 } },
        { from: { x: 4, y: 4 }, to: { x: 7, y: 1 } },
      ];

      expect(moves.length).toBe(expectedMoves.length);
      expect(moves).toEqual(expect.arrayContaining(expectedMoves));
    });

    it("should not move outside the board when near a corner", () => {
      const game = createTestGame();

      const bishop: Piece = {
        type: PieceType.BISHOP,
        color: PieceColor.WHITE,
        hasMoved: false,
        pos: { x: 0, y: 0 },
      };

      game.board[0][0].piece = bishop;

      const moves = getBishopMoves(game, bishop);

      const expectedMoves = [
        { from: { x: 0, y: 0 }, to: { x: 1, y: 1 } },
        { from: { x: 0, y: 0 }, to: { x: 2, y: 2 } },
        { from: { x: 0, y: 0 }, to: { x: 3, y: 3 } },
        { from: { x: 0, y: 0 }, to: { x: 4, y: 4 } },
        { from: { x: 0, y: 0 }, to: { x: 5, y: 5 } },
        { from: { x: 0, y: 0 }, to: { x: 6, y: 6 } },
        { from: { x: 0, y: 0 }, to: { x: 7, y: 7 } },
      ];

      expect(moves.length).toBe(expectedMoves.length);
      expect(moves).toEqual(expect.arrayContaining(expectedMoves));
    });

    it("should stop movement at a friendly piece", () => {
      const game = createTestGame();

      const bishop: Piece = {
        type: PieceType.BISHOP,
        color: PieceColor.WHITE,
        hasMoved: false,
        pos: { x: 4, y: 4 },
      };

      const friendlyPiece: Piece = {
        type: PieceType.PAWN,
        color: PieceColor.WHITE,
        hasMoved: false,
        pos: { x: 6, y: 6 },
      };

      game.board[4][4].piece = bishop;
      game.board[6][6].piece = friendlyPiece;

      const moves = getBishopMoves(game, bishop);

      const expectedMoves = [
        // Top-right diagonal
        { from: { x: 4, y: 4 }, to: { x: 5, y: 5 } },
        // Bottom-right diagonal
        { from: { x: 4, y: 4 }, to: { x: 3, y: 5 } },
        { from: { x: 4, y: 4 }, to: { x: 2, y: 6 } },
        { from: { x: 4, y: 4 }, to: { x: 1, y: 7 } },
        // Bottom-left diagonal
        { from: { x: 4, y: 4 }, to: { x: 3, y: 3 } },
        { from: { x: 4, y: 4 }, to: { x: 2, y: 2 } },
        { from: { x: 4, y: 4 }, to: { x: 1, y: 1 } },
        { from: { x: 4, y: 4 }, to: { x: 0, y: 0 } },
        // Top-left diagonal
        { from: { x: 4, y: 4 }, to: { x: 5, y: 3 } },
        { from: { x: 4, y: 4 }, to: { x: 6, y: 2 } },
        { from: { x: 4, y: 4 }, to: { x: 7, y: 1 } },
      ];

      expect(moves.length).toBe(expectedMoves.length);
      expect(moves).toEqual(expect.arrayContaining(expectedMoves));
    });

    it("should allow capturing an opponent and stop after the captured piece", () => {
      const game = createTestGame();

      const bishop: Piece = {
        type: PieceType.BISHOP,
        color: PieceColor.WHITE,
        hasMoved: false,
        pos: { x: 4, y: 4 },
      };

      const enemyPiece: Piece = {
        type: PieceType.PAWN,
        color: PieceColor.BLACK,
        hasMoved: false,
        pos: { x: 6, y: 6 },
      };

      game.board[4][4].piece = bishop;
      game.board[6][6].piece = enemyPiece;

      const moves = getBishopMoves(game, bishop);

      const expectedMoves = [
        // Top-right diagonal (up-to and including capture)
        { from: { x: 4, y: 4 }, to: { x: 5, y: 5 } },
        { from: { x: 4, y: 4 }, to: { x: 6, y: 6 } }, // Capture move
        // Bottom-right diagonal
        { from: { x: 4, y: 4 }, to: { x: 3, y: 5 } },
        { from: { x: 4, y: 4 }, to: { x: 2, y: 6 } },
        { from: { x: 4, y: 4 }, to: { x: 1, y: 7 } },
        // Bottom-left diagonal
        { from: { x: 4, y: 4 }, to: { x: 3, y: 3 } },
        { from: { x: 4, y: 4 }, to: { x: 2, y: 2 } },
        { from: { x: 4, y: 4 }, to: { x: 1, y: 1 } },
        { from: { x: 4, y: 4 }, to: { x: 0, y: 0 } },
        // Top-left diagonal
        { from: { x: 4, y: 4 }, to: { x: 5, y: 3 } },
        { from: { x: 4, y: 4 }, to: { x: 6, y: 2 } },
        { from: { x: 4, y: 4 }, to: { x: 7, y: 1 } },
      ];

      expect(moves.length).toBe(expectedMoves.length);
      expect(moves).toEqual(expect.arrayContaining(expectedMoves));
    });
  });
  describe("getQueenMoves", () => {
    it("should return all valid moves from the center of the board", () => {
      const game = createTestGame();

      const queen: Piece = {
        type: PieceType.QUEEN,
        color: PieceColor.WHITE,
        hasMoved: false,
        pos: { x: 4, y: 4 },
      };

      game.board[4][4].piece = queen;

      const moves = getQueenMoves(game, queen);

      const expectedMoves = [
        // Horizontal moves
        { from: { x: 4, y: 4 }, to: { x: 4, y: 5 } },
        { from: { x: 4, y: 4 }, to: { x: 4, y: 6 } },
        { from: { x: 4, y: 4 }, to: { x: 4, y: 7 } },
        { from: { x: 4, y: 4 }, to: { x: 4, y: 3 } },
        { from: { x: 4, y: 4 }, to: { x: 4, y: 2 } },
        { from: { x: 4, y: 4 }, to: { x: 4, y: 1 } },
        { from: { x: 4, y: 4 }, to: { x: 4, y: 0 } },
        // Vertical moves
        { from: { x: 4, y: 4 }, to: { x: 5, y: 4 } },
        { from: { x: 4, y: 4 }, to: { x: 6, y: 4 } },
        { from: { x: 4, y: 4 }, to: { x: 7, y: 4 } },
        { from: { x: 4, y: 4 }, to: { x: 3, y: 4 } },
        { from: { x: 4, y: 4 }, to: { x: 2, y: 4 } },
        { from: { x: 4, y: 4 }, to: { x: 1, y: 4 } },
        { from: { x: 4, y: 4 }, to: { x: 0, y: 4 } },
        // Diagonal top-right
        { from: { x: 4, y: 4 }, to: { x: 5, y: 5 } },
        { from: { x: 4, y: 4 }, to: { x: 6, y: 6 } },
        { from: { x: 4, y: 4 }, to: { x: 7, y: 7 } },
        // Diagonal bottom-right
        { from: { x: 4, y: 4 }, to: { x: 3, y: 5 } },
        { from: { x: 4, y: 4 }, to: { x: 2, y: 6 } },
        { from: { x: 4, y: 4 }, to: { x: 1, y: 7 } },
        // Diagonal bottom-left
        { from: { x: 4, y: 4 }, to: { x: 3, y: 3 } },
        { from: { x: 4, y: 4 }, to: { x: 2, y: 2 } },
        { from: { x: 4, y: 4 }, to: { x: 1, y: 1 } },
        { from: { x: 4, y: 4 }, to: { x: 0, y: 0 } },
        // Diagonal top-left
        { from: { x: 4, y: 4 }, to: { x: 5, y: 3 } },
        { from: { x: 4, y: 4 }, to: { x: 6, y: 2 } },
        { from: { x: 4, y: 4 }, to: { x: 7, y: 1 } },
      ];

      expect(moves.length).toBe(expectedMoves.length);
      expect(moves).toEqual(expect.arrayContaining(expectedMoves));
    });

    it("should not move outside the board near corners", () => {
      const game = createTestGame();

      const queen: Piece = {
        type: PieceType.QUEEN,
        color: PieceColor.WHITE,
        hasMoved: false,
        pos: { x: 0, y: 0 },
      };

      game.board[0][0].piece = queen;

      const moves = getQueenMoves(game, queen);

      const expectedMoves = [
        // Horizontal moves
        { from: { x: 0, y: 0 }, to: { x: 0, y: 1 } },
        { from: { x: 0, y: 0 }, to: { x: 0, y: 2 } },
        { from: { x: 0, y: 0 }, to: { x: 0, y: 3 } },
        { from: { x: 0, y: 0 }, to: { x: 0, y: 4 } },
        { from: { x: 0, y: 0 }, to: { x: 0, y: 5 } },
        { from: { x: 0, y: 0 }, to: { x: 0, y: 6 } },
        { from: { x: 0, y: 0 }, to: { x: 0, y: 7 } },
        // Vertical moves
        { from: { x: 0, y: 0 }, to: { x: 1, y: 0 } },
        { from: { x: 0, y: 0 }, to: { x: 2, y: 0 } },
        { from: { x: 0, y: 0 }, to: { x: 3, y: 0 } },
        { from: { x: 0, y: 0 }, to: { x: 4, y: 0 } },
        { from: { x: 0, y: 0 }, to: { x: 5, y: 0 } },
        { from: { x: 0, y: 0 }, to: { x: 6, y: 0 } },
        { from: { x: 0, y: 0 }, to: { x: 7, y: 0 } },
        // Diagonal moves
        { from: { x: 0, y: 0 }, to: { x: 1, y: 1 } },
        { from: { x: 0, y: 0 }, to: { x: 2, y: 2 } },
        { from: { x: 0, y: 0 }, to: { x: 3, y: 3 } },
        { from: { x: 0, y: 0 }, to: { x: 4, y: 4 } },
        { from: { x: 0, y: 0 }, to: { x: 5, y: 5 } },
        { from: { x: 0, y: 0 }, to: { x: 6, y: 6 } },
        { from: { x: 0, y: 0 }, to: { x: 7, y: 7 } },
      ];

      expect(moves.length).toBe(expectedMoves.length);
      expect(moves).toEqual(expect.arrayContaining(expectedMoves));
    });
    it("should stop at friendly pieces and not move past them", () => {
      const game = createTestGame();

      const queen: Piece = {
        type: PieceType.QUEEN,
        color: PieceColor.WHITE,
        hasMoved: false,
        pos: { x: 4, y: 4 },
      };

      const friendlyPiece: Piece = {
        type: PieceType.PAWN,
        color: PieceColor.WHITE,
        hasMoved: false,
        pos: { x: 6, y: 4 },
      };

      game.board[4][4].piece = queen;
      game.board[6][4].piece = friendlyPiece;

      const moves = getQueenMoves(game, queen);

      const expectedMoves = [
        // Vertical moves (up to but not including friendly piece at x:6)
        { from: { x: 4, y: 4 }, to: { x: 5, y: 4 } },
        { from: { x: 4, y: 4 }, to: { x: 3, y: 4 } },
        { from: { x: 4, y: 4 }, to: { x: 2, y: 4 } },
        { from: { x: 4, y: 4 }, to: { x: 1, y: 4 } },
        { from: { x: 4, y: 4 }, to: { x: 0, y: 4 } },
        // Horizontal moves
        { from: { x: 4, y: 4 }, to: { x: 4, y: 5 } },
        { from: { x: 4, y: 4 }, to: { x: 4, y: 6 } },
        { from: { x: 4, y: 4 }, to: { x: 4, y: 7 } },
        { from: { x: 4, y: 4 }, to: { x: 4, y: 3 } },
        { from: { x: 4, y: 4 }, to: { x: 4, y: 2 } },
        { from: { x: 4, y: 4 }, to: { x: 4, y: 1 } },
        { from: { x: 4, y: 4 }, to: { x: 4, y: 0 } },
        // Diagonal moves
        { from: { x: 4, y: 4 }, to: { x: 5, y: 5 } },
        { from: { x: 4, y: 4 }, to: { x: 6, y: 6 } },
        { from: { x: 4, y: 4 }, to: { x: 7, y: 7 } },
        { from: { x: 4, y: 4 }, to: { x: 3, y: 5 } },
        { from: { x: 4, y: 4 }, to: { x: 2, y: 6 } },
        { from: { x: 4, y: 4 }, to: { x: 1, y: 7 } },
        { from: { x: 4, y: 4 }, to: { x: 3, y: 3 } },
        { from: { x: 4, y: 4 }, to: { x: 2, y: 2 } },
        { from: { x: 4, y: 4 }, to: { x: 1, y: 1 } },
        { from: { x: 4, y: 4 }, to: { x: 0, y: 0 } },
        { from: { x: 4, y: 4 }, to: { x: 5, y: 3 } },
        { from: { x: 4, y: 4 }, to: { x: 6, y: 2 } },
        { from: { x: 4, y: 4 }, to: { x: 7, y: 1 } },
      ];

      const extraMoves = findExtraMoves(moves, expectedMoves);
      expect(extraMoves.length).toBe(0);
      expect(moves).toEqual(expect.arrayContaining(expectedMoves));
      expect(moves.length).toBe(expectedMoves.length);
    });
    it("should allow capturing an opponent piece and stop after the capture", () => {
      const game = createTestGame();

      const queen: Piece = {
        type: PieceType.QUEEN,
        color: PieceColor.WHITE,
        hasMoved: false,
        pos: { x: 4, y: 4 },
      };

      const enemyPiece: Piece = {
        type: PieceType.PAWN,
        color: PieceColor.BLACK,
        hasMoved: false,
        pos: { x: 6, y: 6 },
      };

      game.board[4][4].piece = queen;
      game.board[6][6].piece = enemyPiece;

      const moves = getQueenMoves(game, queen);

      const expectedMoves = [
        // Diagonal moves toward the enemy piece (stopping at the enemy piece)
        { from: { x: 4, y: 4 }, to: { x: 5, y: 5 } },
        { from: { x: 4, y: 4 }, to: { x: 6, y: 6 } }, // Capture move
        // Other diagonal moves
        { from: { x: 4, y: 4 }, to: { x: 3, y: 5 } },
        { from: { x: 4, y: 4 }, to: { x: 2, y: 6 } },
        { from: { x: 4, y: 4 }, to: { x: 1, y: 7 } },
        { from: { x: 4, y: 4 }, to: { x: 3, y: 3 } },
        { from: { x: 4, y: 4 }, to: { x: 2, y: 2 } },
        { from: { x: 4, y: 4 }, to: { x: 1, y: 1 } },
        { from: { x: 4, y: 4 }, to: { x: 0, y: 0 } },
        // Horizontal and vertical moves
        { from: { x: 4, y: 4 }, to: { x: 4, y: 5 } },
        { from: { x: 4, y: 4 }, to: { x: 4, y: 6 } },
        { from: { x: 4, y: 4 }, to: { x: 4, y: 7 } },
        { from: { x: 4, y: 4 }, to: { x: 4, y: 3 } },
        { from: { x: 4, y: 4 }, to: { x: 4, y: 2 } },
        { from: { x: 4, y: 4 }, to: { x: 4, y: 1 } },
        { from: { x: 4, y: 4 }, to: { x: 4, y: 0 } },
        { from: { x: 4, y: 4 }, to: { x: 5, y: 4 } },
        { from: { x: 4, y: 4 }, to: { x: 6, y: 4 } },
        { from: { x: 4, y: 4 }, to: { x: 7, y: 4 } },
        // extra
        { from: { x: 4, y: 4 }, to: { x: 5, y: 3 } },
        { from: { x: 4, y: 4 }, to: { x: 6, y: 2 } },
        { from: { x: 4, y: 4 }, to: { x: 7, y: 1 } },
        { from: { x: 4, y: 4 }, to: { x: 3, y: 4 } },
        { from: { x: 4, y: 4 }, to: { x: 2, y: 4 } },
        { from: { x: 4, y: 4 }, to: { x: 1, y: 4 } },
        { from: { x: 4, y: 4 }, to: { x: 0, y: 4 } },
      ];
      const extraMoves = findExtraMoves(moves, expectedMoves);
      expect(extraMoves.length).toBe(0);
      expect(moves).toEqual(expect.arrayContaining(expectedMoves));
      expect(moves.length).toBe(expectedMoves.length);
    });
  });
  describe("getKnightMoves", () => {
    it("should return all valid moves for a king in the center of the board", () => {
      const game = createTestGame();

      const king: Piece = {
        type: PieceType.KING,
        color: PieceColor.WHITE,
        hasMoved: false,
        pos: { x: 4, y: 4 },
      };

      game.board[4][4].piece = king;

      const moves = getKingMoves(game, king);

      const expectedMoves = [
        { from: { x: 4, y: 4 }, to: { x: 3, y: 3 } },
        { from: { x: 4, y: 4 }, to: { x: 3, y: 4 } },
        { from: { x: 4, y: 4 }, to: { x: 3, y: 5 } },
        { from: { x: 4, y: 4 }, to: { x: 4, y: 3 } },
        { from: { x: 4, y: 4 }, to: { x: 4, y: 5 } },
        { from: { x: 4, y: 4 }, to: { x: 5, y: 3 } },
        { from: { x: 4, y: 4 }, to: { x: 5, y: 4 } },
        { from: { x: 4, y: 4 }, to: { x: 5, y: 5 } },
      ];

      expect(moves.length).toBe(expectedMoves.length);
      expect(moves).toEqual(expect.arrayContaining(expectedMoves));
    });
    it("should not move outside the board near the top-left corner", () => {
      const game = createTestGame();

      const king: Piece = {
        type: PieceType.KING,
        color: PieceColor.WHITE,
        hasMoved: false,
        pos: { x: 0, y: 0 },
      };

      game.board[0][0].piece = king;

      const moves = getKingMoves(game, king);

      const expectedMoves = [
        { from: { x: 0, y: 0 }, to: { x: 0, y: 1 } },
        { from: { x: 0, y: 0 }, to: { x: 1, y: 0 } },
        { from: { x: 0, y: 0 }, to: { x: 1, y: 1 } },
      ];

      expect(moves.length).toBe(expectedMoves.length);
      expect(moves).toEqual(expect.arrayContaining(expectedMoves));
    });
    it("should stop at friendly pieces and not capture them", () => {
      const game = createTestGame();

      const king: Piece = {
        type: PieceType.KING,
        color: PieceColor.WHITE,
        hasMoved: false,
        pos: { x: 4, y: 4 },
      };

      const friendlyPiece: Piece = {
        type: PieceType.PAWN,
        color: PieceColor.WHITE,
        hasMoved: true,
        pos: { x: 4, y: 5 },
      };

      game.board[4][4].piece = king;
      game.board[4][5].piece = friendlyPiece;

      const moves = getKingMoves(game, king);

      const expectedMoves = [
        { from: { x: 4, y: 4 }, to: { x: 3, y: 3 } },
        { from: { x: 4, y: 4 }, to: { x: 3, y: 4 } },
        { from: { x: 4, y: 4 }, to: { x: 3, y: 5 } },
        { from: { x: 4, y: 4 }, to: { x: 4, y: 3 } },
        { from: { x: 4, y: 4 }, to: { x: 5, y: 3 } },
        { from: { x: 4, y: 4 }, to: { x: 5, y: 4 } },
        { from: { x: 4, y: 4 }, to: { x: 5, y: 5 } },
      ]; // Excluding x:4, y:5 because of friendly piece

      expect(moves.length).toBe(expectedMoves.length);
      expect(moves).toEqual(expect.arrayContaining(expectedMoves));
    });
    it("should capture an opponent piece", () => {
      const game = createTestGame();

      const king: Piece = {
        type: PieceType.KING,
        color: PieceColor.WHITE,
        hasMoved: false,
        pos: { x: 4, y: 4 },
      };

      const enemyPiece: Piece = {
        type: PieceType.PAWN,
        color: PieceColor.BLACK,
        hasMoved: false,
        pos: { x: 4, y: 5 },
      };

      game.board[4][4].piece = king;
      game.board[4][5].piece = enemyPiece;

      const moves = getKingMoves(game, king);

      const expectedMoves = [
        { from: { x: 4, y: 4 }, to: { x: 3, y: 3 } },
        { from: { x: 4, y: 4 }, to: { x: 3, y: 4 } },
        { from: { x: 4, y: 4 }, to: { x: 3, y: 5 } },
        { from: { x: 4, y: 4 }, to: { x: 4, y: 3 } },
        { from: { x: 4, y: 4 }, to: { x: 4, y: 5 } }, // Capturing enemy piece
        { from: { x: 4, y: 4 }, to: { x: 5, y: 3 } },
        { from: { x: 4, y: 4 }, to: { x: 5, y: 4 } },
        { from: { x: 4, y: 4 }, to: { x: 5, y: 5 } },
      ];

      expect(moves.length).toBe(expectedMoves.length);
      expect(moves).toEqual(expect.arrayContaining(expectedMoves));
    });
  });
  describe("getAllPossibleBasicMoves", () => {
    it("should return no moves if the player has no pieces left", () => {
      const game = createTestGame();

      const moves = getAllPossibleBasicMoves(game);

      expect(moves).toHaveLength(0);
    });
    it("should return all possible moves for a piece", () => {
      const game = createTestGame();

      game.board[4][4].piece = {
        type: PieceType.PAWN,
        color: PieceColor.WHITE,
        hasMoved: true,
        pos: { x: 4, y: 4 },
      };

      const moves = getAllPossibleBasicMoves(game);
      const expectedMoves: Move[] = [
        { from: { x: 4, y: 4 }, to: { x: 5, y: 4 } },
      ];

      expect(moves).toHaveLength(expectedMoves.length);
      expect(moves).toEqual(expect.arrayContaining(expectedMoves));
    });

    it("should no moves if the piece is blocked", () => {
      const game = createTestGame();

      game.board[4][4].piece = {
        type: PieceType.PAWN,
        color: PieceColor.WHITE,
        hasMoved: true,
        pos: { x: 4, y: 4 },
      };

      game.board[5][4].piece = {
        type: PieceType.PAWN,
        color: PieceColor.BLACK,
        hasMoved: true,
        pos: { x: 5, y: 4 },
      };

      const moves = getAllPossibleBasicMoves(game);

      expect(moves).toHaveLength(0);
    });
    it("should return all possible moves for multiple pieces", () => {
      const game = createTestGame();

      game.board[4][4].piece = {
        type: PieceType.PAWN,
        color: PieceColor.WHITE,
        hasMoved: true,
        pos: { x: 4, y: 4 },
      };
      game.board[1][0].piece = {
        type: PieceType.PAWN,
        color: PieceColor.WHITE,
        hasMoved: false,
        pos: { x: 1, y: 0 },
      };

      game.board[5][4].piece = {
        type: PieceType.PAWN,
        color: PieceColor.BLACK,
        hasMoved: true,
        pos: { x: 5, y: 4 },
      };
      // available for capture
      game.board[5][5].piece = {
        type: PieceType.PAWN,
        color: PieceColor.BLACK,
        hasMoved: true,
        pos: { x: 5, y: 5 },
      };

      const moves = getAllPossibleBasicMoves(game);
      const expectedMoves: Move[] = [
        // capture move
        { from: { x: 4, y: 4 }, to: { x: 5, y: 5 } },
        // other pawn
        { from: { x: 1, y: 0 }, to: { x: 2, y: 0 } },
        { from: { x: 1, y: 0 }, to: { x: 3, y: 0 } },
      ];

      expect(moves).toHaveLength(expectedMoves.length);
      expect(moves).toEqual(expect.arrayContaining(expectedMoves));
    });
  });
});

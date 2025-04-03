import {
  ChessGame,
  getCleanBoard,
  getPawnMoves,
  getPieceString,
  getRookMoves,
  Piece,
  PieceColor,
  PieceType,
  setupInitialPositions,
  Square,
} from "@/engine/chess";

const createTestGame = (overrides?: Partial<ChessGame>): ChessGame => ({
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

  ...overrides,
});

describe("chess", () => {
  describe("getCleanBoard", () => {
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
  describe("setupInitialPositions", () => {
    it("should correctly set up pawns", () => {
      const board = setupInitialPositions();

      // Verify white pawns
      for (let y = 0; y < 8; y++) {
        expect(board[1][y].piece).toEqual({
          type: PieceType.PAWN,
          color: PieceColor.WHITE,
          captured: false,
          pos: { x: 1, y },
        });
      }

      // Verify black pawns
      for (let y = 0; y < 8; y++) {
        expect(board[6][y].piece).toEqual({
          type: PieceType.PAWN,
          color: PieceColor.BLACK,
          captured: false,
          pos: { x: 6, y },
        });
      }
    });

    it("should correctly set up rooks", () => {
      const board = setupInitialPositions();

      // Verify white rooks
      expect(board[0][0].piece).toEqual({
        type: PieceType.ROOK,
        color: PieceColor.WHITE,
        captured: false,
        pos: { x: 0, y: 0 },
      });
      expect(board[0][7].piece).toEqual({
        type: PieceType.ROOK,
        color: PieceColor.WHITE,
        captured: false,
        pos: { x: 0, y: 7 },
      });

      // Verify black rooks
      expect(board[7][0].piece).toEqual({
        type: PieceType.ROOK,
        color: PieceColor.BLACK,
        captured: false,
        pos: { x: 7, y: 0 },
      });
      expect(board[7][7].piece).toEqual({
        type: PieceType.ROOK,
        color: PieceColor.BLACK,
        captured: false,
        pos: { x: 7, y: 7 },
      });
    });

    it("should correctly set up knights", () => {
      const board = setupInitialPositions();

      // Verify white knights
      expect(board[0][1].piece).toEqual({
        type: PieceType.KNIGHT,
        color: PieceColor.WHITE,
        captured: false,
        pos: { x: 0, y: 1 },
      });
      expect(board[0][6].piece).toEqual({
        type: PieceType.KNIGHT,
        color: PieceColor.WHITE,
        captured: false,
        pos: { x: 0, y: 6 },
      });

      // Verify black knights
      expect(board[7][1].piece).toEqual({
        type: PieceType.KNIGHT,
        color: PieceColor.BLACK,
        captured: false,
        pos: { x: 7, y: 1 },
      });
      expect(board[7][6].piece).toEqual({
        type: PieceType.KNIGHT,
        color: PieceColor.BLACK,
        captured: false,
        pos: { x: 7, y: 6 },
      });
    });

    it("should correctly set up bishops", () => {
      const board = setupInitialPositions();

      // Verify white bishops
      expect(board[0][2].piece).toEqual({
        type: PieceType.BISHOP,
        color: PieceColor.WHITE,
        captured: false,
        pos: { x: 0, y: 2 },
      });
      expect(board[0][5].piece).toEqual({
        type: PieceType.BISHOP,
        color: PieceColor.WHITE,
        captured: false,
        pos: { x: 0, y: 5 },
      });

      // Verify black bishops
      expect(board[7][2].piece).toEqual({
        type: PieceType.BISHOP,
        color: PieceColor.BLACK,
        captured: false,
        pos: { x: 7, y: 2 },
      });
      expect(board[7][5].piece).toEqual({
        type: PieceType.BISHOP,
        color: PieceColor.BLACK,
        captured: false,
        pos: { x: 7, y: 5 },
      });
    });

    it("should correctly set up queens", () => {
      const board = setupInitialPositions();

      // Verify white queen
      expect(board[0][3].piece).toEqual({
        type: PieceType.QUEEN,
        color: PieceColor.WHITE,
        captured: false,
        pos: { x: 0, y: 3 },
      });

      // Verify black queen
      expect(board[7][3].piece).toEqual({
        type: PieceType.QUEEN,
        color: PieceColor.BLACK,
        captured: false,
        pos: { x: 7, y: 3 },
      });
    });

    it("should correctly set up kings", () => {
      const board = setupInitialPositions();

      // Verify white king
      expect(board[0][4].piece).toEqual({
        type: PieceType.KING,
        color: PieceColor.WHITE,
        captured: false,
        pos: { x: 0, y: 4 },
      });

      // Verify black king
      expect(board[7][4].piece).toEqual({
        type: PieceType.KING,
        color: PieceColor.BLACK,
        captured: false,
        pos: { x: 7, y: 4 },
      });
    });

    it("should have the rest of the squares empty", () => {
      const board = setupInitialPositions();

      // Check empty squares
      for (let x = 2; x <= 5; x++) {
        for (let y = 0; y < 8; y++) {
          expect(board[x][y].piece).toBeNull();
        }
      }
    });
  });
  describe("getPieceString", () => {
    it("should return an empty string for null input", () => {
      expect(getPieceString(null)).toBe(" ");
    });

    it("should correctly return string representation for a white pawn", () => {
      const piece: Piece = {
        type: PieceType.PAWN,
        color: PieceColor.WHITE,
        pos: { x: 1, y: 1 },
        hasMoved: false,
      };
      expect(getPieceString(piece)).toBe("P");
    });

    it("should correctly return string representation for a black pawn", () => {
      const piece: Piece = {
        type: PieceType.PAWN,
        color: PieceColor.BLACK,
        pos: { x: 6, y: 6 },
        hasMoved: true,
      };
      expect(getPieceString(piece)).toBe("p");
    });

    it("should correctly return string for white knight", () => {
      const piece: Piece = {
        type: PieceType.KNIGHT,
        color: PieceColor.WHITE,
        pos: { x: 0, y: 1 },
        hasMoved: false,
        captured: false,
      };
      expect(getPieceString(piece)).toBe("N");
    });

    it("should correctly return string for black knight", () => {
      const piece: Piece = {
        type: PieceType.KNIGHT,
        color: PieceColor.BLACK,
        pos: { x: 7, y: 6 },
        hasMoved: true,
      };
      expect(getPieceString(piece)).toBe("n");
    });

    it("should return correct representation for all remaining piece types (both colors)", () => {
      const data = [
        { type: PieceType.BISHOP, color: PieceColor.WHITE, expected: "B" },
        { type: PieceType.BISHOP, color: PieceColor.BLACK, expected: "b" },
        { type: PieceType.ROOK, color: PieceColor.WHITE, expected: "R" },
        { type: PieceType.ROOK, color: PieceColor.BLACK, expected: "r" },
        { type: PieceType.QUEEN, color: PieceColor.WHITE, expected: "Q" },
        { type: PieceType.QUEEN, color: PieceColor.BLACK, expected: "q" },
        { type: PieceType.KING, color: PieceColor.WHITE, expected: "K" },
        { type: PieceType.KING, color: PieceColor.BLACK, expected: "k" },
      ];

      data.forEach(({ type, color, expected }) => {
        const piece: Piece = {
          type,
          color,
          pos: { x: 0, y: 0 },
          hasMoved: false,
        };
        expect(getPieceString(piece)).toBe(expected);
      });
    });
  });
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

    it("should prevent white pawn movement or capture if not white's turn", () => {
      const game = createTestGame();
      game.toPlay = PieceColor.BLACK; // Black's turn
      const pawn: Piece = {
        type: PieceType.PAWN,
        color: PieceColor.WHITE,
        hasMoved: true,
        pos: { x: 4, y: 4 },
      };

      game.board[4][4].piece = pawn;

      const moves = getPawnMoves(game, pawn);
      expect(moves).toEqual([]); // Pawn cannot move out of turn
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
});

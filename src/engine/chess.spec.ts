import { produce } from "immer";
import {
  createNewChessGame,
  getCleanBoard,
  setupInitialPositions,
  validateMove,
  movePiece,
} from "@/engine/chess";
import { Move, Piece, PieceColor, PieceType, Square } from "./types";

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
  describe("createNewChessGame", () => {
    it("should create a new game without an error", () => {
      createNewChessGame();
    });
  });
  describe("validateMove", () => {
    it("should return true if the move is valid", () => {
      const game = createNewChessGame();
      const move: Move = {
        from: { x: 1, y: 1 },
        to: { x: 2, y: 1 },
      };
      const result = validateMove(game, move, PieceColor.WHITE);
      expect(result).toBe(true);
    });
  });
  describe("castling", () => {
    it("should initialize castling rights correctly", () => {
      const game = createNewChessGame();
      expect(game.castlingRights.whiteKingside).toBe(true);
      expect(game.castlingRights.whiteQueenside).toBe(true);
      expect(game.castlingRights.blackKingside).toBe(true);
      expect(game.castlingRights.blackQueenside).toBe(true);
    });

    it("should allow white kingside castling when conditions are met", () => {
      const game = createNewChessGame();
      // Clear the path for castling
      const modifiedGame = produce(game, (draft) => {
        draft.board[0][5].piece = null;
        draft.board[0][6].piece = null;
      });
      
      const move: Move = {
        from: { x: 0, y: 4 },
        to: { x: 0, y: 6 },
        isCastling: true,
        castlingType: 'kingside',
      };

      const newGame = movePiece(modifiedGame, move);
      expect(newGame).not.toBe(modifiedGame);
      expect(newGame.board[0][6].piece?.type).toBe(PieceType.KING);
      expect(newGame.board[0][5].piece?.type).toBe(PieceType.ROOK);
      expect(newGame.castlingRights.whiteKingside).toBe(false);
      expect(newGame.castlingRights.whiteQueenside).toBe(false);
      expect(newGame.moves).toHaveLength(1);
      expect(newGame.lastMove).toEqual(move);
    });

    it("should allow white queenside castling when conditions are met", () => {
      const game = createNewChessGame();
      // Clear the path for castling
      const modifiedGame = produce(game, (draft) => {
        draft.board[0][1].piece = null;
        draft.board[0][2].piece = null;
        draft.board[0][3].piece = null;
      });
      
      const move: Move = {
        from: { x: 0, y: 4 },
        to: { x: 0, y: 2 },
        isCastling: true,
        castlingType: 'queenside',
      };

      const newGame = movePiece(modifiedGame, move);
      expect(newGame).not.toBe(modifiedGame);
      expect(newGame.board[0][2].piece?.type).toBe(PieceType.KING);
      expect(newGame.board[0][3].piece?.type).toBe(PieceType.ROOK);
      expect(newGame.castlingRights.whiteKingside).toBe(false);
      expect(newGame.castlingRights.whiteQueenside).toBe(false);
      expect(newGame.moves).toHaveLength(1);
      expect(newGame.lastMove).toEqual(move);
    });

    it("should allow black kingside castling when conditions are met", () => {
      const game = createNewChessGame();
      const modifiedGame = produce(game, (draft) => {
        draft.toPlay = PieceColor.BLACK;
        draft.board[7][5].piece = null;
        draft.board[7][6].piece = null;
      });
      
      const move: Move = {
        from: { x: 7, y: 4 },
        to: { x: 7, y: 6 },
        isCastling: true,
        castlingType: 'kingside',
      };

      const newGame = movePiece(modifiedGame, move);
      expect(newGame).not.toBe(modifiedGame);
      expect(newGame.board[7][6].piece?.type).toBe(PieceType.KING);
      expect(newGame.board[7][5].piece?.type).toBe(PieceType.ROOK);
      expect(newGame.castlingRights.blackKingside).toBe(false);
      expect(newGame.castlingRights.blackQueenside).toBe(false);
      expect(newGame.moves).toHaveLength(1);
      expect(newGame.lastMove).toEqual(move);
    });

    it("should allow black queenside castling when conditions are met", () => {
      const game = createNewChessGame();
      const modifiedGame = produce(game, (draft) => {
        draft.toPlay = PieceColor.BLACK;
        draft.board[7][1].piece = null;
        draft.board[7][2].piece = null;
        draft.board[7][3].piece = null;
      });
      
      const move: Move = {
        from: { x: 7, y: 4 },
        to: { x: 7, y: 2 },
        isCastling: true,
        castlingType: 'queenside',
      };

      const newGame = movePiece(modifiedGame, move);
      expect(newGame).not.toBe(modifiedGame);
      expect(newGame.board[7][2].piece?.type).toBe(PieceType.KING);
      expect(newGame.board[7][3].piece?.type).toBe(PieceType.ROOK);
      expect(newGame.castlingRights.blackKingside).toBe(false);
      expect(newGame.castlingRights.blackQueenside).toBe(false);
      expect(newGame.moves).toHaveLength(1);
      expect(newGame.lastMove).toEqual(move);
    });

    it("should not allow castling if king has moved", () => {
      const game = createNewChessGame();
      const modifiedGame = produce(game, (draft) => {
        const king = draft.board[0][4].piece;
        if (king) {
          king.hasMoved = true;
          draft.board[0][4].piece = king;
        }
      });
      
      const move: Move = {
        from: { x: 0, y: 4 },
        to: { x: 0, y: 6 },
        isCastling: true,
        castlingType: 'kingside',
      };

      const newGame = movePiece(modifiedGame, move);
      expect(newGame).not.toBe(modifiedGame);
      expect(newGame.board[0][4].piece?.hasMoved).toBe(true);
      expect(newGame.board[0][6].piece).toBeNull();
      expect(newGame.moves).toHaveLength(0);
      expect(newGame.lastMove).toBeNull();
      expect(newGame.castlingRights.whiteKingside).toBe(true);
      expect(newGame.castlingRights.whiteQueenside).toBe(true);
    });

    it("should not allow castling if rook has moved", () => {
      const game = createNewChessGame();
      const modifiedGame = produce(game, (draft) => {
        const rook = draft.board[0][7].piece;
        if (rook) {
          rook.hasMoved = true;
          draft.board[0][7].piece = rook;
        }
      });
      
      const move: Move = {
        from: { x: 0, y: 4 },
        to: { x: 0, y: 6 },
        isCastling: true,
        castlingType: 'kingside',
      };

      const newGame = movePiece(modifiedGame, move);
      expect(newGame).not.toBe(modifiedGame);
      expect(newGame.board[0][7].piece?.hasMoved).toBe(true);
      expect(newGame.board[0][6].piece).toBeNull();
      expect(newGame.moves).toHaveLength(0);
      expect(newGame.lastMove).toBeNull();
      expect(newGame.castlingRights.whiteKingside).toBe(true);
      expect(newGame.castlingRights.whiteQueenside).toBe(true);
    });

    it("should not allow castling if path is blocked", () => {
      const game = createNewChessGame();
      const modifiedGame = produce(game, (draft) => {
        draft.board[0][5].piece = {
          type: PieceType.BISHOP,
          color: PieceColor.WHITE,
          pos: { x: 0, y: 5 },
          hasMoved: false,
          captured: false,
        };
      });
      
      const move: Move = {
        from: { x: 0, y: 4 },
        to: { x: 0, y: 6 },
        isCastling: true,
        castlingType: 'kingside',
      };

      const newGame = movePiece(modifiedGame, move);
      expect(newGame).not.toBe(modifiedGame);
      expect(newGame.board[0][4].piece?.type).toBe(PieceType.KING);
      expect(newGame.board[0][6].piece).toBeNull();
      expect(newGame.moves).toHaveLength(0);
      expect(newGame.lastMove).toBeNull();
      expect(newGame.castlingRights.whiteKingside).toBe(true);
      expect(newGame.castlingRights.whiteQueenside).toBe(true);
    });

    it("should execute castling correctly", () => {
      const game = createNewChessGame();
      const modifiedGame = produce(game, (draft) => {
        draft.board[0][5].piece = null;
        draft.board[0][6].piece = null;
      });
      
      const move: Move = {
        from: { x: 0, y: 4 },
        to: { x: 0, y: 6 },
        isCastling: true,
        castlingType: 'kingside',
      };

      const newGame = movePiece(modifiedGame, move);
      expect(newGame).not.toBe(modifiedGame);
      
      // Check king position
      expect(newGame.board[0][6].piece?.type).toBe(PieceType.KING);
      expect(newGame.board[0][6].piece?.color).toBe(PieceColor.WHITE);
      expect(newGame.board[0][6].piece?.hasMoved).toBe(true);
      
      // Check rook position
      expect(newGame.board[0][5].piece?.type).toBe(PieceType.ROOK);
      expect(newGame.board[0][5].piece?.color).toBe(PieceColor.WHITE);
      expect(newGame.board[0][5].piece?.hasMoved).toBe(true);
      
      // Check original positions are empty
      expect(newGame.board[0][4].piece).toBeNull();
      expect(newGame.board[0][7].piece).toBeNull();
      
      // Check castling rights are updated
      expect(newGame.castlingRights.whiteKingside).toBe(false);
      expect(newGame.castlingRights.whiteQueenside).toBe(false);
      
      // Check move history
      expect(newGame.moves).toHaveLength(1);
      expect(newGame.lastMove).toEqual(move);
    });
  });
});

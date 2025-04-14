import {createNewChessGame, getCleanBoard, setupInitialPositions} from "@/engine/chess";
import { getPieceString } from "@/engine/utils";
import { Piece, PieceColor, PieceType, Square } from "./types";

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
    })
  })
});

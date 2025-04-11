import { getPieceString } from "@/engine/utils";
import { Piece, PieceColor, PieceType } from "@/engine/types";
describe("utils", () => {
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
});

import { Piece } from "@/engine/piece";
import { PieceColor, PieceType } from "@/engine/types";

export class Rook extends Piece {
  constructor(color: PieceColor) {
    super(color, PieceType.ROOK);
  }

  public toString(): string {
    switch (this.color) {
      case PieceColor.WHITE:
        return "R";
      case PieceColor.BLACK:
        return "r";
      default:
        throw new Error("Invalid color");
    }
  }
}

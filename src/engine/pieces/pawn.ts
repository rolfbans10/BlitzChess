import { Piece } from "@/engine/piece";
import { PieceColor, PieceType } from "@/engine/types";

export class Pawn extends Piece {
  constructor(color: PieceColor) {
    super(color, PieceType.PAWN);
  }

  public toString(): string {
    switch (this.color) {
      case PieceColor.WHITE:
        return "P";
      case PieceColor.BLACK:
        return "p";
      default:
        throw new Error("Invalid color");
    }
  }
}

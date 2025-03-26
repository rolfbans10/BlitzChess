import { Piece } from "@/engine/piece";
import { PieceColor, PieceType } from "@/engine/types";

export class Bishop extends Piece {
  constructor(color: PieceColor) {
    super(color, PieceType.BISHOP);
  }

  public toString(): string {
    switch (this.color) {
      case PieceColor.WHITE:
        return "B";
      case PieceColor.BLACK:
        return "b";
      default:
        throw new Error("Invalid color");
    }
  }
}

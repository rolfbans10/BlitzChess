import { Piece } from "@/engine/piece";
import { PieceColor, PieceType } from "@/engine/types";

export class Queen extends Piece {
  constructor(color: PieceColor) {
    super(color, PieceType.QUEEN);
  }

  public toString(): string {
    switch (this.color) {
      case PieceColor.WHITE:
        return "Q";
      case PieceColor.BLACK:
        return "q";
      default:
        throw new Error("Invalid color");
    }
  }
}

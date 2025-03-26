import { Piece } from "@/engine/piece";
import { PieceColor, PieceType } from "@/engine/types";

export class King extends Piece {
  constructor(color: PieceColor) {
    super(color, PieceType.KING);
  }

  public toString(): string {
    switch (this.color) {
      case PieceColor.WHITE:
        return "K";
      case PieceColor.BLACK:
        return "k";
      default:
        throw new Error("Invalid color");
    }
  }
}

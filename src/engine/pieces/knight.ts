import { Piece } from "@/engine/piece";
import { PieceColor, PieceType } from "@/engine/types";

export class Knight extends Piece {
  constructor(color: PieceColor) {
    super(color, PieceType.KNIGHT);
  }

  public toString(): string {
    switch (this.color) {
      case PieceColor.WHITE:
        return "N";
      case PieceColor.BLACK:
        return "n";
      default:
        throw new Error("Invalid color");
    }
  }
}

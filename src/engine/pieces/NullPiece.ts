import { Piece } from "@/engine/piece";
import { PieceColor, PieceType } from "@/engine/types";

export class NullPiece extends Piece {
  constructor() {
    super(PieceColor.NONE, PieceType.NULL);
  }
  public toString(): string {
    return " ";
  }
}

import { Piece } from "@/engine/piece";
import { PieceColor, PieceType } from "@/engine/types";

export class Queen extends Piece {
  constructor(color: PieceColor) {
    super(color, PieceType.QUEEN);
  }
}

import { Piece } from "@/engine/piece";
import { PieceColor, PieceType } from "@/engine/types";

export class Bishop extends Piece {
  constructor(color: PieceColor) {
    super(color, PieceType.BISHOP);
  }
}

import { PieceColor, PieceType } from "@/engine/types";

export class Piece {
  public constructor(
    protected color: PieceColor,
    protected type: PieceType,
  ) {}
}

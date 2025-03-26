import { PieceColor, PieceType } from "@/engine/types";

export abstract class Piece {
  public constructor(
    protected color: PieceColor,
    protected type: PieceType,
  ) {}

  public abstract toString(): string;
}

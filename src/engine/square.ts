import { Piece } from "@/engine/piece";

export class Square {
  private piece: Piece | null = null;

  public setPiece(piece: Piece | null): void {
    this.piece = piece;
  }
  public getPiece(): Piece | null {
    return this.piece;
  }
}

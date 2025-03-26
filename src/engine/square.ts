import { Piece } from "@/engine/piece";
import { NullPiece } from "@/engine/pieces/NullPiece";

export class Square {
  private piece: Piece = new NullPiece();

  public setPiece(piece: Piece): void {
    this.piece = piece;
  }
  public getPiece(): Piece {
    return this.piece;
  }
}

import { Board } from "@/engine/board";
import { Square } from "@/engine/square";

export class ChessGame {
  private board: Board = new Board();

  public initGame(): void {
    this.board.initBoard();
  }

  public getChessBoard(): Square[][] {
    return this.board.getBoard();
  }
}

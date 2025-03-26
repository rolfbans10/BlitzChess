import { Board } from "@/engine/board";
import { Square } from "@/engine/square";
import { Player } from "@/engine/player";

export class ChessGame {
  private board: Board = new Board();
  private player1: Player | null = null;
  private player2: Player | null = null;

  public initGame(player1: Player, player2: Player): void {
    this.board.initBoard();
    this.setPlayer1(player1);
    this.setPlayer2(player2);
  }

  public getChessBoard(): Square[][] {
    return this.board.getBoard();
  }

  public setPlayer1(player: Player): void {
    this.player1 = player;
  }

  public setPlayer2(player: Player): void {
    this.player2 = player;
  }

  public getPlayer1(): Player | null {
    return this.player1;
  }
  public getPlayer2(): Player | null {
    return this.player2;
  }
}

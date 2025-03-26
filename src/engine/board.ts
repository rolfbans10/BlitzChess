import { Square } from "@/engine/square";
import { PieceColor } from "@/engine/types";
import { Pawn } from "@/engine/pieces/pawn";
import { Rook } from "@/engine/pieces/rook";
import { Knight } from "@/engine/pieces/knight";
import { Bishop } from "@/engine/pieces/bishop";
import { Queen } from "@/engine/pieces/queen";
import { King } from "@/engine/pieces/king";

export class Board {
  private readonly size: number = 8;
  private board: Square[][];
  constructor() {
    this.board = this.resetBoard();
  }

  private resetBoard(): Square[][] {
    this.board = [];
    for (let i = 0; i < this.size; i++) {
      const row: Square[] = [];
      for (let j = 0; j < this.size; j++) {
        row.push(new Square());
      }
      this.board.push(row);
    }
    return this.board;
  }

  public initBoard(): void {
    this.board = this.resetBoard();

    // pawns
    this.board[1][0].setPiece(new Pawn(PieceColor.WHITE));
    this.board[1][1].setPiece(new Pawn(PieceColor.WHITE));
    this.board[1][2].setPiece(new Pawn(PieceColor.WHITE));
    this.board[1][3].setPiece(new Pawn(PieceColor.WHITE));
    this.board[1][4].setPiece(new Pawn(PieceColor.WHITE));
    this.board[1][5].setPiece(new Pawn(PieceColor.WHITE));
    this.board[1][6].setPiece(new Pawn(PieceColor.WHITE));
    this.board[1][7].setPiece(new Pawn(PieceColor.WHITE));

    this.board[6][0].setPiece(new Pawn(PieceColor.BLACK));
    this.board[6][1].setPiece(new Pawn(PieceColor.BLACK));
    this.board[6][2].setPiece(new Pawn(PieceColor.BLACK));
    this.board[6][3].setPiece(new Pawn(PieceColor.BLACK));
    this.board[6][4].setPiece(new Pawn(PieceColor.BLACK));
    this.board[6][5].setPiece(new Pawn(PieceColor.BLACK));
    this.board[6][6].setPiece(new Pawn(PieceColor.BLACK));
    this.board[6][7].setPiece(new Pawn(PieceColor.BLACK));

    // rooks
    this.board[0][0].setPiece(new Rook(PieceColor.WHITE));
    this.board[0][7].setPiece(new Rook(PieceColor.WHITE));

    this.board[7][0].setPiece(new Rook(PieceColor.BLACK));
    this.board[7][7].setPiece(new Rook(PieceColor.BLACK));

    // knights
    this.board[0][1].setPiece(new Knight(PieceColor.WHITE));
    this.board[0][6].setPiece(new Knight(PieceColor.WHITE));

    this.board[7][1].setPiece(new Knight(PieceColor.BLACK));
    this.board[7][6].setPiece(new Knight(PieceColor.BLACK));

    // bishops
    this.board[0][2].setPiece(new Bishop(PieceColor.WHITE));
    this.board[0][5].setPiece(new Bishop(PieceColor.WHITE));

    this.board[7][2].setPiece(new Bishop(PieceColor.BLACK));
    this.board[7][5].setPiece(new Bishop(PieceColor.BLACK));

    // queens
    this.board[0][3].setPiece(new Queen(PieceColor.WHITE));
    this.board[7][3].setPiece(new Queen(PieceColor.BLACK));

    // kings
    this.board[0][4].setPiece(new King(PieceColor.WHITE));
    this.board[7][4].setPiece(new King(PieceColor.BLACK));
  }

  public getBoard(): Square[][] {
    return this.board;
  }
}

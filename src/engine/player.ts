import { PieceColor } from "@/engine/types";

export class Player {
  private name: string;
  private color: PieceColor;

  constructor(name: string, color: PieceColor) {
    this.name = name;
    this.color = color;
  }

  public getColor() {
    return this.color;
  }

  public getName() {
    return this.name;
  }
}

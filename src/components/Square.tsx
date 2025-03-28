import react, { JSX } from "react";
import { getPieceString, Square as ChessSquare } from "@/engine/chess";

export interface SquareProps {
  square: ChessSquare;
}

export const Square = ({ square }: SquareProps): JSX.Element => {
  return (
    <div
      style={{
        width: "50px",
        height: "50px",
        border: "1px dashed white",
      }}
    >
      {getPieceString(square.piece)}
    </div>
  );
};

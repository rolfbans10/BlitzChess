"use client";

import { useEffect, useState } from "react";
import { Square as ChessSquare } from "@/engine/square";
import { ChessGame } from "@/engine/chess-game";
import { Player } from "@/engine/player";
import { PieceColor } from "@/engine/types";
import { Square } from "@/components/Square";

const chessGame = new ChessGame();
chessGame.initGame(
  new Player("Player 1", PieceColor.WHITE),
  new Player("Player 2", PieceColor.BLACK),
);

export default function Home() {
  const [board, setBoard] = useState<ChessSquare[][]>();

  useEffect(() => {
    setBoard(chessGame.getChessBoard());
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold">Welcome to BlitzChess</h1>
      <table>
        {board &&
          board.map((row, i) => (
            <tr key={i}>
              {row.map((square, j) => (
                <td key={j}>
                  <Square square={square} />
                </td>
              ))}
            </tr>
          ))}
      </table>
    </div>
  );
}

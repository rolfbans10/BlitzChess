"use client";

import { useState } from "react";
import { Square } from "@/components/Square";
import { createNewChessGame } from "@/engine/chess";
import { ChessGame, PieceColor, Player } from "@/engine/types";

const player1: Player = {
  name: "Player One",
  color: PieceColor.WHITE,
};

const player2: Player = {
  name: "Player Two",
  color: PieceColor.BLACK,
};

export default function Home() {
  const [game, setGame] = useState<ChessGame>(() =>
    createNewChessGame(player1, player2),
  );

  const { board } = game;

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

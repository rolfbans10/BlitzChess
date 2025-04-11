import { Move, Position } from "@/engine/types";

const columns = ["a", "b", "c", "d", "e", "f", "g", "h"];
const rows = ["1", "2", "3", "4", "5", "6", "7", "8"];

export const fromMoveToUCI = (move: Move): string => {
  return `${columns[move.from.y]}${rows[move.from.x]}${columns[move.to.y]}${rows[move.to.x]}`;
};

export const fromUCIToMove = (uci: string): Move => {
  const from: Position = {
    x: rows.indexOf(uci[1]),
    y: columns.indexOf(uci[0]),
  };
  const to: Position = { x: rows.indexOf(uci[3]), y: columns.indexOf(uci[2]) };
  return { from, to };
};

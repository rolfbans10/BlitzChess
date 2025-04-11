/**
 * this file has function helpers to read from FEN strings and convert it to internal game state, and
 * write functions to convert internal game state back to FEN
 */
import { ChessGame } from "@/engine/types";
import { createNewChessGame } from "@/engine/chess";

export const fromFEN = (_fen: string): ChessGame => {
  return createNewChessGame();
};

export const toFEN = (_game: ChessGame): string => {
  return "";
};

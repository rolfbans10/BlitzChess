/**
 * This file contains all the functions needed to invalidate basic moves
 */
// TODO:
import { ChessGame, Move, PieceColor } from "@/engine/types";

/**
 * Check
 * Checkmate
 * Stalemate
 * Castling
 * En Passant
 * Pawn Promotion
 * Underpromotion
 * Draw by Threefold Repetition
 * Draw by the Fifty-Move Rule
 * Draw by Insufficient Mating Material
 * Draw by Agreement
 * Draw by Perpetual Check
 * Touch-Move Rule
 * Losing on Time
 * Illegal Move Rule
 */

export type MoveFilter = (game: ChessGame, move: Move) => boolean;

// will this move put my king in check
export const doesMoveDiscoverCheckOnMyKing: MoveFilter = (
  game: ChessGame,
  move: Move,
  myKingColor?: PieceColor,
): boolean => {
  const myColor = myKingColor || game.toPlay;

  return false;
};

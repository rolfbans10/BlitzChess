/**
 * This file contains all the functions needed to invalidate basic moves
 */
// TODO:
import { ChessGame, Move, MoveFilter, PieceColor } from "@/engine/types";
import { getAllPossibleBasicMoves } from "@/engine/basic-moves";
import { getKing, movePiece } from "@/engine/chess";
import { getOppositeColor } from "@/engine/utils";

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

export const isCheck = (game: ChessGame, myColor?: PieceColor): boolean => {
  const kingColor = myColor || game.toPlay;
  const opponentColor = getOppositeColor(kingColor);

  const opponentBasicMoves = getAllPossibleBasicMoves(game, opponentColor);
  const king = getKing(game, kingColor);
  if (!king) {
    return false;
  }
  // is there any move than can attack the king?
  for (const move of opponentBasicMoves) {
    if (move.to.x === king.pos.x && move.to.y === king.pos.y) {
      return true;
    }
  }
  return false;
};

// will this move put my king in check
export const doesMoveDiscoverCheckOnMyKing: MoveFilter = (
  game: ChessGame,
  move: Move,
  myKingColor?: PieceColor,
): boolean => {
  const myColor = myKingColor || game.toPlay;

  const newGame = movePiece(game, move);
  return isCheck(newGame, myColor);
};

export const canMoveEscapeCheck: MoveFilter = (
  game: ChessGame,
  move: Move,
  myColor?: PieceColor,
): boolean => {
  console.log("isCheck:", isCheck(game, myColor));
  if (!isCheck(game, myColor)) {
    return true;
  }
  const newGame = movePiece(game, move);
  return !isCheck(newGame, myColor);
};

export const filterAllInvalidMoves = (
  game: ChessGame,
  myColor?: PieceColor,
): Move[] => {
  const moves =
    myColor === PieceColor.WHITE
      ? game.whiteMoves.length === 0
        ? getAllPossibleBasicMoves(game, PieceColor.WHITE)
        : game.whiteMoves
      : game.blackMoves.length === 0
        ? getAllPossibleBasicMoves(game, PieceColor.BLACK)
        : game.blackMoves;

  return moves
    .filter((move) => canMoveEscapeCheck(game, move))
    .filter((move) => !doesMoveDiscoverCheckOnMyKing(game, move));
};

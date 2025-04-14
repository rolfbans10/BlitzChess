/**
 * This file contains all the functions needed to invalidate basic moves
 */
// TODO:
import { ChessGame, Move, PieceColor } from "@/engine/types";
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
    throw new Error("King not found");
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
export const doesMoveDiscoverCheckOnMyKing = (
  game: ChessGame,
  move: Move,
  myKingColor?: PieceColor,
): boolean => {
  const myColor = myKingColor || game.toPlay;

  const newGame = movePiece(game, move);
  return isCheck(newGame, myColor);
};

export const canMoveEscapeCheck = (
  game: ChessGame,
  move: Move,
  myColor?: PieceColor,
): boolean => {
  if (!isCheck(game, myColor)) {
    return true;
  }
  const newGame = movePiece(game, move);
  return !isCheck(newGame, myColor);
};

export const filterAllInvalidMoves = (
  game: ChessGame,
  toMoveColor?: PieceColor,
): Move[] => {
  const moveColor = toMoveColor || game.toPlay;
  let moves: Move[];
  if (moveColor === PieceColor.WHITE) {
    moves = game.whiteMoves;
  } else {
    moves = game.blackMoves;
  }

  if (moves.length === 0) {
    return [];
  }

  const tempGame = { ...game };

  return moves
    .filter((move) => canMoveEscapeCheck(tempGame, move, moveColor))
    .filter(
      (move) => !doesMoveDiscoverCheckOnMyKing(tempGame, move, moveColor),
    );
};

export const placePieceBlindly = (game: ChessGame, move: Move): ChessGame => {
  const newGame = { ...game };
  const fromPiece = game.board[move.from.x][move.from.y].piece;

  if (!fromPiece) {
    throw new Error("from square is empty");
  }
  newGame.board[move.to.x][move.to.y].piece = { ...fromPiece, pos: move.to };
  newGame.board[move.from.x][move.from.y].piece = null;

  return newGame;
};

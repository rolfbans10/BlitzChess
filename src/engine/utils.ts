import { Piece, PieceColor, PieceType } from "@/engine/types";

export const getPieceString = (piece: Piece | null): string => {
  if (!piece) {
    return " ";
  }
  const stringMap = {
    [PieceType.PAWN]: "P",
    [PieceType.ROOK]: "R",
    [PieceType.KNIGHT]: "N",
    [PieceType.BISHOP]: "B",
    [PieceType.QUEEN]: "Q",
    [PieceType.KING]: "K",
  };

  return piece?.color === PieceColor.WHITE
    ? stringMap[piece.type].toUpperCase()
    : stringMap[piece.type].toLowerCase();
};

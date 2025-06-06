import {
  ChessGame,
  Move,
  Piece,
  PieceColor,
  PieceType,
  Position,
} from "@/engine/types";
import { produce } from "immer";

export const getAllPossibleBasicMoves = (
  chessGame: ChessGame,
  color?: PieceColor,
): Move[] => {
  const toPlayColor = color || chessGame.toPlay;
  const piecesToPlay: Piece[] = [];
  
  // Find all pieces of the current color
  for (let x = 0; x < 8; x++) {
    for (let y = 0; y < 8; y++) {
      const piece = chessGame.board[x][y].piece;
      if (piece && piece.color === toPlayColor) {
        piecesToPlay.push(piece);
      }
    }
  }
  
  // Get all possible moves for each piece
  let moves: Move[] = [];
  for (const piece of piecesToPlay) {
    if (!piece) {
      continue;
    }
    moves.push(...getPieceBasicMoves(chessGame, piece));
  }

  // Update the game state with the valid moves using Immer
  produce(chessGame, (draft) => {
    if (toPlayColor === PieceColor.WHITE) {
      draft.whiteMoves = moves;
    } else {
      draft.blackMoves = moves;
    }
  });

  return moves;
};

export const getPieceBasicMoves = (game: ChessGame, piece: Piece): Move[] => {
  switch (piece.type) {
    case PieceType.PAWN:
      return getPawnMoves(game, piece);
    case PieceType.ROOK:
      return getRookMoves(game, piece);
    case PieceType.KNIGHT:
      return getKnightMoves(game, piece);
    case PieceType.BISHOP:
      return getBishopMoves(game, piece);
    case PieceType.QUEEN:
      return getQueenMoves(game, piece);
    case PieceType.KING:
      return getKingMoves(game, piece);
    default:
      return [];
  }
};

export const getPawnMoves = (game: ChessGame, pawn: Piece): Move[] => {
  let offsets: Position[] = [];
  if (pawn.color === PieceColor.WHITE) {
    offsets = [
      { x: 1, y: 0 },  // Forward one square
      { x: 1, y: 1 },  // Capture right
      { x: 1, y: -1 }, // Capture left
    ];
    // Add double move only if pawn hasn't moved and is on starting rank
    if (!pawn.hasMoved && pawn.pos.x === 1) {
      offsets.push({ x: 2, y: 0 });
    }
  } else {
    offsets = [
      { x: -1, y: 0 },  // Forward one square
      { x: -1, y: 1 },  // Capture right
      { x: -1, y: -1 }, // Capture left
    ];
    // Add double move only if pawn hasn't moved and is on starting rank
    if (!pawn.hasMoved && pawn.pos.x === 6) {
      offsets.push({ x: -2, y: 0 });
    }
  }

  const possibleMoves: Move[] = [];
  for (const offset of offsets) {
    const to = {
      x: pawn.pos.x + offset.x,
      y: pawn.pos.y + offset.y,
    };
    
    // Skip if move is outside board
    if (!isPositionInsideBoard(to)) {
      continue;
    }

    const destinationSquare = game.board[to.x][to.y];
    
    // Handle forward moves
    if (offset.y === 0) {
      // Skip if destination is occupied
      if (destinationSquare.piece) {
        continue;
      }
      
      // For double moves, check if intermediate square is empty
      if (Math.abs(offset.x) === 2) {
        const intermediateX = pawn.pos.x + (offset.x / 2);
        if (game.board[intermediateX][to.y].piece) {
          continue;
        }
      }
    } 
    // Handle capture moves
    else {
      // Skip if no piece to capture or piece is same color
      if (!destinationSquare.piece || destinationSquare.piece.color === pawn.color) {
        continue;
      }
    }

    possibleMoves.push({
      from: pawn.pos,
      to,
    });
  }
  return possibleMoves;
};

export const getLinearMoves = (
  game: ChessGame,
  piece: Piece,
  directions: Position[],
): Move[] => {
  const possibleMoves: Move[] = [];
  for (const direction of directions) {
    let to = {
      x: piece.pos.x + direction.x,
      y: piece.pos.y + direction.y,
    };
    let directionBlocked = false;
    while (isPositionInsideBoard(to) && !directionBlocked) {
      const square = game.board[to.x][to.y];
      if (square.piece && square.piece.color === piece.color) {
        directionBlocked = true;
        break;
      }
      if (square.piece && square.piece.color !== piece.color) {
        possibleMoves.push({
          from: piece.pos,
          to,
        });
        directionBlocked = true;
        break;
      }
      possibleMoves.push({
        from: piece.pos,
        to,
      });
      to = {
        x: to.x + direction.x,
        y: to.y + direction.y,
      };
    }
  }
  return possibleMoves;
};

export const getRookMoves = (game: ChessGame, rook: Piece): Move[] => {
  const possibleMoves: Move[] = [];
  const directions: Position[] = [
    { x: 0, y: 1 },
    { x: 0, y: -1 },
    { x: 1, y: 0 },
    { x: -1, y: 0 },
  ];
  possibleMoves.push(...getLinearMoves(game, rook, directions));
  return possibleMoves;
};

const isPositionInsideBoard = (pos: Position): boolean => {
  return !(pos.x < 0 || pos.x > 7 || pos.y < 0 || pos.y > 7);
};

export const getKnightMoves = (game: ChessGame, knight: Piece): Move[] => {
  const possibleMoves: Move[] = [];
  const offsets: Position[] = [
    { x: 2, y: 1 },
    { x: 2, y: -1 },
    { x: -2, y: 1 },
    { x: -2, y: -1 },
    { x: 1, y: 2 },
    { x: 1, y: -2 },
    { x: -1, y: 2 },
    { x: -1, y: -2 },
  ];

  for (const offset of offsets) {
    const to = {
      x: knight.pos.x + offset.x,
      y: knight.pos.y + offset.y,
    };
    if (!isPositionInsideBoard(to)) {
      continue;
    }
    const square = game.board[to.x][to.y];
    if (square.piece && square.piece.color === knight.color) {
      continue;
    }
    possibleMoves.push({
      from: knight.pos,
      to,
    });
  }
  return possibleMoves;
};

export const getBishopMoves = (game: ChessGame, bishop: Piece): Move[] => {
  const possibleMoves: Move[] = [];
  const directions: Position[] = [
    { x: 1, y: 1 },
    { x: -1, y: 1 },
    { x: 1, y: -1 },
    { x: -1, y: -1 },
  ];
  possibleMoves.push(...getLinearMoves(game, bishop, directions));
  return possibleMoves;
};

export const getQueenMoves = (game: ChessGame, queen: Piece): Move[] => {
  const possibleMoves: Move[] = [];
  const directions: Position[] = [
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 1, y: -1 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
    { x: -1, y: 0 },
    { x: -1, y: 1 },
    { x: -1, y: -1 },
  ];
  possibleMoves.push(...getLinearMoves(game, queen, directions));
  return possibleMoves;
};

export const getKingMoves = (game: ChessGame, king: Piece): Move[] => {
  const possibleMoves: Move[] = [];
  const steps: Position[] = [
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 1, y: -1 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
    { x: -1, y: 0 },
    { x: -1, y: 1 },
    { x: -1, y: -1 },
  ];

  // Regular king moves
  for (const step of steps) {
    let to = {
      x: king.pos.x + step.x,
      y: king.pos.y + step.y,
    };
    if (!isPositionInsideBoard(to)) {
      continue;
    }
    const square = game.board[to.x][to.y];
    if (square.piece && square.piece.color === king.color) {
      continue;
    }
    possibleMoves.push({
      from: king.pos,
      to,
    });
  }

  // Castling moves
  if (!king.hasMoved && game.castlingRights) {
    const isWhite = king.color === PieceColor.WHITE;
    const row = isWhite ? 0 : 7;
    const rights = game.castlingRights;

    // Kingside castling
    if ((isWhite && rights.whiteKingside) || (!isWhite && rights.blackKingside)) {
      const rook = game.board[row][7].piece;
      if (rook && !rook.hasMoved && rook.type === PieceType.ROOK) {
        // Check if squares between king and rook are empty
        const canCastle = [5, 6].every(
          (y) => !game.board[row][y].piece
        );
        if (canCastle) {
          possibleMoves.push({
            from: king.pos,
            to: { x: row, y: 6 },
            isCastling: true,
            castlingType: 'kingside',
          });
        }
      }
    }

    // Queenside castling
    if ((isWhite && rights.whiteQueenside) || (!isWhite && rights.blackQueenside)) {
      const rook = game.board[row][0].piece;
      if (rook && !rook.hasMoved && rook.type === PieceType.ROOK) {
        // Check if squares between king and rook are empty
        const canCastle = [1, 2, 3].every(
          (y) => !game.board[row][y].piece
        );
        if (canCastle) {
          possibleMoves.push({
            from: king.pos,
            to: { x: row, y: 2 },
            isCastling: true,
            castlingType: 'queenside',
          });
        }
      }
    }
  }

  return possibleMoves;
};

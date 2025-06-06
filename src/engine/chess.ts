import {
  ChessGame,
  Move,
  Piece,
  PieceColor,
  PieceType,
  Player,
  Square,
} from "@/engine/types";
import { getOppositeColor } from "@/engine/utils";
import { filterAllInvalidMoves } from "@/engine/move-filters";
import { getAllPossibleBasicMoves } from "@/engine/basic-moves";
import { produce, WritableDraft } from "immer";

export const getCleanBoard = (): Square[][] => {
  const board: Square[][] = [];
  for (let x = 0; x < 8; x++) {
    board.push([]);
    for (let y = 0; y < 8; y++) {
      board[x][y] = {
        piece: null,
      };
    }
  }
  return board;
};

export const setupInitialPositions = (): Square[][] => {
  const board = getCleanBoard();

  // place pawns
  for (let y = 0; y < 8; y++) {
    board[1][y].piece = {
      type: PieceType.PAWN,
      color: PieceColor.WHITE,
      captured: false,
      pos: {
        x: 1,
        y,
      },
    };
    board[6][y].piece = {
      type: PieceType.PAWN,
      color: PieceColor.BLACK,
      captured: false,
      pos: {
        x: 6,
        y,
      },
    };
  }

  // rooks
  board[0][0].piece = {
    type: PieceType.ROOK,
    color: PieceColor.WHITE,
    captured: false,
    pos: {
      x: 0,
      y: 0,
    },
  };

  board[0][7].piece = {
    type: PieceType.ROOK,
    color: PieceColor.WHITE,
    captured: false,
    pos: {
      x: 0,
      y: 7,
    },
  };

  board[7][0].piece = {
    type: PieceType.ROOK,
    color: PieceColor.BLACK,
    captured: false,
    pos: {
      x: 7,
      y: 0,
    },
  };

  board[7][7].piece = {
    type: PieceType.ROOK,
    color: PieceColor.BLACK,
    captured: false,
    pos: {
      x: 7,
      y: 7,
    },
  };

  // knights
  board[0][1].piece = {
    type: PieceType.KNIGHT,
    color: PieceColor.WHITE,
    captured: false,
    pos: {
      x: 0,
      y: 1,
    },
  };
  board[0][6].piece = {
    type: PieceType.KNIGHT,
    color: PieceColor.WHITE,
    captured: false,
    pos: {
      x: 0,
      y: 6,
    },
  };
  board[7][1].piece = {
    type: PieceType.KNIGHT,
    color: PieceColor.BLACK,
    captured: false,
    pos: {
      x: 7,
      y: 1,
    },
  };
  board[7][6].piece = {
    type: PieceType.KNIGHT,
    color: PieceColor.BLACK,
    captured: false,
    pos: {
      x: 7,
      y: 6,
    },
  };

  // bishops
  board[0][2].piece = {
    type: PieceType.BISHOP,
    color: PieceColor.WHITE,
    captured: false,
    pos: {
      x: 0,
      y: 2,
    },
  };
  board[0][5].piece = {
    type: PieceType.BISHOP,
    color: PieceColor.WHITE,
    captured: false,
    pos: {
      x: 0,
      y: 5,
    },
  };
  board[7][2].piece = {
    type: PieceType.BISHOP,
    color: PieceColor.BLACK,
    captured: false,
    pos: {
      x: 7,
      y: 2,
    },
  };
  board[7][5].piece = {
    type: PieceType.BISHOP,
    color: PieceColor.BLACK,
    captured: false,
    pos: {
      x: 7,
      y: 5,
    },
  };

  // queens
  board[0][3].piece = {
    type: PieceType.QUEEN,
    color: PieceColor.WHITE,
    captured: false,
    pos: {
      x: 0,
      y: 3,
    },
  };
  board[7][3].piece = {
    type: PieceType.QUEEN,
    color: PieceColor.BLACK,
    captured: false,
    pos: {
      x: 7,
      y: 3,
    },
  };

  // kings
  board[0][4].piece = {
    type: PieceType.KING,
    color: PieceColor.WHITE,
    captured: false,
    pos: {
      x: 0,
      y: 4,
    },
  };
  board[7][4].piece = {
    type: PieceType.KING,
    color: PieceColor.BLACK,
    captured: false,
    pos: {
      x: 7,
      y: 4,
    },
  };

  return board;
};

export const getKing = (game: ChessGame, color: PieceColor): Piece | null => {
  for (let x = 0; x < 8; x++) {
    for (let y = 0; y < 8; y++) {
      const piece = game.board[x][y].piece;
      if (piece && piece.color === color && piece.type === PieceType.KING) {
        return piece;
      }
    }
  }
  return null;
};

const getAllValidMoves = (game: ChessGame, myColor?: PieceColor): Move[] => {
  const color = myColor || game.toPlay;
  let moves: Move[] = getAllPossibleBasicMoves(game, color);

  moves = filterAllInvalidMoves(game, myColor);

  return moves;
};

export const validateMove = (game: ChessGame, move: Move, color: PieceColor): boolean => {
  const fromSquare = game.board[move.from.x][move.from.y];
  const toSquare = game.board[move.to.x][move.to.y];

  if (!fromSquare.piece) {
    return false;
  }

  if (fromSquare.piece.color !== color) {
    return false;
  }

  // Add more validation as needed
  return true;
};

export function movePiece(game: ChessGame, move: Move): ChessGame {
  const { from, to } = move;
  const pieceToMove = game.board[from.x][from.y].piece;

  if (!pieceToMove) {
    return produce(game, (draft) => {});
  }

  // Check if it's a castling move
  if (move.isCastling) {
    const isKingside = move.castlingType === 'kingside';
    const rookFrom = { x: from.x, y: isKingside ? 7 : 0 };
    const rookTo = { x: from.x, y: isKingside ? 5 : 3 };
    const rook = game.board[rookFrom.x][rookFrom.y].piece;

    if (!rook || rook.type !== PieceType.ROOK || rook.color !== pieceToMove.color) {
      return produce(game, (draft) => {});
    }

    // Check if path is clear
    const pathClear = isKingside
      ? game.board[from.x][5].piece === null && game.board[from.x][6].piece === null
      : game.board[from.x][1].piece === null && game.board[from.x][2].piece === null && game.board[from.x][3].piece === null;

    if (!pathClear) {
      return produce(game, (draft) => {});
    }

    // Check if king or rook has moved
    if (pieceToMove.hasMoved || rook.hasMoved) {
      return produce(game, (draft) => {});
    }

    // Check if castling rights are available
    const castlingRights = game.castlingRights;
    const canCastle = pieceToMove.color === PieceColor.WHITE
      ? (isKingside ? castlingRights.whiteKingside : castlingRights.whiteQueenside)
      : (isKingside ? castlingRights.blackKingside : castlingRights.blackQueenside);

    if (!canCastle) {
      return produce(game, (draft) => {});
    }

    return produce(game, (draft) => {
      // Move king
      const newKing = {
        ...pieceToMove,
        hasMoved: true,
        pos: to
      };
      draft.board[to.x][to.y].piece = newKing;
      draft.board[from.x][from.y].piece = null;

      // Move rook
      const newRook = {
        ...rook,
        hasMoved: true,
        pos: rookTo
      };
      draft.board[rookTo.x][rookTo.y].piece = newRook;
      draft.board[rookFrom.x][rookFrom.y].piece = null;

      // Update castling rights
      if (pieceToMove.color === PieceColor.WHITE) {
        draft.castlingRights.whiteKingside = false;
        draft.castlingRights.whiteQueenside = false;
      } else {
        draft.castlingRights.blackKingside = false;
        draft.castlingRights.blackQueenside = false;
      }

      // Update move history
      draft.moves.push(move);
      draft.lastMove = move;
    });
  }

  // Regular move
  return produce(game, (draft) => {
    // Check if there's a piece to capture
    const targetPiece = draft.board[to.x][to.y].piece;
    if (targetPiece) {
      targetPiece.captured = true;
      draft.capturedPieces.push(targetPiece);
    }

    // Move the piece
    const newPiece = {
      ...pieceToMove,
      hasMoved: true,
      pos: to
    };
    draft.board[to.x][to.y].piece = newPiece;
    draft.board[from.x][from.y].piece = null;

    // Update castling rights if king or rook moves
    if (pieceToMove.type === PieceType.KING) {
      if (pieceToMove.color === PieceColor.WHITE) {
        draft.castlingRights.whiteKingside = false;
        draft.castlingRights.whiteQueenside = false;
      } else {
        draft.castlingRights.blackKingside = false;
        draft.castlingRights.blackQueenside = false;
      }
    } else if (pieceToMove.type === PieceType.ROOK) {
      if (pieceToMove.color === PieceColor.WHITE) {
        if (from.y === 0) draft.castlingRights.whiteQueenside = false;
        if (from.y === 7) draft.castlingRights.whiteKingside = false;
      } else {
        if (from.y === 0) draft.castlingRights.blackQueenside = false;
        if (from.y === 7) draft.castlingRights.blackKingside = false;
      }
    }

    // Update move history
    draft.moves.push(move);
    draft.lastMove = move;
  });
}

export const defaultPlayer1: Player = {
  name: "Player 1",
  color: PieceColor.WHITE,
};

export const defaultPlayer2: Player = {
  name: "Player 2",
  color: PieceColor.BLACK,
};

export function createNewChessGame(): ChessGame {
  const board: Square[][] = Array(8).fill(null).map(() => Array(8).fill(null).map(() => ({ piece: null })));

  // Initialize pawns
  for (let y = 0; y < 8; y++) {
    board[1][y].piece = {
      type: PieceType.PAWN,
      color: PieceColor.WHITE,
      pos: { x: 1, y },
      hasMoved: false,
      captured: false,
    };
    board[6][y].piece = {
      type: PieceType.PAWN,
      color: PieceColor.BLACK,
      pos: { x: 6, y },
      hasMoved: false,
      captured: false,
    };
  }

  // Initialize other pieces
  const pieceOrder = [
    PieceType.ROOK,
    PieceType.KNIGHT,
    PieceType.BISHOP,
    PieceType.QUEEN,
    PieceType.KING,
    PieceType.BISHOP,
    PieceType.KNIGHT,
    PieceType.ROOK,
  ];

  for (let y = 0; y < 8; y++) {
    board[0][y].piece = {
      type: pieceOrder[y],
      color: PieceColor.WHITE,
      pos: { x: 0, y },
      hasMoved: false,
      captured: false,
    };
    board[7][y].piece = {
      type: pieceOrder[y],
      color: PieceColor.BLACK,
      pos: { x: 7, y },
      hasMoved: false,
      captured: false,
    };
  }

  return {
    board,
    player1: {
      name: "Player 1",
      color: PieceColor.WHITE,
    },
    player2: {
      name: "Player 2",
      color: PieceColor.BLACK,
    },
    toPlay: PieceColor.WHITE,
    winner: null,
    moves: [],
    capturedPieces: [],
    lastMove: null,
    isGameOver: false,
    whiteMoves: [],
    blackMoves: [],
    castlingRights: {
      whiteKingside: true,
      whiteQueenside: true,
      blackKingside: true,
      blackQueenside: true,
    },
  };
}

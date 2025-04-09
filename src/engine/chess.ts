import {
  ChessGame,
  Move,
  Piece,
  PieceColor,
  PieceType,
  Player,
  Square,
} from "@/engine/types";
import { getAllPossibleBasicMoves } from "@/engine/basic-moves";
import { getOppositeColor } from "@/engine/utils";

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

export const isCheck = (game: ChessGame): boolean => {
  const currentToPlay = game.toPlay;
  const opponentColor =
    currentToPlay === PieceColor.WHITE ? PieceColor.BLACK : PieceColor.WHITE;

  const opponentBasicMoves = getAllPossibleBasicMoves(game, opponentColor);
  const king = getKing(game, currentToPlay);
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

export const filterMovesUsingChessRules = (
  chessGame: ChessGame,
  moves: Move[],
): Move[] => {
  return moves;
};

const getAllValidMoves = (chessGame: ChessGame): Move[] => {
  let moves = getAllPossibleBasicMoves(chessGame);

  moves = filterMovesUsingChessRules(chessGame, moves);

  return moves;
};

export const movePiece = (game: ChessGame, move: Move): ChessGame => {
  const newGame: ChessGame = { ...game };
  const fromSquare = game.board[move.from.x][move.from.y];
  const toSquare = game.board[move.to.x][move.to.y];

  if (!fromSquare.piece) {
    throw new Error("from square is empty");
  }
  if (toSquare.piece) {
    if (toSquare.piece.color === fromSquare.piece.color) {
      throw new Error("cannot capture piece of the same color");
    }
    // capture
    newGame.capturedPieces.push({ ...toSquare.piece });
  }
  newGame.board[move.to.x][move.to.y].piece = { ...fromSquare.piece };
  newGame.board[move.from.x][move.from.y].piece = null;

  newGame.moves.push(move);
  newGame.lastMove = move;
  newGame.toPlay = getOppositeColor(newGame.toPlay);

  return newGame;
};

export const createNewChessGame = (
  player1: Player,
  player2: Player,
): ChessGame => {
  const game: ChessGame = {
    board: setupInitialPositions(),
    player1,
    player2,
    toPlay: PieceColor.WHITE,
    winner: null,
    moves: [],
    capturedPieces: [],
    lastMove: null,
    isGameOver: false,
  };

  return game;
};

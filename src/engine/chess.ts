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

export const validateMove = (
  game: ChessGame,
  move: Move,
  moveColor?: PieceColor,
): boolean => {
  const color = moveColor || game.toPlay;
  const validMoves = color === PieceColor.WHITE ? game.whiteMoves : game.blackMoves;
  
  // Check if the move exists in the list of valid moves
  return validMoves.some(
    (validMove) =>
      validMove.from.x === move.from.x &&
      validMove.from.y === move.from.y &&
      validMove.to.x === move.to.x &&
      validMove.to.y === move.to.y
  );
};

export const movePiece = (game: ChessGame, move: Move): ChessGame => {
  return produce(game, (draft) => {
    const fromSquare = game.board[move.from.x][move.from.y];
    const toSquare = game.board[move.to.x][move.to.y];
    
    if (!fromSquare.piece) {
      throw new Error("No piece to move");
    }

    // Handle capture
    if (toSquare.piece) {
      draft.capturedPieces.push(toSquare.piece);
    }

    // Move the piece
    draft.board[move.to.x][move.to.y].piece = {
      ...fromSquare.piece,
      pos: move.to,
      hasMoved: true,
    };
    draft.board[move.from.x][move.from.y].piece = null;

    // Update game state
    draft.moves.push(move);
    draft.toPlay = getOppositeColor(game.toPlay);
  });
};

export const defaultPlayer1: Player = {
  name: "Player 1",
  color: PieceColor.WHITE,
};

export const defaultPlayer2: Player = {
  name: "Player 2",
  color: PieceColor.BLACK,
};

export const createNewChessGame = (
  player1: Player = defaultPlayer1,
  player2: Player = defaultPlayer2,
): ChessGame =>
  produce({}, (game: WritableDraft<ChessGame>): void => {
    game.board = setupInitialPositions();
    game.player1 = player1;
    game.player2 = player2;
    game.toPlay = PieceColor.WHITE;
    game.winner = null;
    game.moves = [];
    game.whiteMoves = getAllPossibleBasicMoves(game, PieceColor.WHITE);
    game.blackMoves = getAllPossibleBasicMoves(game, PieceColor.BLACK);
    game.capturedPieces = [];
  }) as ChessGame;

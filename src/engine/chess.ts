export enum PieceColor {
  BLACK = "black",
  WHITE = "white",
}

export enum PieceType {
  PAWN = "pawn",
  ROOK = "rook",
  BISHOP = "bishop",
  KNIGHT = "knight",
  QUEEN = "queen",
  KING = "king",
}

export interface Position {
  x: number;
  y: number;
}

export interface Piece {
  color: PieceColor;
  type: PieceType;
  pos: Position;
  captured?: boolean;
  hasMoved?: boolean;
  moves?: Move[];
}

export interface Square {
  piece: Piece | null;
}

export interface Player {
  name: string;
  color: PieceColor;
}

export interface ChessGame {
  board: Square[][];
  player1: Player;
  player2: Player;
  toPlay: PieceColor;
  winner: PieceColor | null;
  moves: Move[];
}

export interface Move {
  from: Position;
  to: Position;
}

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

export const getPieceMoves = (game: ChessGame, piece: Piece): Move[] => {
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
  if (pawn.color !== game.toPlay) {
    return [];
  }
  let offsets: Position[] = [];
  if (pawn.color === PieceColor.WHITE) {
    offsets = [
      {
        x: 1,
        y: 0,
      },
      {
        x: 2,
        y: 0,
      },
      {
        x: 1,
        y: 1,
      },
      {
        x: 1,
        y: -1,
      },
    ];
  } else {
    offsets = [
      {
        x: -1,
        y: 0,
      },
      {
        x: -2,
        y: 0,
      },
      {
        x: -1,
        y: 1,
      },
      {
        x: -1,
        y: -1,
      },
    ];
  }

  const possibleMoves: Move[] = [];
  for (const offset of offsets) {
    const to = {
      x: pawn.pos.x + offset.x,
      y: pawn.pos.y + offset.y,
    };
    if (to.x < 0 || to.x > 7 || to.y < 0 || to.y > 7) {
      continue;
    }
    if (pawn.hasMoved && offset.x === 2) {
      continue;
    }
    const square = game.board[to.x][to.y];
    if (square.piece) {
      if (square.piece.color === PieceColor.WHITE) {
        continue;
      }
      if (square.piece.color === PieceColor.BLACK && offset.y === 0) {
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

export const getRookMoves = (game: ChessGame, rook: Piece): Move[] => {
  return [];
};

export const getKnightMoves = (game: ChessGame, knight: Piece): Move[] => {
  return [];
};

export const getBishopMoves = (game: ChessGame, bishop: Piece): Move[] => {
  return [];
};

export const getQueenMoves = (game: ChessGame, queen: Piece): Move[] => {
  return [];
};

export const getKingMoves = (game: ChessGame, king: Piece): Move[] => {
  return [];
};

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
  };

  // calculate possible moves for each piece
  for (let x = 0; x < 8; x++) {
    for (let y = 0; y < 8; y++) {
      const piece = game.board[x][y].piece;
      if (piece) {
        piece.moves = getPieceMoves(game, piece);
      }
    }
  }

  return game;
};

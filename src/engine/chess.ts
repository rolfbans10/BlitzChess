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
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 1, y: 1 },
      { x: 1, y: -1 },
    ];
  } else {
    offsets = [
      { x: -1, y: 0 },
      { x: -2, y: 0 },
      { x: -1, y: 1 },
      { x: -1, y: -1 },
    ];
  }

  const possibleMoves: Move[] = [];
  for (const offset of offsets) {
    const to = {
      x: pawn.pos.x + offset.x,
      y: pawn.pos.y + offset.y,
    };
    if (!isPositionInsideBoard(to)) {
      continue;
    }
    if (pawn.hasMoved && Math.abs(offset.x) === 2) {
      continue;
    }
    // check if 1 or 2 is blocked
    const destinationSquare = game.board[to.x][to.y];
    if (Math.abs(offset.y) === 0) {
      if (Math.abs(offset.x) === 1 && !!destinationSquare.piece) {
        continue;
      }
      const inBetweenOffsetX = pawn.color === PieceColor.WHITE ? -1 : 1;
      const squareInBetween = game.board[to.x + inBetweenOffsetX][to.y];
      if (Math.abs(offset.x) === 2 && !!squareInBetween.piece) {
        continue;
      }
    }
    // only on capture allowed left and right
    if (
      Math.abs(offset.y) > 0 &&
      (destinationSquare.piece?.color === pawn.color ||
        !destinationSquare.piece)
    ) {
      continue;
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
  if (rook.color !== game.toPlay) {
    return [];
  }

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
  if (bishop.color !== game.toPlay) {
    return [];
  }
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
  if (queen.color !== game.toPlay) {
    return [];
  }
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
  if (king.color !== game.toPlay) {
    return [];
  }
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
  return possibleMoves;
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

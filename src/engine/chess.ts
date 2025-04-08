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
  capturedPieces: Piece[];
  lastMove: Move | null;
  isGameOver: boolean;
}

export interface Move {
  from: Position;
  to: Position;
  // color: PieceColor;
  isCapture?: boolean;
  isCheck?: boolean;
  isPromotion?: boolean;
  isCastling?: boolean;
  isEnPassant?: boolean;
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

export const getAllPossibleBasicMoves = (
  chessGame: ChessGame,
  color?: PieceColor,
): Move[] => {
  const toPlayColor = color || chessGame.toPlay;
  const piecesToPlay: Piece[] = [];
  for (let x = 0; x < 8; x++) {
    for (let y = 0; y < 8; y++) {
      const piece = chessGame.board[x][y].piece;
      if (piece && piece.color === toPlayColor) {
        piecesToPlay.push(piece);
      }
    }
  }
  let moves: Move[] = [];
  for (const piece of piecesToPlay) {
    if (!piece) {
      continue;
    }
    moves.push(...getPieceMoves(chessGame, piece));
  }

  return moves;
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

export const movePiece = (game: ChessGame, move: Move): ChessGame => {
  const newGame = { ...game };
  const from = move.from;
  const to = move.to;
  const fromSquare = newGame.board[from.x][from.y];
  if (!fromSquare.piece) {
    throw new Error("piece is null");
  }
  const toSquare = newGame.board[to.x][to.y];
  if (toSquare.piece) {
    if (toSquare.piece.color === fromSquare.piece.color) {
      throw new Error("Cannot move to the same color");
    }
    //capturing
    newGame.capturedPieces.push(toSquare.piece);
    fromSquare.piece.pos = to;
    newGame.board[from.x][from.y].piece = null;
    newGame.board[to.x][to.y].piece = fromSquare.piece;
  } else {
    //moving to empty square
    fromSquare.piece.pos = to;
    newGame.board[to.x][to.y].piece = fromSquare.piece;
    newGame.board[from.x][from.y].piece = null;
  }

  // switch turn
  if (newGame.toPlay === PieceColor.WHITE) {
    newGame.toPlay = PieceColor.BLACK;
  } else {
    newGame.toPlay = PieceColor.WHITE;
  }

  return newGame;
};

export const willMoveDiscoverCheckOnOurKing = (
  game: ChessGame,
  move: Move,
): boolean => {
  const myColor = game.toPlay;
  let newGame = movePiece(game, move);
  return isCheck(newGame, myColor);
};

// export const willMovePutKingOnCheck = (): boolean => {
//   return false;
// };

export const getOpponentColor = (myColor: PieceColor): PieceColor => {
  if (myColor === PieceColor.WHITE) {
    return PieceColor.BLACK;
  }
  return PieceColor.WHITE;
};

export const isCheck = (
  game: ChessGame,
  kingColorToCheck?: PieceColor,
): boolean => {
  const newGame = { ...game };
  const kingColor = kingColorToCheck || newGame.toPlay;
  const opponentColor = getOpponentColor(kingColor);

  const opponentBasicMoves = getAllPossibleBasicMoves(newGame, opponentColor);
  const king = getKing(newGame, kingColor);
  if (!king) {
    return false;
  }
  // is there any move than can attack your king?
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
  /**
   * Check
   *  - is your king in check after your move
   *  -
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
  return moves.filter((move, index, moves): boolean => {
    // will it discover a check?
    return willMoveDiscoverCheckOnOurKing(chessGame, move);
  });
};

const getAllValidMoves = (chessGame: ChessGame): Move[] => {
  let moves = getAllPossibleBasicMoves(chessGame);

  moves = filterMovesUsingChessRules(chessGame, moves);

  return moves;
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

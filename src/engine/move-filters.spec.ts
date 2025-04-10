import { createTestGame } from "@/engine/test-utils";
import {
  canMoveEscapeCheck,
  doesMoveDiscoverCheckOnMyKing,
  isCheck,
} from "@/engine/move-filters";
import { ChessGame, Move, PieceColor, PieceType } from "@/engine/types";

describe("Move Filters", () => {
  describe("isCheck", () => {
    it("returns false if the king does not exist on the board", () => {
      const game = createTestGame({
        board: Array(8)
          .fill(null)
          .map(() =>
            Array(8).fill({
              piece: null, // Explicitly define that the board contains null pieces
            }),
          ),
      });

      const result = isCheck(game, PieceColor.WHITE);
      expect(result).toBe(false);
    });

    it("returns false if no opponent moves can attack the king", () => {
      const game = createTestGame();

      // Place the white king
      game.board[4][4] = {
        piece: {
          type: PieceType.KING,
          color: PieceColor.WHITE,
          pos: { x: 4, y: 4 },
        },
      };

      // Add opponent pieces far from the king
      game.board[0][0] = {
        piece: {
          type: PieceType.ROOK,
          color: PieceColor.BLACK,
          pos: { x: 0, y: 0 },
        },
      };

      game.board[7][7] = {
        piece: {
          type: PieceType.ROOK,
          color: PieceColor.BLACK,
          pos: { x: 7, y: 7 },
        },
      };

      const result = isCheck(game, PieceColor.WHITE);
      expect(result).toBe(false);
    });

    it("returns true if an opponent move attacks the king", () => {
      const game = createTestGame();

      // Place the white king
      game.board[4][4] = {
        piece: {
          type: PieceType.KING,
          color: PieceColor.WHITE,
          pos: { x: 4, y: 4 },
        },
      };

      // Place a black rook that can attack the king
      game.board[4][0] = {
        piece: {
          type: PieceType.ROOK,
          color: PieceColor.BLACK,
          pos: { x: 4, y: 0 },
        },
      };

      const result = isCheck(game, PieceColor.WHITE);
      expect(result).toBe(true);
    });

    it("returns true if multiple opponent moves attack the king", () => {
      const game = createTestGame({
        toPlay: PieceColor.BLACK,
      });

      // Place the black king
      game.board[7][7] = {
        piece: {
          type: PieceType.KING,
          color: PieceColor.BLACK,
          pos: { x: 7, y: 7 },
        },
      };

      // Place attacking white knights
      game.board[5][6] = {
        piece: {
          type: PieceType.KNIGHT,
          color: PieceColor.WHITE,
          pos: { x: 5, y: 6 },
        },
      };

      game.board[6][5] = {
        piece: {
          type: PieceType.KNIGHT,
          color: PieceColor.WHITE,
          pos: { x: 6, y: 5 },
        },
      };

      const result = isCheck(game, PieceColor.BLACK);
      expect(result).toBe(true);
    });

    it("uses `toPlay` if no color is provided", () => {
      const game = createTestGame({
        toPlay: PieceColor.BLACK,
      });

      // Place the black king
      game.board[0][7] = {
        piece: {
          type: PieceType.KING,
          color: PieceColor.BLACK,
          pos: { x: 0, y: 7 },
        },
      };

      // Place a white queen that can attack the king
      game.board[0][5] = {
        piece: {
          type: PieceType.QUEEN,
          color: PieceColor.WHITE,
          pos: { x: 0, y: 5 },
        },
      };

      const result = isCheck(game);
      expect(result).toBe(true);
    });
  });
  describe("doesMoveDiscoverCheckOnMyKing", () => {
    it("returns true if the move exposes the king to check", () => {
      const game: ChessGame = createTestGame();

      // Place white king
      game.board[4][4] = {
        piece: {
          type: PieceType.KING,
          color: PieceColor.WHITE,
          pos: { x: 4, y: 4 },
        },
      };

      // Place a friendly white rook
      game.board[4][3] = {
        piece: {
          type: PieceType.ROOK,
          color: PieceColor.WHITE,
          pos: { x: 4, y: 3 },
        },
      };

      // Place a black rook that can attack the white king if the white rook moves
      game.board[4][0] = {
        piece: {
          type: PieceType.ROOK,
          color: PieceColor.BLACK,
          pos: { x: 4, y: 0 },
        },
      };

      // Move the white rook away, exposing the king to check
      const move: Move = {
        from: { x: 4, y: 3 },
        to: { x: 3, y: 3 },
      };

      const result = doesMoveDiscoverCheckOnMyKing(game, move);

      expect(result).toBe(true);
    });

    it("returns false if the move does not expose the king to check", () => {
      const game: ChessGame = createTestGame();

      // Place white king
      game.board[4][4] = {
        piece: {
          type: PieceType.KING,
          color: PieceColor.WHITE,
          pos: { x: 4, y: 4 },
        },
      };

      // Place a friendly white rook
      game.board[4][3] = {
        piece: {
          type: PieceType.ROOK,
          color: PieceColor.WHITE,
          pos: { x: 4, y: 3 },
        },
      };

      // Place a black rook that cannot attack the white king
      game.board[7][7] = {
        piece: {
          type: PieceType.ROOK,
          color: PieceColor.BLACK,
          pos: { x: 7, y: 7 },
        },
      };

      // Move the white rook to a different square
      const move: Move = {
        from: { x: 4, y: 3 },
        to: { x: 4, y: 2 },
      };

      const result = doesMoveDiscoverCheckOnMyKing(game, move);

      expect(result).toBe(false);
    });

    it("uses the provided myKingColor argument if given", () => {
      const game: ChessGame = createTestGame({
        toPlay: PieceColor.BLACK, // Current turn is set to black
      });

      // Place white king
      game.board[4][4] = {
        piece: {
          type: PieceType.KING,
          color: PieceColor.WHITE,
          pos: { x: 4, y: 4 },
        },
      };

      // Place a white rook protecting the king
      game.board[4][3] = {
        piece: {
          type: PieceType.ROOK,
          color: PieceColor.WHITE,
          pos: { x: 4, y: 3 },
        },
      };

      // Place a black rook that will attack the white king
      game.board[4][0] = {
        piece: {
          type: PieceType.ROOK,
          color: PieceColor.BLACK,
          pos: { x: 4, y: 0 },
        },
      };

      // Move the white rook away, exposing the king
      const move: Move = {
        from: { x: 4, y: 3 },
        to: { x: 3, y: 3 },
      };

      // Pass myKingColor explicitly as WHITE while it's BLACK's turn on the board
      const result = doesMoveDiscoverCheckOnMyKing(
        game,
        move,
        PieceColor.WHITE,
      );

      expect(result).toBe(true);
    });
  });
  describe("canMoveEscapeCheck", () => {
    it("returns true if the king is not in check", () => {
      const game: ChessGame = createTestGame();

      // Place white king
      game.board[4][4] = {
        piece: {
          type: PieceType.KING,
          color: PieceColor.WHITE,
          pos: { x: 4, y: 4 },
        },
      };

      // Move a random piece (no check exists)
      const move: Move = {
        from: { x: 4, y: 4 },
        to: { x: 4, y: 5 },
      };

      const result = canMoveEscapeCheck(game, move, PieceColor.WHITE);
      expect(result).toBe(true);
    });

    // it("returns true if the move resolves a check", () => {
    //   const game: ChessGame = createTestGame();
    //
    //   // Place white king
    //   game.board[4][4] = {
    //     piece: {
    //       type: PieceType.KING,
    //       color: PieceColor.WHITE,
    //       pos: { x: 4, y: 4 },
    //     },
    //   };
    //
    //   // Place black rook creating a check
    //   game.board[4][7] = {
    //     piece: {
    //       type: PieceType.ROOK,
    //       color: PieceColor.BLACK,
    //       pos: { x: 4, y: 7 },
    //     },
    //   };
    //
    //   // Move the white king out of check
    //   const move: Move = {
    //     from: { x: 4, y: 4 },
    //     to: { x: 3, y: 4 },
    //   };
    //
    //   const result = canMoveEscapeCheck(game, move, PieceColor.WHITE);
    //   expect(result).toBe(true);
    // });
    //
    // it("returns false if the move does not resolve the check", () => {
    //   const game: ChessGame = createTestGame();
    //
    //   // Place white king
    //   game.board[4][4] = {
    //     piece: {
    //       type: PieceType.KING,
    //       color: PieceColor.WHITE,
    //       pos: { x: 4, y: 4 },
    //     },
    //   };
    //
    //   // Place black rook creating a check
    //   game.board[4][7] = {
    //     piece: {
    //       type: PieceType.ROOK,
    //       color: PieceColor.BLACK,
    //       pos: { x: 4, y: 7 },
    //     },
    //   };
    //
    //   // Move the white king but remain in check
    //   const move: Move = {
    //     from: { x: 4, y: 4 },
    //     to: { x: 4, y: 5 },
    //   };
    //
    //   const result = canMoveEscapeCheck(game, move, PieceColor.WHITE);
    //   expect(result).toBe(false);
    // });
    //
    // it("uses the provided myColor argument if given", () => {
    //   const game: ChessGame = createTestGame({
    //     toPlay: PieceColor.BLACK, // Set the current turn to black
    //   });
    //
    //   // Place white king
    //   game.board[4][4] = {
    //     piece: {
    //       type: PieceType.KING,
    //       color: PieceColor.WHITE,
    //       pos: { x: 4, y: 4 },
    //     },
    //   };
    //
    //   // Simulate a check against the white king
    //   game.board[4][7] = {
    //     piece: {
    //       type: PieceType.ROOK,
    //       color: PieceColor.BLACK,
    //       pos: { x: 4, y: 7 },
    //     },
    //   };
    //
    //   // Move the white king (explicitly passing `PieceColor.WHITE`)
    //   const move: Move = {
    //     from: { x: 4, y: 4 },
    //     to: { x: 3, y: 4 },
    //   };
    //
    //   const result = canMoveEscapeCheck(game, move, PieceColor.WHITE);
    //   expect(result).toBe(true);
    // });
  });
});

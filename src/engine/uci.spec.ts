import { Move } from "@/engine/types";
import { fromMoveToUCI, fromUCIToMove } from "@/engine/uci";

describe("UCI", () => {
  describe("fromMoveToUCI", () => {
    it("should convert a move to UCI", () => {
      const move: Move = {
        from: {
          x: 1,
          y: 0,
        },
        to: {
          x: 3,
          y: 0,
        },
      };

      const result = fromMoveToUCI(move);
      expect(result).toBe("a2a4");
    });
  });
  describe("fromUCIToMove", () => {
    it("should convert a UCI to a move", () => {
      const uci = "a2a4";
      const result = fromUCIToMove(uci);
      expect(result).toEqual({
        from: {
          x: 1,
          y: 0,
        },
        to: {
          x: 3,
          y: 0,
        },
      });
    });
  });
});

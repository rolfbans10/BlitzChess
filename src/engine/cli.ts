import { createNewChessGame, movePiece } from "@/engine/chess";
import { printBoard } from "@/engine/test-utils";
import { createInterface } from "node:readline";
import { fromUCIToMove, isValidUCIString } from "@/engine/uci";

console.log("Welcome to chess in CLI");

let game = createNewChessGame();

console.log("Starting board:");
printBoard(game.board);

const readInterface = createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("Enter your move in UCI format, ie: e2e4");
readInterface.on("line", (line) => {
  if (isValidUCIString(line)) {
    const move = fromUCIToMove(line);
    game = movePiece(game, move);
    printBoard(game.board);
  } else {
    console.log("Invalid UCI move: " + line);
  }
});

readInterface.on("close", () => {
  console.log("Bye bye!");
});

// read a line of input

import React, { useState } from "react";
import "./App.css";

type CellValue = "x" | "o" | null;
type Player = "x" | "o" | (string & {});

function App() {
  const [board, setBoard] = useState<CellValue[][]>([
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ]);
  function createBoard(rows: number) {
    setBoard(new Array(rows).fill(null).map(() => new Array(rows).fill(null)));
  }

  const [rows, setRows] = useState(3);
  const [currentPlayer, setCurrentPlayer] = useState("x");
  const [gameStatus, setGameStatus] = useState<"continue" | "win" | "draw">(
    "continue"
  );
  const [strikePattern, setStrikePattern] = useState("");

  function renderMarkedCell(c: CellValue) {
    switch (c) {
      case "o":
        return <div className="player-o" />;

      default:
        return <div className="player-x" />;
    }
  }
  const [strikenCells, setStrikenCells] = useState<number[][]>([]);
  const winningStrike = rows < 5 ? 3 : 5;

  function checkGameStatus(
    b: CellValue[][],
    player: Player
  ): "win" | "draw" | "continue" {
    let cellMarked = 0;
    for (let rowIndex in b) {
      let strike = 0;
      const row = b[rowIndex];

      //check horizontally
      for (let cellIndex in row) {
        const cell = row[cellIndex];
        if (cell) {
          cellMarked++;
        }
        if (cell === player) {
          strike++;
        } else {
          strike = 0;
        }

        if (strike === winningStrike) {
          setStrikePattern("horizontal");
          return "win";
        }
      }
      strike = 0;
      //check vertically
      for (let i = 0; i < rows; i++) {
        const cell = b[i][rowIndex];

        if (cell === player) {
          strike++;
        } else {
          strike = 0;
        }

        if (strike === winningStrike) {
          setStrikePattern("vertically");
          return "win";
        }
      }

      //check diagonally top left bottom right
      for (let sum = 0; sum < rows + rows - 1; sum++) {
        strike = 0;
        let winningCells = [];

        for (
          let i = Math.max(0, sum - rows + 1);
          i <= Math.min(sum, rows - 1);
          i++
        ) {
          const row = i;
          const col = sum - i;
          const cell = b[row][col];
          if (cell === player) {
            strike++;
            winningCells.push([row, col]);
          } else {
            strike = 0;
            winningCells = [];
          }

          if (strike === winningStrike) {
            setStrikePattern("diagonal-top-left-bottom-right");
            setStrikenCells(winningCells);
            return "win";
          }
        }
      }

      //check diagonally top right bottom left
      for (let sum = 0; sum < rows + rows - 1; sum++) {
        strike = 0;
        let winningCells = [];
        for (
          let i = Math.max(0, sum - rows + 1);
          i <= Math.min(sum, rows - 1);
          i++
        ) {
          const row = i;
          const col = rows - 1 - (sum - i);
          const cell = b[row][col];
          if (cell === player) {
            strike++;
            winningCells.push([row, col]);
          } else {
            strike = 0;
            winningCells = [];
          }

          if (strike === winningStrike) {
            setStrikePattern("diagonal-top-right-bottom-left");
            setStrikenCells(winningCells);
            return "win";
          }
        }
      }
    }
    if (cellMarked >= rows * rows) return "draw";

    return "continue";
  }
  function renderBoard() {
    return board.map((row, rowIndex) =>
      row.map((cell, columnIndex) => {
        const shouldStrikeCell = strikenCells.find(
          (strikenCell) =>
            rowIndex === strikenCell[0] && columnIndex === strikenCell[1]
        );
        return (
          <div
            className="square"
            onClick={() => {
              if (gameStatus === "win") return;
              if (!cell) {
                const player = currentPlayer === "x" ? "o" : "x";
                setCurrentPlayer(player);
                const newBoard = [...board];
                newBoard[rowIndex][columnIndex] = player;
                setBoard(newBoard);
                const status = checkGameStatus(newBoard, player);

                setGameStatus(status);
              }
            }}
          >
            {cell && <>{renderMarkedCell(cell)}</>}
            {shouldStrikeCell && <div className={strikePattern} />}{" "}
          </div>
        );
      })
    );
  }

  console.log("strikencells", strikenCells);
  return (
    <div className="App">
      <div>
        <div>
          Board Size: {rows}x{rows}
        </div>
        <input
          type="number"
          value={rows}
          onChange={(e) => {
            setRows(Number(e.target.value));
            createBoard(Number(e.target.value));
          }}
        />
      </div>
      <div className="board" style={{ width: rows * 72 }}>
        {renderBoard()}
      </div>
      {gameStatus === "win" && <div> {currentPlayer.toUpperCase()} won!</div>}
      {gameStatus === "draw" && <div> It's a draw</div>}
    </div>
  );
}

export default App;

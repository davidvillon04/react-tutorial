import { useState } from "react";

function Square({ value, onSquareClick, highlight }) {
   return (
      <button
         className={"square" + (highlight ? " highlight" : "")}
         onClick={onSquareClick}
         style={{
            color: value === "X" ? "red" : value === "O" ? "blue" : "inherit",
         }}
      >
         {value}
      </button>
   );
}

function Board({ xIsNext, squares, onPlay }) {
   function handleClick(i) {
      if (calculateWinner(squares) || squares[i]) {
         return;
      }

      const nextSquares = squares.slice();
      if (xIsNext) {
         nextSquares[i] = "X";
      } else {
         nextSquares[i] = "O";
      }
      onPlay(nextSquares);
   }

   const winInfo = calculateWinner(squares);
   let status;
   if (winInfo) {
      status = "Winner: " + winInfo.winner;
   } else {
      status = "Next player: " + (xIsNext ? "X" : "O");
   }

   return (
      <>
         <div className="status">{status}</div>
         <div className="board-row">
            {squares.slice(0, 3).map((sq, i) => (
               <Square
                  key={i}
                  value={sq}
                  onSquareClick={() => handleClick(i)}
                  highlight={winInfo && winInfo.line.includes(i)}
               />
            ))}
         </div>
         <div className="board-row">
            {squares.slice(3, 6).map((sq, i) => (
               <Square
                  key={i + 3}
                  value={sq}
                  onSquareClick={() => handleClick(i + 3)}
                  highlight={winInfo && winInfo.line.includes(i + 3)}
               />
            ))}
         </div>
         <div className="board-row">
            {squares.slice(6, 9).map((sq, i) => (
               <Square
                  key={i + 6}
                  value={sq}
                  onSquareClick={() => handleClick(i + 6)}
                  highlight={winInfo && winInfo.line.includes(i + 6)}
               />
            ))}
         </div>
      </>
   );
}

function calculateWinner(squares) {
   const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
   ];

   for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
         return { winner: squares[a], line: lines[i] };
      }
   }
   return null;
}

export default function Game() {
   const [history, setHistory] = useState([Array(9).fill(null)]);
   const [currentMove, setCurrentMove] = useState(0);
   const xIsNext = currentMove % 2 === 0;
   const currentSquares = history[currentMove];

   function handlePlay(nextSquares) {
      const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
      setHistory(nextHistory);
      setCurrentMove(nextHistory.length - 1);
   }

   function jumpTo(nextMove) {
      setCurrentMove(nextMove);
   }

   const moves = history.map((squares, move) => {
      let description;
      if (move > 0) {
         description = "Go to move #" + move;
      } else {
         description = "Go to game start";
      }
      return (
         <li key={move}>
            <button onClick={() => jumpTo(move)}>{description}</button>
         </li>
      );
   });

   return (
      <div className="game">
         <div className="game-board">
            <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
         </div>
         <div className="game-info">
            <ol>{moves}</ol>
         </div>
      </div>
   );
}

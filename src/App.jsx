import { useState } from "react";
import "./App.css";

function calculateWinner(square) {
  if (!square) return null;

  const winnerLines = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [3, 4, 5],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [6, 7, 8],
  ];

  for (let i = 0; i < winnerLines.length; i++) {
    const [a, b, c] = winnerLines[i];
    if (square[a] && square[a] === square[b] && square[b] === square[c]) {
      // console.log(`a: ${a} square[a]: ${square[a]}`);
      // console.log(`b: ${b} square[b]: ${square[b]}`);
      // console.log(`c: ${c} square[c]: ${square[c]}`);

      return square[a];
    }
  }

  for (let i = 0; i < square.length; i++) {
    if (!square[i]) return null;
  }

  return "D";
}

function App() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currStep, setCurrStep] = useState(0);
  const chance = currStep % 2 !== 0; // odd hai kya
  const currentSquare = history[currStep];

  function onChangeHandler(nexthistory) {
    const slicedHistory = history.slice(0, currStep + 1);
    const updatedHistory = [...slicedHistory, nexthistory];
    setHistory(updatedHistory);
    setCurrStep(updatedHistory.length - 1);
  }

  function jumpTo(move) {
    if (move >= 0 && move < history.length) {
      setCurrStep(move);
    }
  }

  function restartHandler() {
    setHistory([Array(9).fill(null)]);
    setCurrStep(0);
  }

  let status;
  const winner = calculateWinner(currentSquare);

  if (winner) {
    if (winner === "D") {
      status = `Match Draw`;
    } else {
      status = `Winner ${winner}`;
    }
  } else {
    status = `Player turn: ${chance ? "O" : "X"}`;
  }

  const moves = history.map((_, moveNo) => {
    let description;
    if (moveNo > 0) {
      description = `Go to move$ ${moveNo}`;
    } else {
      description = "Go to start the game";
    }

    return (
      <li key={moveNo}>
        <button onClick={() => jumpTo(moveNo)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div>
        <div className="ground">
          <div className="status">
            <div
              style={{
                backgroundColor: "pink",
                padding: "2px 4px",
              }}
            >
              {status}
            </div>
          </div>
          <Square
            value={currentSquare}
            changeHandler={onChangeHandler}
            chance={chance}
          />
        </div>
        <div>
          <button onClick={restartHandler}>Restart</button>
        </div>
      </div>
      <div className="description">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function Square({ value, changeHandler, chance }) {
  return (
    <div className="board">
      {value.map((_, idx) => (
        <SquareButton
          key={idx}
          square={value}
          idx={idx}
          changeHandler={changeHandler}
          chance={chance}
        />
      ))}
    </div>
  );
}

function SquareButton({ square, idx, changeHandler, chance }) {
  function onClickHandler() {
    if (calculateWinner(square)) {
      return;
    }
    if (!square[idx]) {
      let newState = square.slice();
      newState[idx] = chance ? "O" : "X";
      changeHandler(newState);
    }
  }

  return (
    <button className="square" onClick={onClickHandler}>
      {square[idx]}
    </button>
  );
}

export default App;

import './style/App.css';
import { useState } from 'react';

function Squere ({value, onSquareClick}){
  return <button onClick={onSquareClick} className='squere'>{value}</button>;
} 

function WinnerLine({styleLine, classLine}){
  return(
    <>
      <div style={styleLine} className={classLine}></div>
    </>
  )
}

function Board({xIsNext, onPlay, squares, moves, onMenu, player1, player2}) {
  let winnerLine = false;

  function handleClick (i){
    if(calculateWinner(squares).winner || squares[i]){
      return;
    }
    const nextSquares = squares.slice();

    if(xIsNext) nextSquares[i] = "✖";
    else nextSquares[i] = "〇";

    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  const draw = calculateDraw(squares);

  let status;
  let styleLine = {};
  let classLine = "winnerLine";

  if(winner.winner){
    const square = document.getElementsByClassName("squere");
    const squareHeight = square[0].getBoundingClientRect().height;
    let k = (winner.winnerItems[1] / 3) < 1 ? 0 : Math.floor(winner.winnerItems[1] / 3);

    status = "Winner: " + (winner.winner === "✖" ? player1 : player2) + "!";
    winnerLine = true;

    if(winner.winnerItems[0] + 1 === winner.winnerItems[1] && winner.winnerItems[1] + 1 === winner.winnerItems[2]) {
      styleLine.top = (squareHeight / 2) + squareHeight * k + 5 * k;
      classLine += " row";
      
    } else if(winner.winnerItems[0] + 3 === winner.winnerItems[1] && winner.winnerItems[1] + 3 === winner.winnerItems[2]){
      k = +winner.winnerItems[0];
      styleLine.left = (squareHeight / 2) + squareHeight * k + 5 * k;
      classLine += " line"
    } else if(winner.winnerItems[0] + 4 === winner.winnerItems[1] && winner.winnerItems[1] + 4 === winner.winnerItems[2]){
      classLine += " across-left";
    } else{
      classLine += " across-right";
    }
  }
  else if(draw) status = "Draw!";
  else status = "Next player: " + (xIsNext ? player1 : player2) + "!";
  return (
    <div className='game-board'>
      <button className='back' onClick={onMenu}>back to menu</button>
      <div className='status'>{status}</div>
      <div className='board'>
        {winnerLine ? <WinnerLine classLine={classLine} styleLine={styleLine} /> : null}
        <div className='board-row'>
          <Squere value={squares[0]} onSquareClick={() => handleClick(0)}/>
          <Squere value={squares[1]} onSquareClick={() => handleClick(1)}/>
          <Squere value={squares[2]} onSquareClick={() => handleClick(2)}/>
        </div>
        <div className='board-row'>
          <Squere value={squares[3]} onSquareClick={() => handleClick(3)}/>
          <Squere value={squares[4]} onSquareClick={() => handleClick(4)}/>
          <Squere value={squares[5]} onSquareClick={() => handleClick(5)}/>
        </div>
        <div className='board-row'>
          <Squere value={squares[6]} onSquareClick={() => handleClick(6)}/>
          <Squere value={squares[7]} onSquareClick={() => handleClick(7)}/>
          <Squere value={squares[8]} onSquareClick={() => handleClick(8)}/>
        </div>
      </div>
      <ol className="game-info">
        <h2 className='game-info-title' >History</h2>
        <div className='game-info-items'>
          {moves}
        </div>
      </ol>
    </div>
  )
}

function Menu({onMenu, onChangePlayer}){
  return (
    <form className='game-menu' action='#' onSubmit={(e) => {
      let player1Value = document.getElementById("player1").value;
      let player2Value = document.getElementById("player2").value;

      if(player1Value && player2Value){
        onMenu();
        onChangePlayer(player1Value, player2Value);
      }else{
        e.currentTarget.classList.add("error");
      }
    }}>
      <div className="player">
        <label htmlFor="player1">Please write name player 1</label>
        <input type="text" id='player1' placeholder='Name player one'/>
      </div>
      <div className="player">
        <label htmlFor="player2">Please write name player 2</label>
        <input type="text" id='player2' placeholder='Name player Two'/>
      </div>
      <button className='start' type='submit'>Start Game</button>
    </form>
  )
}
export default function Game(){
  const [history, sethistory] = useState([Array(9).fill(null)]);
  const [currentMove, setcurrentMove] = useState(0);
  const [menu, setMenu] = useState(true);
  const [player1, setPlayer1] = useState("✖");
  const [player2, setPlayer2] = useState("〇");
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  
  function handlePlay(nextSquares){
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    sethistory(nextHistory);
    setcurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove){
    setcurrentMove(nextMove);
  }

  function handlMenu(menu){
    setMenu(!menu);
    sethistory([Array(9).fill(null)]);
    setcurrentMove(0)
    setPlayer1("✖");
    setPlayer1("〇");
  }
  
  function handleChangePlayer(player1, player2){
    if(player1 && player2){
      setPlayer1(player1);
      setPlayer2(player2);
    }
  }

  let moves = history.map((squares, move) => {
    let desctiption;
    if(move > 0) desctiption = "Go to move #" + move;
    else desctiption = "Go to start";

    return(
      <li className='history-item' key={move}>
        <button onClick={() => jumpTo(move)}>{desctiption}</button>
      </li>
    )
  })
  return(
    <div className='game'>
      <h1 className='game-title'>Tic-Tac-Toe</h1>
      <div className='game-main'>
        {menu ? 
        <Menu onMenu={() => handlMenu(menu)} onChangePlayer={handleChangePlayer}/> :
        <Board xIsNext={xIsNext} onPlay={handlePlay} squares={currentSquares} moves={moves}
        onMenu={() => handlMenu(menu, player1, player2)} player1={player1} player2={player2}/>
        }
      </div>
    </div>
  )
}

function calculateWinner(squares){
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  let result = {winner: null, winnerItems: null,};
  for(let i = 0; i < lines.length; i++){
    const [a, b, c] = lines[i];
    if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
      result.winner = squares[a];
      result.winnerItems = [a, b, c];
      return result;
    }
  }
  return result;
}

function calculateDraw(squares){
  let result = [];
  for(let i = 0; i < squares.length; i++){
    if(squares[i]) result.push(squares[i]);
  }
  if(result.length === squares.length) return true;
  else false;
}
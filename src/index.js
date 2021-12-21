import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
      <button className="square" onClick={props.onClick}>
        {props.highlight
          ? <div className="highlight">{props.value}</div>
          : <div>{props.value}</div>
        }
      </button>
    )
}
  
class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        highlight={this.props.highlight[i]}
        key={i}
      />
    );
  }

  render() {
    return (
      <div>
        {
          Array(3).fill(0).map((row, i) => {
            return (
              <div className="board-row" key={i}>
                {
                  Array(3).fill(0).map((col, j) => {
                    return (
                      this.renderSquare(i * 3 + j)
                    )
                  })
                }
              </div>
            )
          })
        }
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      highlight: Array(9).fill(false),
      positionHistory: [null],
      stepNumber: 0,
      xIsNext: true,
      ascending: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const positionHistory = this.state.positionHistory.slice(0, this.state.stepNumber + 1);
    
    if (squares[i]) {
      return;
    }

    const result = calculateWinner(squares)
    const winner = result[0]

    if (winner) {
      return;
    }
    
    const player = this.state.xIsNext ? "X" : "O"
    squares[i] = player;
    positionHistory.push(`(${player}, ${parseInt(i%3)}, ${parseInt(i/3)})`)

    this.setState({
      history: history.concat([
        {
          squares: squares,
        },
      ]),
      positionHistory: positionHistory,
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const result = calculateWinner(current.squares)
    const winner = result[0];
    const highlight = result[1];
    
    const player = this.state.xIsNext ? "X" : "O"

    const moves = history.map((step, move) => {
      const desc = move ? `Go to move #${move} ${this.state.positionHistory[move]}` : "Go to game start";
      if (move === this.state.stepNumber) {
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>
              <div className='current'>
                {desc}
              </div>
            </button>
          </li>
        )
      }
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = `Next player: ${player}`;
    }

    if (!this.state.ascending) {
      moves.reverse();
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            highlight={highlight}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.setState({ascending: !this.state.ascending})}>
            {this.state.ascending ? "降順" : "昇順"}
          </button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

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
  var highlight = Array(9).fill(false)
  var winner = null;
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      highlight[a] = true;
      highlight[b] = true;
      highlight[c] = true;
      winner = squares[a];
    }
  }
  return [winner, highlight];
}

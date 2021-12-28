import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

type SquareState = 'O' | 'X' | null;

type SquareProps = {
  value: SquareState;
  onClick: () => void;
};

function Square(props: SquareProps) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

type BoardProps = {
  squares: SquareState[];
  xIsNext: boolean;
  onClick: (i: number) => void;
};

class Board extends React.Component<BoardProps> {
  renderSquare(i: number) {
    return <Square value={this.props.squares[i]} onClick={() => this.props.onClick(i)} />;
  }

  render() {
    const winner = calculateWinner(this.props.squares);
    let status: string;

    if (winner) {
      status = `Winner: ${winner}`;
    } else {
      status = `Next player: ${this.props.xIsNext ? 'X' : 'O'}`;
    }

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

type GameState = {
  squares: SquareState[];
  xIsNext: boolean;
};

class Game extends React.Component<any, GameState> {
  constructor(props: any) {
    super(props);
    this.state = {
      squares: [null, null, null, null, null, null, null, null, null],
      xIsNext: true,
    };
  }

  handleClick(i: number) {
    const squares = this.state.squares.slice();

    if (squares[i] || calculateWinner(squares)) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
    });
  }

  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board squares={this.state.squares} xIsNext={this.state.xIsNext} onClick={(i) => this.handleClick(i)} />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares: Array<SquareState>) {
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
    if (squares[a] && squares[a] == squares[b] && squares[a] == squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(<Game />, document.getElementById('root'));

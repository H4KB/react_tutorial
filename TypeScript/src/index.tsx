import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

type Player = 'O' | 'X';
type SquareState = Player | null;
type Position = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

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
  onClick: (i: Position) => void;
};

class Board extends React.Component<BoardProps> {
  renderSquare(i: Position) {
    return <Square value={this.props.squares[i]} onClick={() => this.props.onClick(i)} />;
  }

  render() {
    return (
      <div>
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

type HistoryData = {
  squares: SquareState[];
  xIsNext: boolean;
  clickPosition: Position | null;
};

type GameState = {
  history: HistoryData[];
  stepNumber: number;
};

type HistoryButtonProps = {
  onClick: () => void;
  desc: string;
};

function HistoryButton(props: HistoryButtonProps) {
  return (
    <li>
      <button onClick={props.onClick}>{props.desc}</button>
    </li>
  );
}

function HighlightHistoryButton(props: HistoryButtonProps) {
  return (
    <li>
      <button onClick={props.onClick}>
        <div className="current">{props.desc}</div>
      </button>
    </li>
  );
}

class Game extends React.Component<any, GameState> {
  constructor(props: any) {
    super(props);
    this.state = {
      history: [
        {
          squares: [null, null, null, null, null, null, null, null, null],
          xIsNext: true,
          clickPosition: null,
        },
      ],
      stepNumber: 0,
    };
  }

  handleClick(i: Position) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const xIsNext = current.xIsNext;

    if (squares[i] || calculateWinner(squares)) {
      return;
    }

    squares[i] = xIsNext ? 'X' : 'O';

    this.setState({
      history: history.concat([
        {
          squares: squares,
          xIsNext: !xIsNext,
          clickPosition: i,
        },
      ]),
      stepNumber: history.length,
    });
  }

  jumpTo(move: number) {
    this.setState({
      stepNumber: move,
    });
  }

  render() {
    const history = this.state.history.slice();
    const current = history[this.state.stepNumber];
    const squares = current.squares.slice();
    const xIsNext = current.xIsNext;

    const moves = history.map((step, move) => {
      const clickPosition = step.clickPosition;

      const player = step.xIsNext ? 'O' : 'X';
      const x = clickPosition !== null ? clickPosition % 3 : '';
      const y = clickPosition !== null ? parseInt((clickPosition / 3).toString()) : '';
      const desc = move ? `Go to move #${move} (${player}: ${x}, ${y})` : 'Go to game start';

      if (move === this.state.stepNumber) {
        return <HighlightHistoryButton key={move} desc={desc} onClick={() => this.jumpTo(move)} />;
      } else {
        return <HistoryButton key={move} desc={desc} onClick={() => this.jumpTo(move)} />;
      }
    });

    const winner = calculateWinner(squares);
    let status: string;

    if (winner) {
      status = `Winner: ${winner}`;
    } else {
      status = `Next player: ${xIsNext ? 'X' : 'O'}`;
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board squares={squares} onClick={(i) => this.handleClick(i)} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
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

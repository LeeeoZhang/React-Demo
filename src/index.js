import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
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
            return squares[a];
        }
    }
    return null;
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        )
    }
    render() {
            let rows = []
            for(let i = 0; i<3; i++) {
                let row = []
                for (let j = 3 * i; j < 3 * i + 3; j++) {
                    row.push(this.renderSquare(j))
                }
                rows.push(<div className="board=row" key={i}>{row}</div>)
            }
            return (
                <div>
                    {rows}
                </div>
            )
    }
}

class Game extends React.Component {
    constructor() {
        super()
        this.state = {
            history: [{
                squares: Array(9).fill(null)
            }],
            xIsNext: true,
            stepNumber: 0,
            reverse: false
        }
    }
    handleClick(i) {
        const history = this.state.history
        const current = history[this.state.stepNumber]
        const squares = current.squares.slice()
        if(calculateWinner(squares) || squares[i]) {
            return
        }
        squares[i] = this.state.xIsNext? 'X' : 'O'
        const location = `(${Math.floor(i%3)}, ${Math.floor(i/3)})`
        const desc = squares[i] + 'move to' + location
        this.setState({
            history: history.concat([{
                squares: squares,
                desc: desc

            }]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length
        })
    }
    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) ? false : true
        })
    }
    reverse() {
        this.setState({
            reverse: !this.state.reverse
        })
    }
    render() {
        let history = this.state.history
        const current = history[this.state.stepNumber]
        const winner = calculateWinner(current.squares)
        if(this.state.reverse) {
            history = this.state.history.slice()
            history.reverse()
        }
        const moves = history.map((step, move) => {
            const desc = step.desc || 'Game start'
            if(move === this.state.stepNumber) {
                return (
                    <li key={move}>
                        <a href="#" onClick={() => this.jumpTo(move)}><strong>{desc}</strong></a>
                    </li>
                )
            }
            return (
                <li key={move}>
                    <a href="#" onClick={() => this.jumpTo(move)}>{desc}</a>
                </li>
            )
        })
        let status
        if(winner) {
            status = 'Winner: ' + winner
        } else {
            status = `Next player: ${this.state.xIsNext? 'X' : 'O'}`
        }
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick = {(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <button onClick={() => this.reverse()}>reverse</button>
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
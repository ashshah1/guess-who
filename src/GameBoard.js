import './GameBoard.css';
import Card from './Card.js';



function GameBoard(props) {
    let names = props.names;

    let allCard = names.map((name) => {
        return (<Card name={name}></Card>)
    })

    return (
        <div className="board-container">
            <div className="cards-container">
                {allCard}
            </div>
        </div>
    )

}

export default GameBoard;
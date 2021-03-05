import './GameBoard.css';
import Card from './Card.js';



function GameBoard(props) {
    let names = props.names;

    // Creates an array of Card elements to populate the board
    let allCard = names.map((name) => {
        return (<Card name={name} onClick={() => props.onClick(name)} status={props.status}></Card>)
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
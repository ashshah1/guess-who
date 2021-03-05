import './GamePlay.css';
import GameBoard from './GameBoard.js';
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

function GamePlay(props) {

    let names = props.names;
    console.log(names);

    return (
        <div>
            <div className="game-play-page">&nbsp;</div>
            <GameBoard names={names}></GameBoard>
            <div className="chat">&nbsp;</div>
            
            <Link to="/">
                <Button className="quit-button" variant="danger">quit game</Button>
            </Link>
        </div>
    )
}

export default GamePlay;
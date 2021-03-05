import './GamePlay.css';
import GameBoard from './GameBoard.js';
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

function GamePlay(props) {

    let names = props.names;

    if (props.playing) {
        return (
            <div>
                <div className="game-play-page">&nbsp;</div>
                <GameBoard names={names} onClick={props.onClick} status={props.status}></GameBoard>
                
                <Link to="/">
                    <Button className="quit-button" variant="danger">quit game</Button>
                </Link>
            </div>
        )
    } else {
        let msg = props.host ? "waiting for opponent to join" : "loading game...";
        return (
            <div>
                <div className="game-play-page">&nbsp;</div>    
                <p className="typewriter">{msg}</p>
                <Link to="/">
                    <Button className="quit-button" variant="danger">quit game</Button>
                </Link>
            </div>
        )
    }
}

export default GamePlay;
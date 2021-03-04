import './GamePlay.css';
import GameBoard from './GameBoard.js';

function GamePlay(props) {

    let names = props.names;
    console.log(names);

    return (
        <div>
            <div className="game-play-page">&nbsp;</div>
            <GameBoard names={names}></GameBoard>
            <div className="chat">&nbsp;</div>
        </div>
    )
}

export default GamePlay;
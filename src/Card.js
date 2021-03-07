import './Card.css';
import { useState } from 'react';
import {Button} from "react-bootstrap";

function Card(props) {
    const [isShown, setIsShown] = useState(false);
    const [isCrossed, setCrossed] = useState(false);

    if (props.startRound && isCrossed) {
        setCrossed(false);
    }

    // on mouse enter over card, update state to reveal guess button
    const onEnter = () => {
        setIsShown(true);
    }

    // once mouse leaves, update state to hide guess button
    const onLeave = () => {
        setIsShown(false)
    }

    let classNames = "card-container";
    let decor = "";

    const onGuess = () => {
        props.onClick();
    };


    // by default, guess button should be hidden (unless card is hovered upon) and guess button should be active
    let visibility = "guess hidden";

    // if card is hovered on, reveal guess button
    if (isShown) {
        visibility = "guess";
    }

    // hide guess buttons if it's not your turn
    if (!props.status) {
        visibility = "hidden";
    }

    // if a card is clicked, run a strike through the name and hide the guess button
    if (isCrossed) {
        decor = "decor"; // updates className for the text, strikesthrough and turns it grey
        visibility = "hidden"; // hides guess button
        classNames = "card-container card-clicked";
    }

    return (
        <div className="col-md-2 col-lg-2">
            <div className={classNames} onClick={() => setCrossed(!isCrossed)} onMouseEnter={onEnter} onMouseLeave={onLeave}>
                <p className={decor}>{props.name}</p>
                <div className={visibility}>
                    <Button variant="outline-success" onClick={onGuess}>GUESS</Button>
                </div>
            </div>
        </div>
    )
}

export default Card;
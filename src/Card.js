import './Card.css';
import { useState } from 'react';
import {Button} from "react-bootstrap";

function Card(props) {
    const [isShown, setIsShown] = useState(false);
    const [isCrossed, setCrossed] = useState(false);
    const [newRound, setRound] = useState(props.startRound);
    //
    // if (newRound) {
    //     setCrossed(false);
    //     setRound(false);
    // } else {
    //     setRound(false);
    // }

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
   
    // when card is clicked on, update state
    const handleClick = () => {
        setRound(false);
        if (isCrossed) {
            setCrossed(false);
        } else {
            setCrossed(true);
        }
    }


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
    // console.log(props);
    if (isCrossed && newRound) {
        decor = "decor"; // updates className for the text, strikesthrough and turns it grey
        visibility = "hidden" // hides guess button
        classNames = "card-container card-clicked";
    }

    // if (props.startRound) {
    //     classNames = "card-container";
    // }

    return (
        <div className="col-md-2 col-lg-2">
            <div className={classNames} onClick={handleClick} onMouseEnter={onEnter} onMouseLeave={onLeave}>
                <p className={decor}>{props.name}</p>
                <div className={visibility}>
                    <Button variant="outline-success" onClick={props.onClick}>GUESS</Button>
                </div>
            </div>
        </div>
    )
}

export default Card;
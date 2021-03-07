import './Card.css';
import { useState } from 'react';

function Card(props) {
    const [isShown, setIsShown] = useState(false);
    const [isCrossed, setCrossed] = useState(false);

    // on mouse enter over card, update state to reveal guess button
    const onEnter = () => {
        setIsShown(true);
    }

    // once mouse leaves, update state to hide guess button
    const onLeave = () => {
        setIsShown(false)
    }

    let decor = "";

   
    // when card is clicked on, update state
    const handleClick = () => {
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
    if (isCrossed) {
        decor = "decor"; // updates className for the text, strikesthrough and turns it grey
        visibility = "hidden" // hides guess button
    }


    return (
        <div className="col-md-2 col-lg-2">
            <div className="card-container" onClick={handleClick} onMouseEnter={onEnter} onMouseLeave={onLeave}>
                <p className={decor}>{props.name}</p>
                <button className={visibility} onClick={props.onClick}>GUESS</button>
            </div>
        </div>
    )
}

export default Card;
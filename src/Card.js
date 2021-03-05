import './Card.css';
import { useState } from 'react';

function Card(props) {
    const [isShown, setIsShown] = useState(false);

    const onEnter = () => {
        setIsShown(true);
    }

    const onLeave = () => {
        setIsShown(false)
    }

    let hidden = "guess hidden";
    if (isShown) {
        hidden = "guess";
    }

    return (
        <div className="card-container" onMouseEnter={onEnter} onMouseLeave={onLeave}>
            <p>{props.name}</p>
            <button className={hidden} onClick={props.onClick}>GUESS</button>
        </div>
    )
}

export default Card;
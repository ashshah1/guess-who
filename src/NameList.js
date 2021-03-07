import './NameList.css';

import { useState } from 'react'

function NameElem(props) {
    const [isShown, setIsShown] = useState(false);

    let name = props.name;

    const onEnter = () => {
        setIsShown(true);
    }

    // once mouse leaves, update state to hide guess button
    const onLeave = () => {
        setIsShown(false)
    }

    let personas = "personas";
    // if card is hovered on, reveal guess button
    if (isShown) {
        personas = "personas line-through zoom";
    }


    // lets user click on a name to remove it
    const handleClick = (event) => {
        props.removeName(name)
    }
        
    return (
        <p className={personas} onClick={handleClick} onMouseEnter={onEnter} onMouseLeave={onLeave}>{props.name}</p>
    )
}


function NameList(props) {

let namesArray = [];

    for (let i = 0; i < props.names.length; i++) {
        let newName = <NameElem name={props.names[i]} removeName={props.removeName}></NameElem>
        namesArray.push(newName);
    }


    return (
        <div className="name-container">
            {namesArray}
        </div>
    )

}



export default NameList;
import './NameList.css';

function NameList(props) {

let namesArray = [];

    for (let i = 0; i < props.names.length; i++) {
        let newName = <p className="personas">{props.names[i]}</p>
        namesArray.push(newName);
    }


    return (
        <div className="name-container">
            {namesArray}
        </div>
    )

}


export default NameList;
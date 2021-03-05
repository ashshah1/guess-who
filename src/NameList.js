import './NameList.css';

function NameElem(props) {
let name = props.name;

    // lets user click on a name to remove it
    const handleClick = (event) => {
        props.removeName(name)
    }
        
    return (
        <p className="personas" onClick={handleClick}>{props.name}</p>
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
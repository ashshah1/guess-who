import './NameList.css';

// passed in props.names[i] from prev
function NameElem(props) {
let name = props.name;

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
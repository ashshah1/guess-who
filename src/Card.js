import './Card.css';


function Card(props) {
    return (
        <div className="card-container">
            <p>{props.name}</p>
        </div>
    )
}

export default Card;
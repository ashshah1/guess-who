import './Newsfeed.css'

function Newsfeed(props) {
    // const [updates, setUpdates] = useState([]);
    //
    // // add update
    // const addUpdate = (newUpdate) => {
    //     setUpdates([...updates].push(newUpdate));
    // };
    //
    // const handleSubmit = (event) => {
    //     event.preventDefault();
    //     alert(question);
    //     props.onClick(question)
    //     // props.addNameCallback(inputtedValue)
    //     // setInputtedValue("");
    // };
    let updates = props.updates;
    let items = updates.map((update) => {
        let updateClass = "neither-update";
        if (update.who === "me") {
            updateClass = "my-update"
        } else if (update.who === "them") {
            updateClass = "their-update"
        }
        return (
            <div className={updateClass}>
                {update.msg}
            </div>)
    })




    return (
        <div className="newsfeed">
            <div className="news-title">ACTIVITY</div>
            <div className="update-container">{items}</div>
        </div>
    );
}

export default Newsfeed;
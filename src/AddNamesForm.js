import { useState } from 'react';
import './AddNamesForm.css';

function AddNamesForm(props) {
    const [inputtedValue, setInputtedValue] = useState("");

    let currNames = props.names;

    const handleChange = (event) => {
        let newVal = event.target.value;
        setInputtedValue(newVal)
    }
    

    const handleSubmit = (event) => {
        event.preventDefault();
        props.addNameCallback(inputtedValue)
        setInputtedValue("");
    }

    const getAskButton = () => {
        if (((inputtedValue.split(" ").join("")) === "") || currNames.includes(inputtedValue) || currNames.length >= 24) {
            return (<button className="add-button btn btn-light" disabled>add name</button>);
        } else {
            return (<button className="add-button btn btn-light">add name</button>);
        }
    };


    return (
        <form className="names-form" onSubmit={handleSubmit}>
            <input className="add-name form-control form-control-lg" placeholder="add another name" value={inputtedValue} onChange={handleChange} />
            {getAskButton()}
        </form>
    );
}

export default AddNamesForm;
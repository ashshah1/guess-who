import { useState } from 'react';
import './AddNamesForm.css';

function AddNamesForm(props) {
    const [inputtedValue, setInputtedValue] = useState("");


    const handleChange = (event) => {
        let newVal = event.target.value;
        setInputtedValue(newVal)
    }

    
    const handleSubmit = (event) => {
        event.preventDefault();
        props.addNameCallback(inputtedValue)
        setInputtedValue("");
    }


    return (
        <form className="names-form" onSubmit={handleSubmit}>
            <input className="add-name form-control form-control-lg" placeholder="add another name" value={inputtedValue} onChange={handleChange} />
            <button className="add-button btn btn-light">Add name</button>
        </form>
    );
}

export default AddNamesForm;
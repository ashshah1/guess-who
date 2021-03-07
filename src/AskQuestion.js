import React, {useState} from "react";
import {Button} from "react-bootstrap";

import './Game.css';

function AskQuestion(props) {
    const [question, setQuestion] = useState("");


    const handleSubmit = (event) => {
        event.preventDefault();
        props.onClick(question)
        setQuestion("");
    };

    const getAskButton = () => {
        if (question === "") {
            return (<Button type="submit" variant="success" disabled>ask question</Button>);
        } else {
            return (<Button type="submit" variant="success">ask question</Button>);
        }
    };


    return (
        <div className="question-container">
            <form className="ask-question"  onSubmit={handleSubmit}>
                <label>
                    <input
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="ask your opponent a question"
                        disabled={props.disabled}
                    >
                    </input>
                </label>
                {getAskButton()}
            </form>
        </div>
    );
}

export default AskQuestion;
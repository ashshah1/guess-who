import { Button } from 'react-bootstrap';
import './LandingPage.css';
import { Link, useHistory } from "react-router-dom";
import background from "./images/landing-bg.png";
import React, { useState } from 'react';



function LandingPage() {
    let history = useHistory();
    const [code, setCode] = useState("");

    function onJoinSubmit(e) {
        history.push({
            pathname: '/toe',
            state: {code: code}
        });
    }

    // Return disabled button if code entered is not correct length
    const getJoinButton = () => {
        if (code.length !== 5) {
            return (<Button type="submit" variant="warning" className="btn btn-join" disabled>JOIN GAME</Button>);
        } else {
            return (<Button type="submit" variant="warning" className="btn btn-join">JOIN GAME</Button>);
        }
    }

    const onInputChange = (e) => {
        if (e.target.value.length <= 5) {
            setCode(e.target.value);
        }
    }

    return(
        <main className="landing-container">
            <img className="background" src={background} />
                <div>
                    <h1 className="top-header">guess who?</h1>
                    <div className="launch-container">
                        <form  onSubmit={onJoinSubmit}>
                            <label>
                                <input
                                    id="room"
                                    name="code"
                                    value={code}
                                    onChange={onInputChange}
                                    placeholder="ENTER ROOM CODE">
                                </input>
                            </label>
                            {getJoinButton()}
                        </form>
                        <p>or</p>
                        <Link to="/prep">
                            <Button className="btn btn-info btn-start">START YOUR OWN GAME</Button>
                        </Link>
                    </div>
                </div>
        </main>
    )
}

export default LandingPage;
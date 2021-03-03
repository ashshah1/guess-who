import { Button } from 'react-bootstrap';
import './LandingPage.css';
import { Link, useHistory } from "react-router-dom";
import background from "./images/landing-bg.png";
import React, { useState } from 'react';

function LandingPage() {
    let history = useHistory();
    const [code, setCode] = useState(0);

    function onJoinSubmit(event) {
        history.push({
            pathname: '/toe',
            state: {code: code}
        });
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
                                    type="text"
                                    name="code"
                                    onChange={(e) => setCode(e.target.value)}
                                    placeholder="ENTER ROOM CODE">
                                </input>
                            </label>
                            <Button type="submit" className="btn btn-join">JOIN GAME</Button>
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
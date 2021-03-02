import React from 'react';
import { Button } from 'react-bootstrap';
import './LandingPage.css';
import background from "./images/landing-bg.png";

function LandingPage() {
    return(
        <main className="container">
            <img className="background" src={background} />
            <div>
                <h1 className="top-header">guess who?</h1>
                <div className="launch-container">
                    <form>
                        <label>
                            <input type="text" name="code" placeholder="ENTER ROOM CODE"></input>
                        </label>
                    </form>
                    <p>or</p>
                    <button className="btn btn-info">START YOUR OWN GAME</button>
                </div>
            </div>
        </main>
    )
}

export default LandingPage;
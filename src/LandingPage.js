import { Button } from 'react-bootstrap';
import './LandingPage.css';
import { Link } from "react-router-dom";
import background from "./images/landing-bg.png";

function LandingPage() {
    return(
        <main className="landing-container">
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
                        <Link to="/prep">
                            <button className="btn btn-info">START YOUR OWN GAME</button>
                        </Link>
                    </div>
                </div>
        </main>
    )
}

export default LandingPage;
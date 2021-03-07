import './App.css';
import React, { useState } from "react";
import { BrowserRouter, Switch, Route, Link, useLocation } from "react-router-dom";
import LandingPage from './LandingPage.js';
import About from './About.js';
import Privacy from './Privacy.js';
import HowToPlay from './HowToPlay.js';
import Lobby from './Lobby.js';
import Game from './Game.js';
import SetUp from './SetUp.js';
import 'bootstrap/dist/css/bootstrap.min.css';



function App() {


  const SAMPLE_NAMES = ["test1", "test2", "test3", "test4", "test5", "test6", "test7", "test8", "test9", "test10", "test11", "test12", "test13", "test14", "test15", "test16", "test17", "test18", "test19", "test20", "Test21", "test22", "test23", "Test24"];

  const [names, setNames] = useState(SAMPLE_NAMES);

    // Adds a new name to the array, updated list of names is saved as "names" and can be passed to other components
    const addName = (newName) => {
        let newPerson = newName;
        let updatedNames = [...names]
        updatedNames.push(newPerson)
        setNames(updatedNames);
    }

    // Removes name from the names array and updates the list, triggered by clicking on a name 
    const removeName = (cutName) => {
      let index = names.indexOf(cutName);
      let updatedNames = [...names]
      if (index !== -1) {
        updatedNames.splice(index, 1);
      }
      setNames(updatedNames);
    }

  return (
    <BrowserRouter>
      <div className="app-container">
        <NavBar/>

      {/* A <Switch> looks through its children <Route>s and
          renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/about" component={About} />
          <Route path="/privacy" component={Privacy} />
          <Route path="/how" component={HowToPlay}/>
          <Route exact path="/" component={LandingPage} />
          <Route path="/lobby" component={Lobby} />
          <Route path="/prep">
            <SetUp names={names} addName={addName} removeName={removeName}/>
          </Route>
          <Route path="/play">
            <Game names={names}/>
          </Route>

        </Switch>
      </div>
    </BrowserRouter>
  );
}

const NavBar  = () => {
  const location = useLocation();
  const navClass = location.pathname === "/"
      ? "nav-bar-bottom"
      : "nav-bar";
  return (
      <nav className={navClass}>
        <ul className="nav-container">
          <li className="home">
            <Link exact to="/" className="nav-link">guess who?</Link>
          </li>
          <li>
            <Link to="/about" className="nav-link">About</Link>
          </li>
          <li>
            <Link to="/how" className="nav-link">How To Play</Link>
          </li>
          <li>
            <Link to="/privacy" className="nav-link">Privacy Policy</Link>
          </li>
        </ul>
      </nav>
  )
};

export default App;

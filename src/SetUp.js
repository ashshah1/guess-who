import AddNamesForm from './AddNamesForm.js'
import { useState } from 'react';
import NameList from './NameList.js'
import { Button } from 'react-bootstrap'

import './SetUp.css';
import {Link} from "react-router-dom";


function SetUp (props) {

    let names = props.names;

    // sets class names for the button to active if the user has reached 24 names
    let status = true;
    let variant = "secondary"
    if (names.length === 24) {
        status = false;
        variant = "success";
    }

    return (
        <div>
            <div className="set-up-page">&nbsp;</div>
            <p className="counter">{names.length} / 24 names added</p>
            <NameList names={names} removeName={props.removeName}></NameList>
            <AddNamesForm addNameCallback={props.addName}></AddNamesForm>
            <Link to={{
                pathname: '/toe',
                state: {
                    code: null,
                    names: names
                }
            }}>
                <Button className="start-button" variant={variant} disabled={status}>start game</Button>
            </Link>
        </div>
    )
}

export default SetUp;
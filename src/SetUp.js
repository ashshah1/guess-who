import AddNamesForm from './AddNamesForm.js'
import { useState } from 'react';
import NameList from './NameList.js'
import { Button } from 'react-bootstrap'

import './SetUp.css';
import {Link} from "react-router-dom";


function SetUp (props) {

    let names = props.names;

    return (
        <div>
            <div className="set-up-page">&nbsp;</div>
            <p className="counter">{names.length} / 24 names added</p>
            <NameList names={names}></NameList>
            <AddNamesForm addNameCallback={props.addName}></AddNamesForm>
            <Link to={{
                pathname: '/toe',
                state: {
                    code: null
                }
            }}>
                <Button className="start-button" variant="secondary">start game</Button>
            </Link>
        </div>
    )
}

export default SetUp;
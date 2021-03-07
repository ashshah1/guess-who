import './Newsfeed.css'
import {useState} from "react";
import React, { Component } from 'react';

function Newsfeed(props) {
    const [newsRef, setRef] = useState(React.createRef());
    if (newsRef.current != null) {
        newsRef.current.scrollTop = newsRef.current.scrollHeight;
    }


    let updates = props.updates;
    let messenger = "";
    let items = updates.map((update) => {
        let updateClass = "neither-update";
        if (update.who === "me") {
            updateClass = "my-update"
            messenger = "personal"
        } else if (update.who === "them") {
            updateClass = "their-update"
            messenger = "opponent"
        }
        return (
            <div className={updateClass}>
                <p className={messenger}>{update.who}</p>
                {update.msg}
            </div>)
    })

    return (
        <div className="newsfeed">
            <div className="news-title">ACTIVITY</div>
            <div className="update-container" ref={newsRef}>{items}</div>
        </div>
    );
}

export default Newsfeed;
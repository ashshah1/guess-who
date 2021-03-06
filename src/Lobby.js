import React, { Component } from 'react';
import GameController from './GameController';
import { Redirect } from "react-router-dom";
import PubNubReact from 'pubnub-react';
import Swal from "sweetalert2";  
import shortid  from 'shortid';
import Game from "./Game";
import uuid from 'react-uuid'
import './Game.css';
import AskQuestion from "./AskQuestion";

class Lobby extends Component {
    constructor(props) {
        super(props);
        // use for testing purposed to simulate different users on local host
        let myUUID = uuid();
        this.pubnub = new PubNubReact({
            publishKey: "pub-c-885874fe-b734-481e-9c92-500e37e5aaa0",
            subscribeKey: "sub-c-d3a9aef4-7bb7-11eb-8096-3e6ae84b74ea",
            uuid: myUUID
        });

        this.state = {
            player: null,
            isPlaying: false,
            isRoomCreator: false,
            myTurn: false,
            gameEnded: false,
            names: (this.props.location.state !== undefined) ?
                this.props.location.state.names : null
        };

        this.lobbyChannel = null;
        this.gameChannel = null;
        this.roomId = null;
        this.pubnub.init(this);

    }

    // Create or join lobby
    componentDidMount() {
        // create or join room one board loads
        if (this.props.location.state !== undefined) {
            if (this.props.location.state.code === null) {
                this.onPressCreate();
            } else {
                this.joinRoom(this.props.location.state.code);
            }
        }
    }

    // Leave channels
    componentWillUnmount() {
        this.pubnub.unsubscribe({
            channels : [this.lobbyChannel, this.gameChannel]
        });
    }

    // Listen for incoming messages (opponent joined, board names received)
    componentDidUpdate() {
        // Check that the player is connected to a channel
        if(this.lobbyChannel != null){
            // listener for all incoming messages
            this.pubnub.getMessage(this.lobbyChannel, (msg) => {
                // start the game once an opponent joins the channel
                if(msg.message.notRoomCreator){
                    // publish board names for opponent's use
                    this.pubnub.publish({
                      message: {
                        names: this.state.names
                      },
                      channel: this.lobbyChannel
                    });

                    // create a different channel for the game
                    this.gameChannel = 'tictactoegame--' + this.roomId;

                    this.pubnub.subscribe({
                      channels: [this.gameChannel]
                    });

                    this.setState({
                      isPlaying: true
                    });

                    // close the modals if they are opened
                    Swal.close();
                } else if (msg.message.names !== undefined) {
                    // get board names
                    let names = msg.message.names;
                    this.setState({
                        names: names,
                        person: names[Math.floor(Math.random() * 24)]
                    });
                }
            });
        }
    }

    // Create a room channel
    onPressCreate = (e) => {
        // Create a random name for the channel
        this.roomId = shortid.generate().substring(0,5);
        this.lobbyChannel = 'tictactoelobby--' + this.roomId;

        this.pubnub.subscribe({
            channels: [this.lobbyChannel],
            withPresence: true
        });

        // Open the modal
        Swal.fire({
            position: 'top',
            allowOutsideClick: false,
            title: 'Share this room ID with your friend',
            text: this.roomId,
            width: 275,
            padding: '0.7em',
            // Custom CSS
            customClass: {
                heightAuto: false,
                title: 'title-class',
                popup: 'popup-class',
                confirmButton: 'button-class'
            }
        });

        this.setState({
            player: 1,
            isRoomCreator: true,
            myTurn: true, // Room creator makes the 1st move
            person: this.state.names[Math.floor(Math.random() * 24)]
        });
    };

    // Join a room channel
    joinRoom = (value) => {
        this.roomId = value;
        this.lobbyChannel = 'tictactoelobby--' + this.roomId;

        // Check the number of people in the channel
        this.pubnub.hereNow({
            channels: [this.lobbyChannel],
        }).then((response) => {
            if(response.totalOccupancy < 2){
                this.pubnub.subscribe({
                    channels: [this.lobbyChannel],
                    withPresence: true
                });

                this.setState({
                    player: 2,
                });

                // tells other player someone has joined channel
                this.pubnub.publish({
                    message: {
                        notRoomCreator: true,
                    },
                    channel: this.lobbyChannel
                });
            } else {
                // Game in progress
                Swal.fire({
                    position: 'top',
                    allowOutsideClick: false,
                    title: 'Error',
                    text: 'Game in progress. Try another room.',
                    width: 275,
                    padding: '0.7em',
                    customClass: {
                        heightAuto: false,
                        title: 'title-class',
                        popup: 'popup-class',
                        confirmButton: 'button-class'
                    }
                });
                this.setState({inProgress: true})
            }
        }).catch((error) => {
          console.log(error);
        });
    };

    // Reset everything
    endGame = () => {
        this.setState({
            player: null,
            isPlaying: false,
            isRoomCreator: false,
            myTurn: false,
            gameEnded: true
        });

        this.lobbyChannel = null;
        this.gameChannel = null;
        this.roomId = null;

        this.pubnub.unsubscribe({
            channels : [this.lobbyChannel, this.gameChannel]
        });
    };
  
    render() {
        // navigate to home if user did not navigate to page correctly
        if (this.props.location.state === undefined || this.state.gameEnded || this.state.inProgress) {
            return (
                <Redirect to="/"/>
            );
        }

        // display lobby if waiting for opponent
        if (!this.state.isPlaying && this.state.isRoomCreator) {
            return (
                <div>
                    <div className="title">
                        <p className="room-code">room code: {this.roomId}</p>
                    </div>
                    <Game names={this.state.names} host={true} playing={false}></Game>
                </div>
            );
        }

        // display loading board if waiting for names to be received
        if (this.state.isPlaying && this.state.names === undefined) {
            return (
                <div>
                    <div className="title">
                        <p className="room-code">room code: {this.roomId}</p>
                    </div>
                    <Game names={this.state.names} host={false} playing={false}></Game>
                </div>
            );
        }

        // display game if playing and names for board have loaded
        if (this.state.isPlaying && this.state.names !== undefined) {
            return (
                <div>
                    <GameController
                        pubnub={this.pubnub}
                        gameChannel={this.gameChannel}
                        roomId={this.roomId}
                        player={this.state.player}
                        names={this.state.names}
                        isRoomCreator={this.state.isRoomCreator}
                        myTurn={this.state.myTurn}
                        endGame={this.endGame}
                    />
                </div>
            )
        }

        // display lobby or game depending on if game in progress
        return (
            <div></div>
        );
    }
}

export default Lobby;

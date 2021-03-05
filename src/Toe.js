import React, { Component } from 'react';
import Game from './Game';
import PubNubReact from 'pubnub-react';
import Swal from "sweetalert2";  
import shortid  from 'shortid';
import GamePlay from "./GamePlay";

 
class Toe extends Component {
  constructor(props) {
    super(props);
    this.pubnub = new PubNubReact({
      publishKey: "pub-c-885874fe-b734-481e-9c92-500e37e5aaa0",
      subscribeKey: "sub-c-d3a9aef4-7bb7-11eb-8096-3e6ae84b74ea"
    });

    this.state = {
      piece: '',
      isPlaying: false,
      isRoomCreator: false,
      isDisabled: false,
      myTurn: false,
      names: this.props.location.state.names
    };

    this.lobbyChannel = null;
    this.gameChannel = null;
    this.roomId = null;
    this.pubnub.init(this);

  }
  componentDidMount() {
    // create or join room one board loads
    if (this.props.location.state.code === null) {
      this.onPressCreate();
    } else {
      this.joinRoom(this.props.location.state.code);
    }
  }

  componentWillUnmount() {
    this.pubnub.unsubscribe({
      channels : [this.lobbyChannel, this.gameChannel]
    });
  }
  
  componentDidUpdate() {
    // Check that the player is connected to a channel
    if(this.lobbyChannel != null){
      // listener for all incoming messages
      this.pubnub.getMessage(this.lobbyChannel, (msg) => {
        // Start the game once an opponent joins the channel
        if(msg.message.notRoomCreator){
          // publish board names for opponent's use
          this.pubnub.publish({
            message: {
              names: this.state.names
            },
            channel: this.lobbyChannel
          });

          // Create a different channel for the game
          this.gameChannel = 'tictactoegame--' + this.roomId;

          this.pubnub.subscribe({
            channels: [this.gameChannel]
          });

          this.setState({
            isPlaying: true
          });

          // Close the modals if they are opened
          Swal.close();
        } else if (msg.message.names !== undefined) {
          // Get board names
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
  })

    this.setState({
      piece: 'X',
      isRoomCreator: true,
      isDisabled: true, // Disable the 'Create' button
      myTurn: true, // Room creator makes the 1st move

      person: this.state.names[Math.floor(Math.random() * 24)]
    });   
  }
  
  // The 'Join' button was pressed
  onPressJoin = (e) => {
    Swal.fire({
      position: 'top',
      input: 'text',
      allowOutsideClick: false,
      inputPlaceholder: 'Enter the room id',
      showCancelButton: true,
      confirmButtonColor: 'rgb(208,33,41)',
      confirmButtonText: 'OK',
      width: 275,
      padding: '0.7em',
      customClass: {
        heightAuto: false,
        popup: 'popup-class',
        confirmButton: 'join-button-class ',
        cancelButton: 'join-button-class'
      } 
    }).then((result) => {
      // Check if the user typed a value in the input field
      if(result.value){
        this.joinRoom(result.value);
      }
    })
  }

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
            piece: 'O',
          });  

          // tells other player someone has joined channel
          this.pubnub.publish({
            message: {
              notRoomCreator: true,
            },
            channel: this.lobbyChannel
          });
        } 
        else{
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
          })
        }
    }).catch((error) => { 
      console.log(error);
    });
  }

  // Reset everything
  endGame = () => {
    this.setState({
      piece: '',
      isPlaying: false,
      isRoomCreator: false,
      isDisabled: false,
      myTurn: false,
    });

    this.lobbyChannel = null;
    this.gameChannel = null;
    this.roomId = null;  

    this.pubnub.unsubscribe({
      channels : [this.lobbyChannel, this.gameChannel]
    });
  }
  
  render() {
    return (
        // display lobby or game depending on if game in progress
        <div>
          {
            (!this.state.isPlaying && this.state.names !== undefined) &&
              <div>
                <div className="title">
                  <p>Lobby - React Tic Tac Toe: {this.roomId}</p>
                </div>
                <GamePlay names={this.state.names} playing={false}></GamePlay>
              </div>
          }

          {
            (this.state.isPlaying && this.state.names !== undefined) &&
            <div>
              <div className="title">
                <p>Game - React Tic Tac Toe: {this.roomId}</p>
              </div>
              <Game
                  pubnub={this.pubnub}
                  gameChannel={this.gameChannel}
                  piece={this.state.piece}
                  isRoomCreator={this.state.isRoomCreator}
                  myTurn={this.state.myTurn}
                  xUsername={this.state.xUsername}
                  oUsername={this.state.oUsername}
                  endGame={this.endGame}

                  names={this.state.names}
              />
            </div>
          }
        </div>
    );  
  } 
}

export default Toe;

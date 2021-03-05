import React from 'react';
import Swal from "sweetalert2";
import GamePlay from "./GamePlay";

import './GamePlay.css';

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      xScore: 0,
      oScore: 0,
      whosTurn: this.props.myTurn,
      names: this.props.names,
      person: this.props.names[Math.floor(Math.random() * 24)]
    };

    this.turn = 'X';
    this.gameOver = false;
  }

  componentDidMount(){
    // get moves
    this.props.pubnub.getMessage(this.props.gameChannel, (msg) => {
      // Publish move to the opponent's board
      if(msg.message.turn === this.props.piece) {
        this.publishQuestion(msg.message.guess, msg.message.piece);
      } else if (msg.message.winner !== undefined) {
        this.announceWinner(msg.message.winner);
      }

      // Start a new round
      else if(msg.message.reset){
        this.setState({
          squares: Array(9).fill(''),
          whosTurn : this.props.myTurn,
          person: this.state.names[Math.floor(Math.random() * 24)]
        });

        this.turn = 'X';
        this.gameOver = false;
        this.counter = 0;
        Swal.close()
      }

      // End the game and go back to the lobby
      else if(msg.message.endGame){
        Swal.close();
        this.props.endGame();
      }
    });
  }

  newRound = (winner) => {
    let title = (winner === null) ? 'Tie game!' : `Player ${winner} won!`;
    // Show this if the player is not the room creator
    if((this.props.isRoomCreator === false) && this.gameOver){
      Swal.fire({  
        position: 'top',
        allowOutsideClick: false,
        title: title,
        text: 'Waiting for a new round...',
        confirmButtonColor: 'rgb(208,33,41)',
        width: 275,
        customClass: {
            heightAuto: false,
            title: 'title-class',
            popup: 'popup-class',
            confirmButton: 'button-class',
        } ,
      });
      this.turn = 'X'; // Set turn to X so Player O can't make a move 
    } 

    // Show this to the room creator
    else if(this.props.isRoomCreator && this.gameOver){
      Swal.fire({      
        position: 'top',
        allowOutsideClick: false,
        title: title,
        text: 'Continue Playing?',
        showCancelButton: true,
        confirmButtonColor: 'rgb(208,33,41)',
        cancelButtonColor: '#aaa',
        cancelButtonText: 'Nope',
        confirmButtonText: 'Yea!',
        width: 275,
        customClass: {
            heightAuto: false,
            title: 'title-class',
            popup: 'popup-class',
            confirmButton: 'button-class',
            cancelButton: 'button-class'
        } ,
      }).then((result) => {
        // Start a new round
        if (result.value) {
          this.props.pubnub.publish({
            message: {
              reset: true
            },
            channel: this.props.gameChannel
          });
        }

        else{
          // End the game
          this.props.pubnub.publish({
            message: {
              endGame: true
            },
            channel: this.props.gameChannel
          });
        }
      })      
    }
   }

  // Update score for the winner
  announceWinner = (winner) => {
		let pieces = {
			'X': this.state.xScore,
			'O': this.state.oScore
		}
	
		if(winner === 'X'){
			pieces['X'] += 1;
			this.setState({
				xScore: pieces['X']
			});
		}
		else{
			pieces['O'] += 1;
			this.setState({
				oScore: pieces['O']
			});
		}
		// End the game once there is a winner
		this.gameOver = true;
		this.newRound(winner);	
  }
  
  checkForWinner = (guess) => {
    if (guess === this.state.person) {
      let winner = (this.props.piece === 'X') ? 'O' : 'X';
      // send winner to opponent
      this.props.pubnub.publish({
        message: {
          winner: winner
        },
        channel: this.props.gameChannel
      });
      this.announceWinner(winner);
    }
  };
   
  // Opponent's question is published to game
  publishQuestion = (guess, piece) => {
    this.turn = (piece === 'X')? 'O' : 'X';

    this.setState({
      whosTurn: !this.state.whosTurn
    });

    this.checkForWinner(guess);
  }

  // handle making a guess
  onGuess = (guess) => {
    if(this.turn === this.props.piece) {
      this.setState({
        whosTurn: !this.state.whosTurn
      });

      // Other player's turn to make a move
      this.turn = (this.turn === 'X') ? 'O' : 'X';

      // send guess to opponent
      this.props.pubnub.publish({
        message: {
          guess: guess,
          piece: this.props.piece,
          turn: this.turn
        },
        channel: this.props.gameChannel
      });
    }

  };

  render() {
    let status;
    // Change to current player's turn
    status = `${this.state.whosTurn ? "Your turn" : "Opponent's turn"}`;

    let currStatus;
    if (status === "Your turn") {
      currStatus = "green";
    } else {
      currStatus = "red";
    }

    // let names = this.props.names !== undefined ? this.props.names : [];
    return (
        <div>
          <p className="status-info" style={{color: currStatus}}>{status}</p>
          <GamePlay names={this.props.names} onClick={guess => this.onGuess(guess)} playing={true} status={status}></GamePlay>
          <p className="your-person">{this.state.person}</p>
          <p className="guess-descrip">this is who your opponent is trying to guess</p>
        </div>
    );
  }
}

export default Game;

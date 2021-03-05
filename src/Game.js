import React from 'react';
import Swal from "sweetalert2";
import GamePlay from "./GamePlay";

import './GamePlay.css';

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pOneScore: 0,                                                   // player one score
            pTwoScore: 0,                                                   // player two score
            whoseTurn: this.props.myTurn,                                   // true for my turn; false otherwise
            names: this.props.names,                                        // board names; initially null if guest
            person: this.props.names[Math.floor(Math.random() * 24)]     // my person
        };

        this.turn = 1;
        this.gameOver = false;
    }

    // Listen for messages
    componentDidMount(){
        // Get messages
        this.props.pubnub.getMessage(this.props.gameChannel, (msg) => {
            if (msg.message.turn === this.props.player) {
                // Publish move to the opponent's board
                this.publishQuestion(msg.message.guess, msg.message.player);
            } else if (msg.message.winner !== undefined) {
                this.announceWinner(msg.message.winner);
            } else if (msg.message.reset) {
                // Start a new round
                this.setState({
                    whoseTurn : this.props.myTurn,
                    person: this.state.names[Math.floor(Math.random() * 24)]
                });

                this.turn = 1;
                this.gameOver = false;
                Swal.close()
            } else if(msg.message.endGame) {
                // End the game and go back to the lobby
                Swal.close();
                this.props.endGame();
            }
        });
    }

    // Handle making a guess
    onGuess = (guess) => {
        // check it's player's turn
        if(this.turn === this.props.player) {
            this.setState({
                whoseTurn: !this.state.whoseTurn
            });

            // toggle turn
            this.turn = (this.turn === 1) ? 2 : 1;

            // send guess to opponent
            this.props.pubnub.publish({
                message: {
                    guess: guess,
                    player: this.props.player,
                    turn: this.turn
                },
                channel: this.props.gameChannel
            });
        }
    };

    // Publish opponents guess to the board
    publishQuestion = (guess, player) => {
        // toggle turn
        this.turn = (player === 1) ? 2 : 1;
        this.setState({
            whoseTurn: !this.state.whoseTurn
        });

        this.checkForWinner(guess);
    };

    // Check for correct guess
    checkForWinner = (guess) => {
        if (guess === this.state.person) {
            let winner = (this.props.player === 1) ? 2 : 1;
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

    // Update score for the winner
    announceWinner = (winner) => {
        let pieces = {
            'one': this.state.pOneScore,
            'two': this.state.pTwoScore
        };
        if(winner === 1){
            pieces['one'] += 1;
            this.setState({
                pOneScore: pieces['one']
            });
        } else {
            pieces['two'] += 1;
            this.setState({
                pTwoScore: pieces['two']
            });
        }
        // End the game once there is a winner
        this.gameOver = true;
        this.newRound(winner);
    };

    // Display prompt for new round & start new round if applicable
    newRound = (winner) => {
        let title = winner === this.props.player ? 'you won!' : 'you lost!'
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
            this.turn = 1; // Set turn to player 1 so player 2 can't make a move
        } else if (this.props.isRoomCreator && this.gameOver) {
            // Show this to the room creator
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
                if (result.value) {
                    // Start a new round
                    this.props.pubnub.publish({
                        message: {
                          reset: true
                        },
                        channel: this.props.gameChannel
                    });
                } else {
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
    };

    render() {
        let status;
        // Change to current player's turn
        status = `${this.state.whoseTurn ? "Your turn" : "Opponent's turn"}`;

        let currStatus;
        if (status === "Your turn") {
            currStatus = "green";
        } else {
            currStatus = "red";
        }

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

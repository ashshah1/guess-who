import React from 'react';
import Swal from "sweetalert2";
import Game from "./Game";

import './Game.css';
import AskQuestion from "./AskQuestion";
import Newsfeed from "./Newsfeed";

class GameController extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pOneScore: 0,                                                   // player one score
            pTwoScore: 0,                                                   // player two score
            whoseTurn: this.props.myTurn,                                   // true for my turn; false otherwise
            names: this.props.names,                                        // board names; initially null if guest
            person: this.props.names[Math.floor(Math.random() * 24)],    // my person
            updates: []                                                     // newsfeed updates
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
                if (msg.message.guess !== undefined) {
                    this.publishGuess(msg.message.guess, msg.message.player);
                } else if (msg.message.question !== undefined) {
                    this.publishQuestion(msg.message.question, msg.message.player);
                }
            } else if (msg.message.answer !== undefined && msg.message.player !== this.props.player) {
                // Get opponent's answer
                this.addUpdate("they answered " + msg.message.answer, "them");
            } else if (msg.message.winner !== undefined && msg.message.player !== this.props.player) {
                this.announceWinner(msg.message.winner);
            } else if (msg.message.reset) {
                this.gameOver = false;
                Swal.close()
            } else if(msg.message.endGame) {
                // End the game and go back to the lobby
                Swal.close();
                this.props.endGame();
            }
        });
    }

    // update newsfeed
    addUpdate = (msg, who) => {
        this.setState(prevState => ({
            updates: [...prevState.updates, {"msg": msg, "who": who}]
        }))
    }


    // Handle making asking a question
    onQuestion = (question) => {
        // check it's player's turn
        if(this.turn === this.props.player) {
            this.setState({
                whoseTurn: !this.state.whoseTurn
            });

            this.turn = (this.turn === 1) ? 2 : 1;

            // send guess to opponent
            this.props.pubnub.publish({
                message: {
                    question: question,
                    player: this.props.player,
                    turn: this.turn
                },
                channel: this.props.gameChannel
            });
        }
        this.addUpdate("you asked '" + question + "'", "me");
    };

    // Publish opponents question
    publishQuestion = (question, player) => {
        // toggle turn
        this.turn = (player === 1) ? 2 : 1;
        this.setState({
            whoseTurn: !this.state.whoseTurn
        });

        this.addUpdate("they asked '" + question + "'", "them");

        Swal.fire({
            position: 'top',
            allowOutsideClick: false,
            title: question,
            text: "answer the question about " + this.state.person,
            showCancelButton: true,
            confirmButtonColor: '#28A744',
            cancelButtonColor: 'rgb(208,33,41)a',
            cancelButtonText: 'no',
            confirmButtonText: 'yes',
            width: 275,
            customClass: {
                heightAuto: false,
                title: 'title-class',
                popup: 'popup-class',
                confirmButton: 'button-class',
                cancelButton: 'button-class'
            } ,
        }).then((result) => {
            let answer = result.value ? "yes" : "no";
            this.addUpdate("you answered " + answer, "me");
            this.props.pubnub.publish({
                message: {
                    player: this.props.player,
                    answer: answer
                },
                channel: this.props.gameChannel
            });
        })
    };

    // Handle making a guess
    onGuess = (guess) => {
        // check it's player's turn
        if(this.turn === this.props.player) {
            this.setState({
                whoseTurn: !this.state.whoseTurn
            });

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

            // update newsfeed
            this.addUpdate("you guessed " + guess, "me");
        }
    };

    // Publish opponents guess to the board
    publishGuess = (guess, player) => {
        // toggle turn
        this.turn = (player === 1) ? 2 : 1;
        this.setState({
            whoseTurn: !this.state.whoseTurn
        });

        this.addUpdate("they guessed " + guess, "them");

        this.checkForWinner(guess);
    };

    // Check for correct guess
    checkForWinner = (guess) => {
        if (guess === this.state.person) {
            let winner = (this.props.player === 1) ? 2 : 1;
            // send winner to opponent
            this.props.pubnub.publish({
                message: {
                    winner: winner,
                    player: this.props.player
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
        let title = winner === this.props.player ? 'you won!' : 'you lost!';
        this.addUpdate(title, "neither");
        // Show this if the player is not the room creator
        if(this.props.isRoomCreator === false && this.gameOver){
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

        // set up for new round
        let newPerson = this.newPerson();
        this.setState({
            whoseTurn : winner === this.props.player,
            person: newPerson
        });

        this.turn = winner;
        this.gameOver = false;
    };

    newPerson = () => {
        let newPerson = this.state.person;
        while (newPerson === this.state.person) {
            newPerson = this.state.names[Math.floor(Math.random() * 24)];
        }
        return newPerson;
    };

    render() {
        let status;
        // Change to current player's turn
        status = `${this.turn == this.props.player ? "Your turn" : "Opponent's turn"}`;

        let currStatus;
        if (status === "Your turn") {
            currStatus = "green";
        } else {
            currStatus = "red";
        }

        return (
            <div className="play-container">
                <div className="game-controller">
                    <div className="game-board">
                        <Game
                            names={this.props.names}
                            onClick={guess => this.onGuess(guess)}
                            playing={true}
                            status={this.turn === this.props.player}>
                        </Game>
                    </div>
                    <div className="game-info">
                        <p className="status-info" style={{color: currStatus}}>{status}</p>
                        <AskQuestion onClick={this.onQuestion} disabled={this.turn !== this.props.player}/>
                        <Newsfeed updates={this.state.updates}/>
                    </div>
                </div>
                <p className="your-person">{this.state.person}</p>
                <p className="guess-descrip">this is who your opponent is trying to guess</p>
            </div>
        );
    }
}

export default GameController;

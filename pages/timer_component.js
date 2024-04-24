import React, { Component } from 'react';

class TimerComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      timer: 20,
    };
  }

  componentDidMount() {
    this.timerID = setInterval(() => {
      this.setState((prevState) => ({
        timer: prevState.timer + 1,
      }));
    }, 1000); // Update the timer every 1 second (1000 milliseconds)
  }

  formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  }

  componentWillUnmount() {
    clearInterval(this.timerID); // Clear the timer when the component is unmounted
  }

  render() {
    return (
      <div>
        <h1>Timer: {this.formatTime(this.state.timer)} </h1>
      </div>
    );
  }
}

export default TimerComponent;

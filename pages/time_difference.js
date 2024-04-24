import React, { Component } from 'react';

class TimerComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timers: [
        { id: 1, startTime: "10:35:51" },
        { id: 2, startTime: "11:30:00" },
        { id: 3, startTime: "12:45:15" },
        { id: 4, startTime: "14:15:30" },
      ],
    };
    this.timerIDs = {};
  }

  componentDidMount() {
    this.startTimers();
  }

  componentWillUnmount() {
    this.clearTimers();
  }

  startTimers() {
    const { timers } = this.state;
    timers.forEach((timer) => {
      const { id, startTime } = timer;
      this.timerIDs[id] = setInterval(() => {
        const currentDate = new Date();
        const startDateTime = new Date(`${currentDate.toDateString()} ${startTime}`);
        const currentTimestamp = currentDate.getTime();
        const startTimestamp = startDateTime.getTime();
        const timeDifference = currentTimestamp - startTimestamp;

        // Calculate hours, minutes, and seconds
        const hours = Math.floor(timeDifference / 3600000); // 3600000 milliseconds in an hour
        const minutes = Math.floor((timeDifference % 3600000) / 60000); // 60000 milliseconds in a minute
        const seconds = Math.floor((timeDifference % 60000) / 1000); // 1000 milliseconds in a second

        // Format the result as HH:MM:SS
        const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        this.setState((prevState) => ({
          timers: prevState.timers.map((t) =>
            t.id === id ? { ...t, formattedTime } : t
          ),
        }));
      }, 1000);
    });
  }

  clearTimers() {
    Object.values(this.timerIDs).forEach((timerID) => {
      clearInterval(timerID);
    });
  }

  render() {
    const { timers } = this.state;
    console.log("timers: ", timers)
    return (
      <div>
        {timers.map((timer) => (
          <div key={timer.id}>
            <h1>Timer {timer.id}: {timer.formattedTime}</h1>
          </div>
        ))}
      </div>
    );
  }
}

export default TimerComponent;

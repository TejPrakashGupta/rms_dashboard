import React, { Component } from 'react';

class Clock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTime: '1:20AM',
      currentDay: 'SUN',
      currentDate: '9 May 2021',
    };
  }

  componentDidMount() {
    this.getCurrentTimeDate();
  }

  componentWillUnmount() {
    clearTimeout(this.timerID);
  }

  getCurrentTimeDate = () => {
    const currentTimeDate = new Date();
    const weekday = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const month = ["JAN", "FEB", "MAR", "APR", "May", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const hours = currentTimeDate.getHours();
    const minutes = currentTimeDate.getMinutes();
    const minutesString = minutes < 10 ? `0${minutes}` : minutes;
    const AMPM = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours === 12 ? 12 : hours % 12;
    const currentTime = `${formattedHours}:${minutesString}${AMPM}`;
    const currentDay = weekday[currentTimeDate.getDay()];
    const currentDate = currentTimeDate.getDate();
    const currentMonth = month[currentTimeDate.getMonth()];
    const currentYear = currentTimeDate.getFullYear();
    const fullDate = `${currentDate} ${currentMonth} ${currentYear}`;

    this.setState({
      currentTime,
      currentDay,
      currentDate: fullDate,
    });

    this.timerID = setTimeout(this.getCurrentTimeDate, 500);
  }

  render() {
    const { currentTime, currentDay, currentDate } = this.state;

    return (
      <div>
        <p id="time" className='waiters-datetime text-secondary'>{currentTime} {currentDate}</p>
        {/* <p id="day" style={{ fontSize: '60px', color: '#FF5757' }}>{currentDay}</p>
        <p id="date" style={{ fontSize: '60px', color: '#FF5757' }}>{currentDate}</p> */}
      </div>
    );
  }
}

export default Clock;
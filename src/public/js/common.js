import moment from 'https://cdn.jsdelivr.net/npm/moment@2.29.4/+esm'
const compareByStatus = (a, b) => {
    const statusA = moment(a.status);
    const statusB = moment(b.status);
    // So sánh thời gian của hai đối tượng
    if (statusA>statusB) {
      return 1;
    } else if (statusA<statusB) {
      return -1;
    } else {
      return 0;
    }
  }
  const compareByTime = (a, b) => {
    const timeA = moment(a.time);
    const timeB = moment(b.time);
    // So sánh thời gian của hai đối tượng
    if (timeA.isBefore(timeB)) {
      return 1;
    } else if (timeA.isAfter(timeB)) {
      return -1;
    } else {
      return 0;
    }
}
  export {compareByStatus,compareByTime}
const getDate = (dateString) => {
    const date = new Date(dateString);
  
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
  
    const normalDateString = `${day.toString().padStart(2, "0")}.${month.toString().padStart(2, "0")}.${year}`;
  
    return normalDateString;
};

function calculateDaysDifference(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end - start;
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
}

window.getDate = getDate;
window.calculateDaysDifference = calculateDaysDifference;

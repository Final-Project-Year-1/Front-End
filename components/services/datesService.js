const getDate = (dateString) => {
    const date = new Date(dateString);
  
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
  
    const normalDateString = `${day.toString().padStart(2, "0")}.${month.toString().padStart(2, "0")}.${year}`;
  
    return normalDateString;
};

window.getDate = getDate;

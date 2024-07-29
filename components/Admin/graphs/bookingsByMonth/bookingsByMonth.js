

const bookingsUrl = "http://localhost:3000/api/bookings-by-month";

const mockData = [
    { month: 1, totalBookings: 10 },
    { month: 2, totalBookings: 20 },
    { month: 3, totalBookings: 30 },
    { month: 4, totalBookings: 25 },
    { month: 5, totalBookings: 15 },
    { month: 6, totalBookings: 50 },
    { month: 7, totalBookings: 40 },
    { month: 8, totalBookings: 45 },
    { month: 9, totalBookings: 35 },
    { month: 10, totalBookings: 30 },
    { month: 11, totalBookings: 20 },
    { month: 12, totalBookings: 55 }
];

// פונקציה לעדכון הגרף עם הנתונים המדומים
async function updateGraph() {
    const data = mockData; // השתמש בנתונים המדומים

// getData()
// async function getData() {
//     const response = await fetch(bookingsUrl);
//     const data = await response.json()

//     console.log(data);
//     return data;
// }
// {
// set the dimensions and margins of the graph
var margin = { top: 30, right: 30, bottom: 70, left: 60 },
width = document.getElementById('my_dataviz').clientWidth - margin.left - margin.right,
height = document.getElementById('my_dataviz').clientHeight - margin.top - margin.bottom;

// הוספת אובייקט svg לדף
var svg = d3.select("#my_dataviz")
.html("") // נקה את ה-svg הקודם
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// ציר X
var x = d3.scaleBand()
.range([0, width])
.domain(data.map(function (d) { return d.month; }))
.padding(0.2);
svg.append("g")
.attr("transform", "translate(0," + height + ")")
.call(d3.axisBottom(x))
.selectAll("text")
.attr("transform", "translate(-10,0)rotate(-45)")
.style("text-anchor", "end");

// ציר Y
var y = d3.scaleLinear()
.domain([0, 100])
.range([height, 0]);
svg.append("g")
.call(d3.axisLeft(y));

// עמודות
svg.selectAll("mybar")
.data(data)
.enter()
.append("rect")
.attr("x", function (d) { return x(d.month); })
.attr("y", function (d) { return y(d.totalBookings); })
.attr("width", x.bandwidth())
.attr("height", function (d) { return height - y(d.totalBookings); })
.attr("fill", "#69b3a2");

// הוספת טקסטים ליד כל עמודה
svg.selectAll("mybar")
.data(data)
.enter()
.append("text")
.attr("x", function (d) { return x(d.month) + x.bandwidth() / 2; })
.attr("y", function (d) { return y(d.totalBookings) - 5; }) // מיקום הטקסט מעל העמודה
.attr("text-anchor", "middle")
.text(function (d) { return d.totalBookings; });

// הוספת תיאור ציר X בתוך המלבן הלבן
svg.append("text")
.attr("text-anchor", "middle")
.attr("transform", "translate(" + (width / 2) + "," + (height + margin.bottom - 30) + ")")
.text("Month");

// הוספת תיאור ציר Y
svg.append("text")
.attr("text-anchor", "middle")
.attr("transform", "rotate(-90)")
.attr("x", -height / 2)
.attr("y", -margin.left + 20)
.text("Total Bookings");
}

// עדכון הגרף עם הנתונים המדומים
updateGraph();

// הוסף מאזין לאירוע חלון שינוי גודל, כדי שהגרף יתעדכן בגודל חדש בעת שינוי גודל חלון
window.addEventListener('resize', updateGraph);
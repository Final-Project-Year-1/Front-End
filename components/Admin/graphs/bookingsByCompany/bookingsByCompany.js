const bookingsUrl = "http://localhost:3000/api/bookings-by-company";

const mockData = [
    { company: "Company A", totalBookings: 100 },
    { company: "Company B", totalBookings: 150 },
    { company: "Company C", totalBookings: 200 },
    { company: "Company D", totalBookings: 50 },
    { company: "Company E", totalBookings: 90 }
];

// פונקציה לעדכון הגרף עם הנתונים מהשרת
function updateGraph() {
    const data = mockData;
// פונקציה לעדכון הגרף עם הנתונים מהשרת
// async function updateGraph() {
//     const data = await getData();

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
    .domain(data.map(function (d) { return d.company; }))
    .padding(0.2);
    svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

    // ציר Y
    var y = d3.scaleLinear()
    .domain([0, d3.max(data, function (d) { return d.totalBookings; })])
    .range([height, 0]);
    svg.append("g")
    .call(d3.axisLeft(y));

    // עמודות
    svg.selectAll("mybar")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", function (d) { return x(d.company); })
    .attr("y", function (d) { return y(d.totalBookings); })
    .attr("width", x.bandwidth())
    .attr("height", function (d) { return height - y(d.totalBookings); })
    .attr("fill", "#69b3a2");

    // הוספת טקסטים ליד כל עמודה
    svg.selectAll("mybar")
    .data(data)
    .enter()
    .append("text")
    .attr("x", function (d) { return x(d.company) + x.bandwidth() / 2; })
    .attr("y", function (d) { return y(d.totalBookings) - 5; }) // מיקום הטקסט מעל העמודה
    .attr("text-anchor", "middle")
    .text(function (d) { return d.totalBookings; });

    // הוספת תיאור ציר X בתוך המלבן הלבן
    svg.append("text")
    .attr("text-anchor", "middle")
    .attr("transform", "translate(" + (width / 2) + "," + (height + margin.bottom - 30) + ")")
    .text("Company");

    // הוספת תיאור ציר Y
    svg.append("text")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -margin.left + 20)
    .text("Total Bookings");
}

async function getData() {
    const response = await fetch(bookingsUrl);
    const data = await response.json();
    console.log(data);
    return data;
}

// עדכון הגרף עם הנתונים מהשרת
updateGraph();

// הוסף מאזין לאירוע חלון שינוי גודל, כדי שהגרף יתעדכן בגודל חדש בעת שינוי גודל חלון
window.addEventListener('resize', updateGraph);

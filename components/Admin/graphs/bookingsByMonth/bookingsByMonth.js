const bookingsUrl = "http://localhost:3000/api/bookings-by-month";
const bookingsByCompanyUrl = "http://localhost:3000/api/bookings-by-company-by-month";

// פונקציה לעדכון הגרף עם הנתונים
function updateGraph(data) {
    if (!data || data.length === 0) {
        console.error('No data to display');
        return;
    }
    renderGraph(data);
}

// פונקציה לרנדר את הגרף
function renderGraph(data) {
    // Remove existing SVG
    d3.select("#my_dataviz").html("");

    // Set dimensions and margins
    var margin = { top: 30, right: 30, bottom: 70, left: 60 },
        width = document.getElementById('my_dataviz').clientWidth - margin.left - margin.right,
        height = document.getElementById('my_dataviz').clientHeight - margin.top - margin.bottom;

    // Append SVG object to the page
    var svg = d3.select("#my_dataviz")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // X axis
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

    // Y axis
    var y = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) { return d.totalBookings; })])
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

    // Bars
    svg.selectAll("mybar")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", function (d) { return x(d.month); })
        .attr("y", function (d) { return y(d.totalBookings); })
        .attr("width", x.bandwidth())
        .attr("height", function (d) { return height - y(d.totalBookings); })
        .attr("fill", "#69b3a2");

    // Add labels to bars
    svg.selectAll("mybar")
        .data(data)
        .enter()
        .append("text")
        .attr("x", function (d) { return x(d.month) + x.bandwidth() / 2; })
        .attr("y", function (d) { return y(d.totalBookings) - 5; })
        .attr("text-anchor", "middle")
        .text(function (d) { return d.totalBookings; });

    // X axis label
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "translate(" + (width / 2) + "," + (height + margin.bottom - 30) + ")")
        .text("Month");

    // Y axis label
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -margin.left + 20)
        .text("Total Bookings");
}

// הוסף מאזין לאירוע חלון שינוי גודל, כדי שהגרף יתעדכן בגודל חדש בעת שינוי גודל חלון
window.addEventListener('resize', async () => {
    const defaultData = await getDefaultData();
    updateGraph(defaultData);
});

document.getElementById('companySelector').addEventListener('change', async (event) => {
    const companyId = event.target.value;
    if (companyId) {
        const data = await getData(companyId);
        updateGraph(data);
    } else {
        const defaultData = await getDefaultData(); // אם לא נבחרה חברה, הצג את הנתונים מברירת המחדל
        updateGraph(defaultData);
    }
});

// Load company list and add options to the selector
async function loadCompanies() {
    const fetchCompaniesListUrl = "http://localhost:3000/api/all-companies";
    try {
        const response = await fetch(fetchCompaniesListUrl);
        const companies = await response.json();
        console.log('Companies:', companies); // בדוק שהנתונים נשלפים נכון
        const companySelector = document.getElementById('companySelector');
        companies.forEach(company => {
            const option = document.createElement('option');
            option.value = company._id;
            option.textContent = company.company;
            companySelector.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading companies:', error);
    }
}

loadCompanies();

async function getDefaultData() {
    try {
        const response = await fetch(bookingsUrl);
        const data = await response.json();
        console.log('Default data:', data); // בדוק שהנתונים נשלפים נכון
        return data;
    } catch (error) {
        console.error('Error fetching default data:', error);
        return [];
    }
}

async function getData(companyId) {
    const url = `${bookingsByCompanyUrl}/${companyId}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

// Initialize with default data
(async () => {
    const defaultData = await getDefaultData();
    updateGraph(defaultData);
})();

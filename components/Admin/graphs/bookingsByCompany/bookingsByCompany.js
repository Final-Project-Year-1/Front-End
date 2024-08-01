
const bookingsByMonthUrl = "http://localhost:3000/api/bookings-by-month";

let allData = []
async function getAllData() {
    try {
        const response = await axios.get(bookingsByMonthUrl)
        const data = await response.data;
        return data;
    } catch (error) {
        console.error('Error fetching data by month:', error);
        return [];
    }
}
(async () => { allData = await getAllData() })()

function getDataByMonth(month) {

    if (!month) return allData;
    let filterdMonth = allData.filter((data) => data.month == Number(month))

    return filterdMonth
}

function updateGraph(data) {
    console.log(data);

    const companyData = data.reduce((acc, d) => {
        const company = acc.find(c => c.company === d.companyName);
        if (company) {
            company.totalBookings += d.totalBookings;
        } else {
            acc.push({ company: d.companyName, totalBookings: d.totalBookings });
        }
        return acc;
    }, []).filter(d => d.totalBookings > 0); 


    if (companyData.length === 0) {
        renderEmptyGraph();
    } else {
        renderGraph(companyData);
    }
}

function renderGraph(data) {
    d3.select("#my_dataviz").html("");

    const margin = { top: 30, right: 30, bottom: 70, left: 60 };
    const width = document.getElementById('my_dataviz').clientWidth - margin.left - margin.right;
    const height = document.getElementById('my_dataviz').clientHeight - margin.top - margin.bottom;

    const svg = d3.select("#my_dataviz")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
        .range([0, width])
        .domain(data.map(d => d.company))
        .padding(0.2);
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.totalBookings)])
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

    svg.selectAll("mybar")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", d => x(d.company))
        .attr("y", d => y(d.totalBookings))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.totalBookings))
        .attr("fill", "#69b3a2");

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", `translate(${width / 2},${height + margin.bottom - 30})`)
        .text("Company");

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -margin.left + 20)
        .text("Total Bookings");
}

function renderEmptyGraph() {
    d3.select("#my_dataviz").html("");

    const margin = { top: 30, right: 30, bottom: 70, left: 60 };
    const width = document.getElementById('my_dataviz').clientWidth - margin.left - margin.right;
    const height = document.getElementById('my_dataviz').clientHeight - margin.top - margin.bottom;

    const svg = d3.select("#my_dataviz")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "24px")
        .style("fill", "#999")
        .text("No Data Available");
}

document.addEventListener('DOMContentLoaded', async () => {
    const monthSelector = document.getElementById('monthSelector');
    for (let month = 1; month <= 12; month++) {
        const option = document.createElement('option');
        option.value = month;
        option.textContent = `Month ${month}`;
        monthSelector.appendChild(option);
    }

    monthSelector.addEventListener('change', async (event) => {
        const selectedMonth = event.target.value;
        const data = getDataByMonth(selectedMonth);
        updateGraph(data);
    });

    const defaultMonth = monthSelector.value || 1; 
    const data = await getAllData(defaultMonth);
    updateGraph(data);
});

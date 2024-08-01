const bookingsUrl = "http://localhost:3000/api/bookings-by-month";
const bookingsByCompanyUrl = "http://localhost:3000/api/bookings-by-company-by-month";

function updateGraph(data) {
    const allMonths = [...Array(12).keys()].map(i => ({ month: i + 1, totalBookings: 0 }));

    if (data && Array.isArray(data)) {
        data.forEach(d => {
            const monthData = allMonths.find(month => month.month === d.month);
            if (monthData) {
                monthData.totalBookings += d.totalBookings;
            }
        });
    }

    renderGraph(allMonths);
}

function renderGraph(data) {
    const noDataMessage = d3.select("#no-data-message");
    const svgContainer = d3.select("#my_dataviz");

    if (data.length === 0 || data.every(d => d.totalBookings === 0)) {
        svgContainer.html(""); 
        noDataMessage.style("display", "block");
        return;
    }

    noDataMessage.style("display", "none");

    svgContainer.html("");

    var margin = { top: 30, right: 30, bottom: 70, left: 60 },
        width = svgContainer.node().clientWidth - margin.left - margin.right,
        height = svgContainer.node().clientHeight - margin.top - margin.bottom;

    var svg = svgContainer
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleBand()
        .range([0, width])
        .domain(data.map(d => d.month))
        .padding(0.2);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    var y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.totalBookings)])
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

    svg.selectAll("mybar")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", d => x(d.month))
        .attr("y", d => y(d.totalBookings))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.totalBookings))
        .attr("fill", "#69b3a2");

    svg.selectAll("mybar")
        .data(data)
        .enter()
        .append("text")
        .attr("x", d => x(d.month) + x.bandwidth() / 2)
        .attr("y", d => y(d.totalBookings) - 5)
        .attr("text-anchor", "middle")
        .text(d => d.totalBookings);

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "translate(" + (width / 2) + "," + (height + margin.bottom - 30) + ")")
        .text("Month");

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -margin.left + 20)
        .text("Total Bookings");
}

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
        const defaultData = await getDefaultData(); 
        updateGraph(defaultData);
    }
});

async function loadCompanies() {
    const fetchCompaniesListUrl = "http://localhost:3000/api/all-companies";
    try {
        const response = await axios.get(fetchCompaniesListUrl);
        const companies = response.data;
        console.log('Companies:', companies); 
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
        const response = await axios.get(bookingsUrl);
        const data = response.data;
        console.log('Default data:', data); 
        return data;
    } catch (error) {
        console.error('Error fetching default data:', error);
        return [];
    }
}

async function getData(companyId) {
    try {
        const url = `${bookingsByCompanyUrl}/${companyId}`;
        const response = await axios.get(url, {
            headers: {
                'Authorization': 'Bearer YOUR_ACCESS_TOKEN' 
            }
        });
        const data = response.data;
        console.log('Company data:', data); 
        return data.bookings; 
    } catch (error) {
        console.error('Error fetching company data:', error);
        return [];
    }
}

(async () => {
    const defaultData = await getDefaultData();
    updateGraph(defaultData);
})();

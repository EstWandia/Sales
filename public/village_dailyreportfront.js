document.addEventListener('DOMContentLoaded', () => {
    //console.log('I am here');

    let soldData = [];

    fetch('/village_dailyreportroute/dailyreport')  // Adjust if backend port differs
        .then(response => response.json())
        .then(data => {
            soldData = data;
            loadDailyReports(soldData);
        })
        .catch(error => console.error('Error loading sold data:', error));

    function loadDailyReports(data) {
        const soldDataTable = document.getElementById('villagedailyreportitems');
        soldDataTable.innerHTML = ''; // Clear table

        if (!data.length) {
            soldDataTable.innerHTML = `<tr><td colspan="9" class="text-center">No items found matching the filters.</td></tr>`;
            return;
        }

       // console.log("Data received:", data);

        // Group data by month
        const monthlyReports = {};
        data.forEach(report => {
            const month = report.sale_date.slice(0, 7);  // YYYY-MM (first 7 characters of sale_date)
            if (!monthlyReports[month]) {
                monthlyReports[month] = [];
            }
            monthlyReports[month].push(report);
        });

        // Sort months (most recent first)
        const sortedMonths = Object.keys(monthlyReports).sort((a, b) => b.localeCompare(a));

        let rowIndex = 0;  // Overall row counter

        sortedMonths.forEach(month => {
            const monthReports = monthlyReports[month];

            // Add month header row
            soldDataTable.innerHTML += `
    <tr class="bg-primary text-white fw-bold">
        <td colspan="9">Month: ${month}</td>
    </tr>`;


            let monthProfit = 0;
            let monthSale = 0;
            let monthQuantity = 0;

            monthReports.forEach((report) => {
                monthProfit += parseFloat(report.total_profit) || 0;
                monthSale += parseFloat(report.total_sale) || 0;
                monthQuantity += parseFloat(report.total_quantity) || 0;

                const dayName = new Date(report.sale_date).toLocaleDateString('en-US', { weekday: 'long' });

                soldDataTable.innerHTML += `
                    <tr>
                        <td>${++rowIndex}</td>
                        <td>${report.sale_date}</td>
                        <td>${dayName}</td> <!-- New column for Day -->
                        <td>${report.total_profit}</td>
                        <td>${report.total_sale}</td>
                        <td>${report.total_quantity}</td>
                        <td>${new Date(report.created_at).toLocaleDateString()}</td>
                        <td>
                            <button class="btn btn-danger btn-sm" onclick="deleteReport('${report.sale_date}')">
                                Delete
                            </button>
                        </td>
                    </tr>`;
            });

            // Add totals row for the month
            soldDataTable.innerHTML += `
                <tr style="font-weight: bold; background-color:rgb(9, 9, 10);">
                    <td colspan="3" class="text-right">Total for ${month}:</td>
                    <td>${monthProfit.toFixed(2)}</td>
                    <td>${monthSale.toFixed(2)}</td>
                    <td>${monthQuantity}</td>
                    <td colspan="3"></td>
                </tr>`;
        });
    }
});

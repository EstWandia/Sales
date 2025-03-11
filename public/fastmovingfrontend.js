document.addEventListener('DOMContentLoaded', () => {
    console.log('ssssssssssssssssssssssssss');

    let FastMoving = []; 

    fetch('/fastmovingroute/fast')
        .then(response => response.json())
        .then(data => {
            FastMoving = data; 
            loadFastMoving(FastMoving); 
        })
        .catch(error => console.error('Error fetching fast-moving items:', error));
});

function loadFastMoving(items) {
    const tableBody = document.getElementById('fastMoving');
    if (!tableBody) {
        console.error('Table body not found!');
        return;
    }
    
    tableBody.innerHTML = ''; // Clear existing rows

    items.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.name || 'Unknown'}</td>
            <td>${item.total_sold}</td>
        `;
        tableBody.appendChild(row);
    });
}

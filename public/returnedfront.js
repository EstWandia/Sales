document.addEventListener('DOMContentLoaded', function () {
    fetchReturnedItems();
});

async function fetchReturnedItems() {
    try {
        const response = await fetch('/returnedroute/returned');
        const data = await response.json();
        populateReturnedItemsTable(data);
    } catch (error) {
        console.error('Error fetching returned items:', error);
    }
}

function populateReturnedItemsTable(items) {
    const tbody = document.getElementById('returnedItems');
    tbody.innerHTML = '';

    items.forEach((item, index) => {
        const row = `
            <tr>
                <td>${index + 1}</td>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>${item.amount}</td>
                <td>${item.state == 1 ? 'cash' : 'mpesa'}</td>
                <td>${new Date(item.createdAt).toLocaleDateString()}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="confirmReturnedItem('${item.id}')">Confirmed</button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

async function confirmReturnedItem(returnId) {
    if (!confirm('Are you sure you want to confirm this item?')) return;

    const response = await fetch(`/returnedroute/retstore/${returnId}/confirm`, { method: 'PUT' });

    if (response.ok) {
        alert('Item confirmed and restored to stock!');
        fetchReturnedItems(); // Refresh table after confirmation
    } else {
        const data = await response.json();
        alert('Failed to confirm item: ' + data.message);
    }
}

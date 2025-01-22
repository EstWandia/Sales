fetch('/dashboarddata/todaycash')
  .then(response => response.json())
  .then(function (data) {
    const dataElement = document.getElementById('dataDisplay');
    dataElement.innerText = data.totalInstock;
  })
  .catch(error => console.error(error));

  fetch('/dashboarddata/sales')
  .then(response => response.json())
  .then(function (data) {
    const dataElement = document.getElementById('dataDisplayy');
    dataElement.innerText = data.totalInstock;
  })
  .catch(error => console.error(error));

fetch('/dashboarddata/items')
  .then(response => response.json())
  .then(function (itemData) {
    const allItemsElement = document.getElementById('allitemsDisplay')
    allItemsElement.innerText = itemData.totalItems;
  })
  .catch(error => console.error(error));

  fetch('/dashboarddata/todayitems')
  .then(response => response.json())
  .then(function (itemData) {
    const allItemsElement = document.getElementById('itemsDisplay')
    allItemsElement.innerText = itemData.totalItems;
  })
  .catch(error => console.error(error));

  
fetch('/dashboarddata/todayprofit')
.then(response => response.json())
.then(function (itemData) {
  const allItemsElement = document.getElementById('profit')
  allItemsElement.innerText = itemData.totalProfit;
})
.catch(error => console.error(error));


// fetch('/dashboarddata/sold')
//   .then(response => {
//     if (!response.ok) {
//       throw new Error('Server Error: ' + response.statusText);
//     }
//     return response.json();
//   })
//   .then(function (data) {
//     console.log(data); // Log the data to check its structure
//     const salesTableBody = document.getElementById('soldDisplay');
//     salesTableBody.innerHTML = ''; // Clear any existing data

//     if (Array.isArray(data)) {
//       data.forEach(item => {
//         const row = document.createElement('tr');
//         row.innerHTML = `
//           <td>
//             <div class="form-check form-check-muted m-0">
//               <label class="form-check-label">
//                 <input type="checkbox" class="form-check-input">
//               </label>
//             </div>
//           </td>
//           <td><span class="ps-2">${item.category_name}</span></td>
//           <td>${item.name}</td>
//           <td>${item.quantity}</td>
//           <td>$${item.amount}</td>
//           <td>${item.status}</td>
//           <td>${item.created_at}</td>
//         `;
//         salesTableBody.appendChild(row); // Add the row to the table
//       });
//     } else {
//       console.error('Expected an array, but received:', data);
//     }
//   })
//   .catch(error => console.error('Error loading sales data:', error));

 const sidebarContainer = document.getElementById('sidebar-container');

fetch('/partials/_sidebar.html')
  .then(response => response.text())
  .then(html => {
    sidebarContainer.innerHTML = html;
  })
  .catch(error => console.error('Error loading sidebar:', error));

  let tableData = []; // Variable to store fetched data

  // Fetch and render the data
  fetch('/dashboarddata/reportitem')
    .then(response => response.json())
    .then(data => {
      tableData = data; // Store fetched data for filtering
      renderTable(tableData); // Render table with fetched data
    })
    .catch(error => console.error('Error loading sales data:', error));
  
  // Function to render the table rows
  function renderTable(data) {
    const salesTableBody = document.getElementById('reportItemsTable');
    salesTableBody.innerHTML = ''; // Clear existing rows
    //data in descending order
    data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));  
    if (Array.isArray(data)) {
      data.forEach((item, index) => {
        const row = document.createElement('tr');
        const formattedDate = item.createdAt ? new Date(item.createdAt).toISOString().slice(0, 19).replace('T', ' ') : 'Unknown';
        row.innerHTML = `
          <td>${index + 1}</td>
          <td>${item.name || 'N/A'}</td>
          <td>${item.in_stock || 0}</td>
          <td>${item.price?.toFixed(2) || '0.00'}</td>
          <td>${formattedDate}</td>
         <td>
        <a href="#" class="mdi mdi-eye" title="View" data-id="${item.id}" onclick="viewItem(event, '${item.id}')"></a>
        <a href="#" class="mdi mdi-pencil" title="Edit" data-id="${item.id}" onclick="editItem(event, '${item.id}')"></a>
        <a href="#" class="mdi mdi-delete" title="Delete" data-id="${item.id}" onclick="deleteItem(event, '${item.id}')"></a>
        </td>
        `;
        salesTableBody.appendChild(row);
      });
    }
  }
  function showViewModal() { 
    const modal = document.getElementById('viewModal');
     modal.classList.add('show');
      modal.style.display = 'block';
     }
  
     function closeModal(modalId) { 
      const modal = document.getElementById(modalId);
       modal.classList.remove('show');
        modal.style.display = 'none';
      }
      function showEditModal() {
        const modal = document.getElementById('editModal');
        modal.classList.add('show');
        modal.style.display = 'block';
      }
      function closeEditModal() {
        const modal = document.getElementById('editModal');
        modal.classList.add('show');
        modal.style.display = 'block';
      }
  
  // Function to filter the table
  function filterTable() {
    const filterName = document.getElementById('filterName').value.toLowerCase();
    const filterStock = document.getElementById('filterStock').value;
    const filterPrice = document.getElementById('filterPrice').value;
    const filterDate = document.getElementById('filterDate').value;
  
    const filteredData = tableData.filter(item => {
      return (
        (filterName === '' || item.name.toLowerCase().includes(filterName)) &&
        (filterStock === '' || item.in_stock == filterStock) &&
        (filterPrice === '' || item.price == filterPrice) &&
        (filterDate === '' || item.created_at.startsWith(filterDate))
      );
    });
  
    renderTable(filteredData); // Re-render table with filtered data
  }
  
  function viewItem(event,id) {
    event.preventDefault(); 
    console.log('View button clicked for item ID:', id);
  
    // Fetch item details from the server (replace with actual URL)
    fetch(`/allitemsroute/itemsview/${id}`)
      .then(response => response.json())
      .then(itemDetails => {
        console.log(itemDetails);
  
        // Populate the modal with item details
        const viewDetails = `
         <strong>Id:</strong> ${itemDetails.id || 'N/A'} <br>
          <strong>Name:</strong> ${itemDetails.name || 'N/A'} <br>
          <strong>In stock:</strong> ${itemDetails.in_stock || '0'} <br>
          <strong>Price:</strong> ${itemDetails.price || '0'} <br>
          <strong>Buying Price:</strong> ${itemDetails.buying_price || '0'} <br>
          <strong>Created At:</strong> ${new Date(itemDetails.created_at).toLocaleString()} <br>
        `;
        document.getElementById('view-details').innerHTML = viewDetails;
  
        // Display the modal
        showViewModal()
      })
      .catch(error => console.error('Error fetching item details:', error));
  }
  
  function editItem(event, id) {
    event.preventDefault();
    console.log('Edit button clicked for item ID:', id);
  
    // Fetch item details from the server to populate the form (replace with your actual URL)
    fetch(`/allitemsroute/itemsview/${id}`)
      .then(response => response.json())
      .then(itemDetails => {
        console.log(itemDetails);
  
        // Populate the form with item details
        document.getElementById('editItemName').value = itemDetails.name || '';
        document.getElementById('editItemStock').value = itemDetails.in_stock || '';
        document.getElementById('editItemBuyingprice').value = itemDetails.buying_price || '';
        document.getElementById('editItemPrice').value = itemDetails.price || '';
        document.getElementById('editItemId').value = itemDetails.id || '';
  
        // Show the modal to edit the item
        showEditModal();
      })
      .catch(error => console.error('Error fetching item details:', error));
  }
  
  
  
  function updateItem(event) {
    event.preventDefault();
    
    const updatedItem = {
      id: document.getElementById('editItemId').value,
      name: document.getElementById('editItemName').value,
      in_stock: parseFloat(document.getElementById('editItemStock').value),
      buying_price: parseFloat(document.getElementById('editItemBuyingprice').value),
      price: parseFloat(document.getElementById('editItemPrice').value),
    };
  
    // Send updated data to the server (replace with your actual API endpoint)
    fetch(`/allitemsroute/itemsupdate/${updatedItem.id}`, {
      method: 'PUT', 
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedItem)
    })
    .then(response => response.json())
    .then(updatedItemDetails => {
      console.log('Item updated:', updatedItemDetails);
  
      alert('Item successfully updated!');
      window.location.reload();
  
      // Close the modal after saving
      closeeditModal();
    })
    .catch(error => console.error('Error updating item:', error));
  }
  function deleteItem(event, id) {
    event.preventDefault();
    console.log('Delete button clicked for item ID:', id);
  
    const confirmation = confirm('Are you sure you want to delete this item?');
  
    if (confirmation) {
      fetch(`/allitemsroute/itemsdeleted/${id}`,{
        method: 'DELETE', 
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => response.json())
      .then(data => {
        console.log('Item deleted:', data);
        alert('Item successfully deleted!');
        
        // Optionally, remove the item from the table without reloading
        const row = document.querySelector(`a[data-id="${id}"]`).closest('tr');
        if (row) {
          row.remove();
        }
      })
      .catch(error => {
        console.error('Error deleting item:', error);
        alert('An error occurred while deleting the item.');
      });
    }
  }
  function openItemsModal() {
    const modal = document.getElementById('allitemsModal');
    modal.style.display = 'block';
  }
  
  // Close the modal when the close button (×) is clicked
  function closeItemsModal() {
    const modal = document.getElementById('allitemsModal');
    modal.style.display = 'none';
  }
  
  document.addEventListener('DOMContentLoaded',async () => {
    
    const form = document.getElementById('allitemsModalSubmit');
    if (form) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const name = document.getElementById('name').value;
            const in_stock = parseFloat(document.getElementById('in_stock').value);
            const buying_price = parseInt(document.getElementById('buying_price').value);
            const price = parseInt(document.getElementById('price').value);

            // Validate inputs
            if (isNaN(in_stock) || isNaN(price) || isNaN(buying_price)) {
                alert('In stock and price must be valid numbers');
                return;
            }

            try {
                const response = await fetch('/allitemsroute/itemscreate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name, in_stock, price,buying_price }),
                });

                const data = await response.json();
                if (response.ok) {
                    alert('Item created successfully!');
                    //closeItemsModal(); // Close modal on success
                    location.reload();
                } else {
                    alert(`Failed to create item: ${data.message || 'Unknown error'}`);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while creating the item');
            }
        });
    } else {
        console.error("Form with ID 'allitemsModalSubmit' not found.");
    }
});

// Function to close the modal
function closeeditModal() {
    const modal = document.getElementById('editModal');
    if (modal) {
        modal.style.display = 'none';
    } else {
        console.error("Modal with ID 'allitemsModal' not found.");
    }
}
async function fetchTransactionTotals() {
  try {
    const response = await fetch('/dashboarddata/mpesa');
    if (!response.ok) throw new Error('Failed to fetch totals');

    const { cash, mpesa } = await response.json(); // Ensure the API sends these fields in JSON format

    // Update the DOM
    document.getElementById('cash').textContent = `$${cash}`;
    document.getElementById('mpesa').textContent = `$${mpesa}`;

    updateTransactionChart(cash, mpesa);
  } catch (error) {
    console.error('Error fetching transaction totals:', error);
  }

}
function updateTransactionChart(mpesa, cash) {
  const ctx = document.getElementById('transaction-history').getContext('2d');
  new Chart(ctx, {
    type: 'pie', // Chart type (can be 'bar', 'line', 'pie', etc.)
    data: {
      labels: ['Mpesa', 'Cash'], // Labels for the dataset
      datasets: [
        {
          label: 'Transaction Totals',
          data: [mpesa, cash], // Values for the dataset
          backgroundColor: ['#E91E63', '#2196F3'], // Colors for the bars
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}
fetchTransactionTotals();

function getFormattedDate() {
  const now = new Date();
  const day = now.getDate().toString().padStart(2, '0');
  const month = now.toLocaleString('default', { month: 'short' });
  const year = now.getFullYear();
  const hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedDate = `${day} ${month} ${year}, ${hours % 12 || 12}:${minutes}${ampm}`;
  return formattedDate;
}

// Update the date dynamically for Mpesa and Cash
document.getElementById('mpesa-date').textContent = getFormattedDate();
document.getElementById('cash-date').textContent = getFormattedDate();

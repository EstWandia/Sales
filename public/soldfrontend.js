

//console.log('I am here')
let soldData =[]
fetch('/sold/allsold')
.then(response =>
  response.json())
.then(data=>{
    soldData = data
    renderSoldTable(soldData)
}).catch(error=>console.error('Error loading sold data:',error)
)

function renderSoldTable(data) {
  const soldDataTable = document.getElementById('reportSoldItems');
  soldDataTable.innerHTML = ''; // Clear the table

  if (!data.length) {
      soldDataTable.innerHTML = `<tr><td colspan="7" class="text-center">No items found matching the filters.</td></tr>`;
      return;
  }
  //console.log("god have:",data)

  data.forEach((item, index) => {
      const row = document.createElement('tr');
      const formattedDate = item.createdAt ? new Date(item.createdAt).toISOString().slice(0, 19).replace('T', ' ') : 'Unknown';
      row.innerHTML = `
          <td>${index + 1}</td>
          <td>${item.name || 'N/A'}</td>
          <td>${item.quantity ? item.quantity.toFixed(2) : '0.00'}</td>
          <td>${item.amount ? item.amount.toFixed(2) : '0.00'}</td>
          <td>${item.state === 1 ? 'cash' : item.state === 0 ? 'mpesa' : 'N/A'}</td>
          <td>${formattedDate}</td>
          <td>
        <a href="#" class="mdi mdi-eye" title="View" data-id="${item.id}" onclick="viewItem(event, '${item.id}')"></a>
        </td>

      `;
      soldDataTable.appendChild(row); // Append the row to the table body
  });
}
 //<a href="#" class="mdi mdi-pencil" title="Edit" data-id="${item.id}" onclick="editItem(event, '${item.id}')"></a>
        // <a href="#" class="mdi mdi-delete" title="Delete" data-id="${item.id}" onclick="deleteItem(event, '${item.id}')"></a>
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

function filterSoldTable() {

  // Fetch filter values
  const filterName = document.getElementById('filterName').value.toLowerCase();
  const filterQuantity = document.getElementById('filterQuantity').value;
  const filterAmount = parseFloat(document.getElementById('filterAmount').value);
  const filterState = document.getElementById('filterState').value;
  const filterDate = document.getElementById('filterDate').value;

  const filteredData = soldData.filter(item => {
    const matchesName = (filterName === '' || item.name.toLowerCase().includes(filterName));
    const matchesQuantity = (filterQuantity === '' || item.quantity.toString().includes(filterQuantity));
      const matchesAmount = (isNaN(filterAmount) || item.amount.toString().includes(filterAmount.toString()));
      const matchesState = (filterState === '' || (filterState === '1' && item.state === 1) || (filterState === '0' && item.state === 0));
        const matchesDate = (filterDate === '' || item.created_at.includes(filterDate));
      
      // Return true if all conditions are satisfied for the item
      return matchesName && matchesQuantity && matchesAmount && matchesState && matchesDate;
  });
  renderSoldTable(filteredData); // Re-render table with filtered data
}

    function viewItem(event,id) {
      event.preventDefault(); 
      //console.log('View button clicked for item ID:', id);
    
      // Fetch item details from the server (replace with actual URL)
      fetch(`/sold/item/${id}`)
        .then(response => response.json())
        .then(itemDetails => {
          //console.log(itemDetails);
    
          // Populate the modal with item details
          const viewDetails = `
           <strong>Id:</strong> ${itemDetails.id || 'N/A'} <br>
           <strong>Category Name:</strong> ${itemDetails.category_id || 'N/A'} <br>
            <strong>Name:</strong> ${itemDetails.name || 'N/A'} <br>
            <strong>Quantity:</strong> ${itemDetails.quantity || '0'} <br>
            <strong>Amount:</strong> ${(itemDetails.amount).toFixed(2) || '0.00'} <br>
            <strong>Buying Price :</strong> ${(itemDetails.buying_price).toFixed(2) || '0.00'} <br>
            <strong>State:</strong> ${itemDetails.state === 1 ? 'Cash' : 'Mpesa'} <br>
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
      //console.log('Edit button clicked for item ID:', id);
    
      // Fetch item details from the server to populate the form (replace with your actual URL)
      fetch(`/sold/item/${id}`)
        .then(response => response.json())
        .then(itemDetails => {
          //console.log(itemDetails);
    
          // Populate the form with item details
          document.getElementById('editItemName').value = itemDetails.name || '';
          document.getElementById('editItemQuantity').value = itemDetails.quantity || '';
          document.getElementById('editItemAmount').value = (itemDetails.amount).toFixed(2) || '';
          document.getElementById('editItemBuyingprice').value = (itemDetails.buying_price).toFixed(2) || '';
          const state = itemDetails.state === 'Mpesa' ? 1 : 0;
          document.getElementById('editItemState').value = state;
          document.getElementById('editItemId').value = itemDetails.id || '';
          //console.log(document.getElementById('editItemState').value);
    
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
        quantity: parseFloat(document.getElementById('editItemQuantity').value),
        amount: parseFloat(document.getElementById('editItemAmount').value),
        buying_price: parseFloat(document.getElementById('editItemBuyingprice').value), // Store in cents
        state: parseInt(document.getElementById('editItemState').value),
      };
    
      // Send updated data to the server (replace with your actual API endpoint)
      fetch(`/sold/update/${updatedItem.id}`, {
        method: 'PUT', 
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedItem)
      })
      .then(response => response.json())
      .then(updatedItemDetails => {
        //console.log('Item updated:', updatedItemDetails);

        alert('Item successfully updated!');
        window.location.reload();
    
        // Close the modal after saving
        closeModal('editModal');
      })
      .catch(error => console.error('Error updating item:', error));
    }
    function deleteItem(event, id) {
      event.preventDefault();
      //console.log('Delete button clicked for item ID:', id);
    
      const confirmation = confirm('Are you sure you want to delete this item?');
    
      if (confirmation) {
        fetch(`/sold/deleted/${id}`,{
          method: 'DELETE', 
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then(response => response.json())
        .then(data => {
          //console.log('Item deleted:', data);
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
window.addEventListener('pageshow', checkPermissions);

 function checkPermissions() {
    fetch('/sold/soldpermision')
        .then(response => response.json())
        .then(data => {
            if (data.perm === 1) {
                document.querySelectorAll('[data-perm="0"]').forEach(el => {
                    const parentLi = el.closest('li.nav-item');
                    if (parentLi) {
                        parentLi.style.display = 'none';
                    } else {
                        // fallback: hide element itself if parent li isn't found
                        el.style.display = 'none';
                    }
                });
            }
        })
        .catch(error => console.error('Error fetching user permission:', error));
}

document.addEventListener('DOMContentLoaded', checkPermissions);
    
    
   
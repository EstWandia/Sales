console.log('mee')
let categoryData = [];
fetch('/categories/itemscategory')
.then(response=>{
if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
})
.then(data=>{

    categoryData = data
    renderCategoryTable(categoryData)
}).catch(error=>console.error('Error loading sold data:',error)
)

function renderCategoryTable(data) {
  const soldDataTable = document.getElementById('reportCategory');
  soldDataTable.innerHTML = ''; // Clear the table

  if (!data.length) {
      soldDataTable.innerHTML = `<tr><td colspan="5" class="text-center">No items found matching the filters.</td></tr>`;
      return;
  }

  data.forEach((item, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
          <td>${index + 1}</td>
          <td>${item.id || 'N/A'}</td>
          <td>${item.name  || 'N/A'}</td>
          <td>${item.in_stock ? item.in_stock.toFixed(2) : '0.00'}</td>
          <td>${item.created_at || 'Unknown'}</td>
          <td>
        <a href="#" class="mdi mdi-eye" title="View" data-id="${item.id}" onclick="viewItem(event, '${item.id}')"></a>
        <a href="#" class="mdi mdi-pencil" title="Edit" data-id="${item.id}" onclick="editItem(event, '${item.id}')"></a>
        <a href="#" class="mdi mdi-delete" title="Delete" data-id="${item.id}" onclick="deleteItem(event, '${item.id}')"></a>
        </td>
      `;
      soldDataTable.appendChild(row); // Append the row to the table body
  });
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
function filterCategoryTable() {

  // Fetch filter values
  const filterId = document.getElementById('filterId').value.toLowerCase();
  const filterName= document.getElementById('filterName').value.toLowerCase();
  const filterStock = document.getElementById('filterStock').value;
  const filterDate = document.getElementById('filterDate').value;

  const filteredData = categoryData.filter(item => {
    const matchesId = (filterId === '' || item.id.toLowerCase().includes(filterId));
    const matchesName = (filterName === '' || item.name.toLowerCase().includes(filterName));
    const matchesStock = (filterStock === '' || item.in_stock.toString().includes(filterStock));
    const matchesDate = (filterDate === '' || item.created_at.includes(filterDate));
      
      // Return true if all conditions are satisfied for the item
      return matchesId && matchesName && matchesStock && matchesDate;
  });
  renderCategoryTable(filteredData); // Re-render table with filtered data
}
function viewItem(event,id) {
  event.preventDefault(); 
  console.log('View button clicked for item ID:', id);

  // Fetch item details from the server (replace with actual URL)
  fetch(`/categories/item/${id}`)
    .then(response => response.json())
    .then(itemDetails => {
      console.log(itemDetails);

      // Populate the modal with item details
      const viewDetails = `
       <strong>Id:</strong> ${itemDetails.id || 'N/A'} <br>
        <strong>Name:</strong> ${itemDetails.name || 'N/A'} <br>
        <strong>In stock:</strong> ${itemDetails.in_stock || '0'} <br>
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
  console.log('Edit button clicked for item ID:', id);

  // Fetch item details from the server to populate the form (replace with your actual URL)
  fetch(`/categories/item/${id}`)
    .then(response => response.json())
    .then(itemDetails => {
      console.log(itemDetails);

      // Populate the form with item details
      document.getElementById('editItemName').value = itemDetails.name || '';
      document.getElementById('editItemStock').value = itemDetails.in_stock || '';
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
    stock: parseFloat(document.getElementById('editItemStock').value),
  };

  // Send updated data to the server (replace with your actual API endpoint)
  fetch(`/categories/update/${updatedItem.id}`, {
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
    closeModal('editModal');
  })
  .catch(error => console.error('Error updating item:', error));
}
function deleteItem(event, id) {
  event.preventDefault();
  console.log('Delete button clicked for item ID:', id);

  const confirmation = confirm('Are you sure you want to delete this item?');

  if (confirmation) {
    fetch(`/categories/deleted/${id}`,{
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
function openCategoryModal() {
  const modal = document.getElementById('categoryModal');
  modal.style.display = 'block';
}


// Close the modal when the close button (×) is clicked
function closeCategoryModal() {
  const modal = document.getElementById('categoryModal');
  modal.style.display = 'none';
}

// Handle form submission and create category
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('categoryFormSubmit').addEventListener('submit', async (event) => {
      event.preventDefault();
      const name = document.getElementById('name').value;
      const in_stock = parseInt(document.getElementById('in_stock').value, 10);

      if (isNaN(in_stock)) {
          alert('In stock must be a valid number');
          return;
      }

      try {
          const response = await fetch('/categories/create', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ name, in_stock }),
          });

          const data = await response.json();  // Ensure this is valid JSON
          if (response.ok) {
              alert('Category created successfully!');
              closeCategoryModal(); // Close modal on success
              // Optionally, refresh the category list here
          } else {
              alert('Failed to create category');
          }
      } catch (error) {
          console.error('Error:', error);
          alert('An error occurred while creating the category');
      }
  });
});

fetch('/categories/displaycategory')
  .then(response => {
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log("rent", data); // Log the fetched data

    const iconsList = document.getElementById('iconsList');
    iconsList.innerHTML = ''; // Clear previous content

    if (!data.length) {
        iconsList.innerHTML = `<div class="col-12 text-center">No items found matching the filters.</div>`;
        return;
    }

    data.forEach((item, index) => {
        const colDiv = document.createElement('div');
        colDiv.classList.add('col-sm-6', 'col-md-4', 'col-lg-3');

        // Ensure the image URL is correct
        const imageUrl = item.image_url ? item.image_url : '/assets/images/default.jpg'; // Use default image if not present
        console.log(item.image_url); // Check if the image URL is correct

        colDiv.innerHTML = `
            <div class="card">
                <img src="${imageUrl}" alt="Item image" class="card-img-top"> <!-- Fixed closing tag -->
                <div class="card-body">
                    <h5 class="card-title">${item.name}</h5> <!-- Dynamically bind item name -->
                    <p class="card-text">In Stock: ${item.in_stock}</p> <!-- Dynamically bind stock value -->
                    <p class="card-text">Price: ${item.price}</p> <!-- Dynamically bind price value -->
                </div>
            </div>
        `;

        iconsList.appendChild(colDiv);
    });
  })
  .catch(error => {
    console.error('Fetch error:', error);
  });

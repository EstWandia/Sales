console.log('for the love of christ');
let tabledData = []; 

async function fetchItems(filters = {}) {
    try {
        const query = new URLSearchParams(filters).toString();
        const response = await fetch(`/allitemsroute/sale?${query}`);

        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const items = await response.json();
        return items;
    } catch (error) {
        console.error("Failed to fetch items:", error);
        displayItems([]);
        return [];
    }
}

function displayItems(items) {
    const grid = document.getElementById('itemsGrid');
    const saleItems = JSON.parse(localStorage.getItem('saleItems')) || [];
    grid.innerHTML = ''; // Clear previous content

    if (!items.length) {
        grid.innerHTML = `<tr><td colspan="4" class="text-center">No items found matching the filters.</td></tr>`;
        return;
    }

    items.forEach((item, index) => {
        const row = document.createElement('tr');
        const colors = ['#badce3', '#f2e7c3', '#eccccf'];
        const rowColor = colors[index % colors.length];

    
        row.style.backgroundColor = rowColor;


        row.classList.remove('table-info');  // Adding a contextual class for each row

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.name}</td>
            <td>${item.in_stock}</td>
            <td>$${item.price}</td>
            <td>
                <input type="number" id="quantity-${item.name}" class="form-control" min="1" max="${item.in_stock}" placeholder="Enter quantity"
                oninput="validateQuantity('${item.name}', ${item.in_stock})" />
            </td>
        `;
        grid.appendChild(row);
    });
}

  // Fetch and render the data
  fetch('/dashboarddata/reportitem')
    .then(response => response.json())
    .then(data => {
      tabledData = data; // Store fetched data for filtering
    })
    .catch(error => console.error('Error loading sales data:', error));
function validateQuantity(itemName, stock) {
    const quantityInput = document.getElementById(`quantity-${itemName}`);
    const quantity = parseFloat(quantityInput.value);
    const inputValue = quantityInput.value;
    
    if (inputValue === '') {
        return;
    }

    if (isNaN(inputValue)) {
        event.preventDefault();
        return;
    }

    if (inputValue > stock) {
        quantityInput.value = stock; // Set the input to max stock value
    }

    if (inputValue < 1) {
        quantityInput.value = 1; // Prevent values less than 1
    }
}
function filteredTable() {
    const filterName = document.getElementById('Name').value.toLowerCase();
    const filterStock = document.getElementById('Stock').value;
    const filterPrice = document.getElementById('Price').value;

    const filteredData = tabledData.filter(item => {
        const matchesName = (filterName === '' || item.name.toLowerCase().includes(filterName));
        const matchesStock = (filterStock === '' || item.in_stock.toString().includes(filterStock));
        const matchesPrice = (filterPrice === '' || item.price.toString().includes(filterPrice));
          
          // Return true if all conditions are satisfied for the item
          return matchesName && matchesStock && matchesPrice;
      });
      displayItems(filteredData);
}


function getQuantityForItems(items) {
    const saleItems = JSON.parse(localStorage.getItem('saleItems')) || [];
    const newQuantities = [];

    items.forEach(item => {
        const quantityInput = document.getElementById(`quantity-${item.name}`);
        const quantity = quantityInput ? parseFloat(quantityInput.value) : 0;

        if (quantity > 0) {
            newQuantities.push({
                id:item.id,
                name: item.name,
                price: item.price,
                quantity: quantity,
                total: item.price * quantity
            });
        }
    });
    const updatedSaleItems = [...saleItems];
    newQuantities.forEach(newItem => {
        const existingItemIndex = updatedSaleItems.findIndex(i => i.name === newItem.name);
        if (existingItemIndex > -1) {
            updatedSaleItems[existingItemIndex] = newItem;
        } else {
            updatedSaleItems.push(newItem);
        }
    });

    localStorage.setItem('saleItems', JSON.stringify(updatedSaleItems));

    return updatedSaleItems;
}
function loadSaleItemsFromStorage() {
    const saleItems = JSON.parse(localStorage.getItem('saleItems')) || [];

    if (saleItems.length > 0) {
        showSaleModal(saleItems);
    }
}
function clearSaleItems() {
    console.log("Clear sale button clicked");
    localStorage.removeItem('saleItems');
    document.getElementById('saleItemsTable').innerHTML = '';
    document.getElementById('grossTotal').textContent = '0.00';
}
function showSaleModal(items) {
    const saleItemsTable = document.getElementById('saleItemsTable');
    const grossTotalElem = document.getElementById('grossTotal');

    saleItemsTable.innerHTML = '';

    let grossTotal = 0;

    items.forEach((item,index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${item.name}</td>
        <td>$${item.price})</td>
        <td>${item.quantity}</td>
        <td>${item.total.toFixed(2)}</td>
        <td>
                <span class="mdi mdi-close text-danger" style="cursor: pointer;" onclick="deleteSaleItem(${index})"></span>
            </td>
        `;
        saleItemsTable.appendChild(row);
        grossTotal += item.total;

        row.dataset.Id = item.id;
        row.dataset.price = item.price;
        row.dataset.buying_price = item.buying_price;
        row.dataset.categoryId = item.category_id;
    })
    grossTotalElem.textContent = grossTotal.toFixed(2);

    const saleModal = new bootstrap.Modal(document.getElementById('saleModal'));
    saleModal.show();

}

function deleteSaleItem(index) {
    let saleItems = JSON.parse(localStorage.getItem('saleItems')) || [];
    saleItems.splice(index, 1); // Remove the item at the specified index

    localStorage.setItem('saleItems', JSON.stringify(saleItems)); // Update localStorage
    showSaleModal(saleItems); // Refresh the modal to reflect the changes

    location.reload()
}
// function displayItemsForIcons(items) {
//     console.log(items)
//     const iconsList = document.getElementById('iconsList');
//     iconsList.innerHTML = ''; // Clear previous content

//     if (!items.length) {
//         iconsList.innerHTML = `<div class="col-12 text-center">No items found matching the filters.</div>`;
//         return;
//     }

//     items.forEach((item, index) => {
//         const colDiv = document.createElement('div');
//         colDiv.classList.add('col-sm-6', 'col-md-4', 'col-lg-3');
//         const imageUrl = item.imageUrl ? `/assets/images/dashboard/${item.imageUrl}` : '';
//         console.log(item.imageUrl)
//         colDiv.innerHTML = `
//             <div class="card">
//             <img src="${imageUrl}" alt="Item image" class="card-img-top"
//                 <div class="card-body">
//                     <h5 class="card-title">${item.name}</h5> <!-- Dynamically bind item name -->
//                     <p class="card-text">In Stock: ${item.in_stock}</p> <!-- Dynamically bind stock value -->
//                     <p class="card-text">Price: ${item.price}</p> <!-- Dynamically bind stock value -->
//                 </div>
//             </div>
//         `;

//         iconsList.appendChild(colDiv);
//     });
// }
function updateBalance() {
    const amountGiven = parseFloat(document.getElementById('amountGiven').value) || 0;
    const grossTotal = parseFloat(document.getElementById('grossTotal').textContent) || 0;
    const balance = amountGiven - grossTotal;
    document.getElementById('balance').textContent = balance.toFixed(2);
  }

document.addEventListener('DOMContentLoaded', () => {
    // Fetch and display all items on page load
    fetchItems().then(displayItems);

    loadSaleItemsFromStorage();



    document.getElementById('submitSaleButton').addEventListener('click', async () => {
        const items = await fetchItems();
        const quantities = getQuantityForItems(items);

        if (quantities.length > 0) {
            showSaleModal(quantities);
            window.location.reload();
        } else {
            alert('No quantities selected')
        }
    })
    document.getElementById('Name').addEventListener('input', filteredTable);
    document.getElementById('Stock').addEventListener('input', filteredTable);
    document.getElementById('Price').addEventListener('input', filteredTable);
    document.getElementById('clearSaleButton').addEventListener('click', () => {
        clearSaleItems();
    });
    document.getElementById('amountGiven').addEventListener('input', updateBalance);

    document.getElementById('confirmSaleButton').addEventListener('click', function() {
        console.log('kasongo')
        const saleItems = JSON.parse(localStorage.getItem('saleItems')) || [];
        const amountGiven = parseFloat(document.getElementById('amountGiven').value) || 0;
        const grossTotal = saleItems.reduce((total, item) => total + item.total, 0);
        const balance = amountGiven - grossTotal;
    
        // Update the gross total and balance on the UI
        document.getElementById('grossTotal').textContent = grossTotal.toFixed(2);
        document.getElementById('balance').textContent = balance.toFixed(2);
        const cashCheckbox = document.getElementById('cashCheckbox');
    
        saleItems.forEach(item => {
            // Check if the checkbox is checked and update the item's state accordingly
            if (cashCheckbox.checked) {
                item.state = 0;  // If checked, set state to 0 (Cash)
            } else {
                item.state = 1;  // If unchecked, set state to 1 (Credit)
            }
        });
    
    
        if (amountGiven >= grossTotal) {
            const itemsSold = saleItems.map(item => {
                return {
                    id:item.id,
                    name: item.name,
                    price: item.price,
                    buying_price: item.buying_price,
                    quantity: item.quantity,
                    amount: item.total,
                    category_id: item.categoryId || null,
                    state:item.state
                };
            });
            //console.log(itemsSold);
    
            // Send the sale data to the backend
            fetch('/dashboarddata/pay', {
                
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ itemsSold: itemsSold })
                
            })
            .then(response => response.json())
            .then(data => {
                console.log('Sale confirmation success:', data);
                localStorage.removeItem('saleItems'); // Clear the sale items from localStorage
    
                //Hide the modal
                // const saleModal = new bootstrap.Modal(document.getElementById('saleModal'));
                // saleModal.hide();
    
                // Reload the page
                location.reload();
            })
            .catch(error => {
                console.error('Error during sale confirmation:', error);
            });
        } else {
            alert('Insufficient amount given.');
        }
    });
    
});
fetch('/allitemsroute/instock')
  .then(response => response.json())
  .then(function (itemData) {
    const allItemsElement = document.getElementById('allinstock')
    allItemsElement.innerText = itemData.instockItems;
  })
  .catch(error => console.error(error));
  document.addEventListener('DOMContentLoaded', function () {
    fetch('/auth/loginname', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for authentication
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.success && data.user) {
            // Update profile name in both places
            const profileNameElement = document.querySelector('.profile-name h5');
            const navbarProfileNameElement = document.querySelector('.navbar-profile-name');

            if (profileNameElement) {
                profileNameElement.textContent = data.user.name;
            }

            if (navbarProfileNameElement) {
                navbarProfileNameElement.textContent = data.user.name;
            }
        } else {
            console.error('Failed to fetch user details:', data.message);
        }
    })
    .catch((error) => console.error('Error fetching user details:', error));
});

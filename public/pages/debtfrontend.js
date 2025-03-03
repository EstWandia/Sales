

function showdebtModal() { 
    const modal = document.getElementById('debtModal');
     modal.classList.add('show');
      modal.style.display = 'block';
     }

     $(document).ready(function () {
        $('#debtModal').modal({ backdrop: 'static', keyboard: false });
    });
    
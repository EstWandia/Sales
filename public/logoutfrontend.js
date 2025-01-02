$(document).ready(function(){
    $('#logout-link').on('click', function(event){
        event.preventDefault();

        $.ajax({
            url: 'auth/logout',
            type: 'POST',
            success: function(response){
                if(response.success){
                      window.location.href = '/';
                    }else{
                        alert('Logout failed.Please try again')
                    }
                }
        });
    });
});
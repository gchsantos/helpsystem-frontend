import {isLogged} from '../../utils/login.js'
import {userLogin} from './index.js'

window.addEventListener('DOMContentLoaded', () => {

    if (isLogged()){
        Swal.fire({
            showConfirmButton: true,
            timer: 5000,
            timerProgressBar: true,
            title: 'Você já está logado',
            text: "Fique tranquilo, iremos te redirecionar para a pagina de planos :)",
            icon: 'success',
            confirmButtonColor: '#0d6efd',
            confirmButtonText: 'Ver Planos',
            
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
          }).then(() => {
            window.location.href = '/#plans';
        });
    }
          
       

    document.addEventListener('keypress', (event) => {
        if (event.key === "Enter") {
            userLogin();
        }
    });

});

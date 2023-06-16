import {Authenticate} from '../../services/api.js'
import {setWithExpiry} from '../../utils/local-storage.js'


export async function userLogin(){
    var userCredentials = {}

    userCredentials.username = document.getElementById('username').value;
    userCredentials.password = document.getElementById('password').value;

    try {
        var response = await Authenticate(userCredentials);
        if (!response.ok){
            showloginErro("Certifique-se de inserir o usuário e senha corretos.")
            return false;
        }else{
            const commonUser = await response.json();
            setWithExpiry('commonUser', commonUser.detail, 600000); //CommonUser session expires in 600000 microseconds (10 minutes)
            showloginSucesso();
        }
    } catch (error) {
        showloginErro(error)
    }
   
}

function showloginSucesso(){
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: true,
        timer: 5000,
        timerProgressBar: true,
        title: 'Login realizado com sucesso!',
        text: "Você será redirecionado para a página de planos.",
        icon: 'success',
        confirmButtonColor: '#0d6efd',
        confirmButtonText: 'Ver Planos',
        
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })
      
    Toast.fire().then(() => {
        window.location.href = '/#plans';
    });
}

function showloginErro(message){
    Swal.fire({
        icon: 'error',
        title: 'Erro ao logar',
        text: message,
        showConfirmButton: true,
        confirmButtonColor: '#d33',
        timer: 5000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
    })
}


window.userLogin = userLogin;
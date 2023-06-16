import {createCustomer, makeSale} from '../../services/api.js'
import {setWithExpiry, getWithExpiry} from '../../utils/local-storage.js'
import {logout} from '../../utils/login.js'


async function cadastrarCliente(){
    var userInfo = {}

    userInfo.username = document.getElementById('userName').value;
    userInfo.first_name = document.getElementById('name').value;
    userInfo.last_name = document.getElementById('lastName').value;
    userInfo.email = document.getElementById('email').value;
    userInfo.password = document.getElementById('password').value;
    userInfo.phone = document.getElementById('phone').value;
    userInfo.cpf = document.getElementById('cpf').value;
    userInfo.gender = document.getElementById('gender').value;
    userInfo.birth = document.getElementById('birth').value;
    userInfo.city = document.getElementById('city').value;

    var response = await createCustomer(userInfo);
    if (!response.ok){
        var error = await response.text();
        showCadastroErro("Falha ao cadastrar cliente: \n"+ error)
        return false;
    }else{
        const commonUser = await response.json();
        setWithExpiry('commonUser', commonUser.detail, 600000); //CommonUser session expires in 600000 microseconds (10 minutes)
        showCadastroSucesso();

        document.getElementById('nav-login').classList.add('d-none');
        document.getElementById('nav-signup').classList.add('d-none');
        document.getElementById('nav-logout').classList.remove('d-none');
    }
}

function getInputs(t,e=document.body){
    const n = [].slice.call(e.querySelectorAll(t));
    if (0 === n.length)
        throw new Error(`GET_ELEMENTS: ${e.id} -> ${t}`);
    return n
}

function showCadastroSucesso(){
    var successMessage = document.getElementById('submitSuccessMessage');
    var successButton = document.getElementById('submitButton');

    successMessage.classList.remove("d-none")
    successButton.classList.add("d-none")

    var inputs = getInputs("input, textarea, select");
    inputs.forEach((t=>{
        t.setAttribute("disabled", "")
    }));

    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: true,
        timer: 5000,
        timerProgressBar: true,
        title: 'Cadastro concluído com sucesso!',
        icon: 'success',
        confirmButtonColor: '#0d6efd',
        confirmButtonText: 'Ver Planos',
        
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })
      
      Toast.fire({}).then((result) => {
        if (result.isConfirmed) {
            window.location.href = '#plans';
        }
    });
}

function showCadastroErro(message){
    Swal.fire({
        icon: 'error',
        title: 'Erro ao cadastrar',
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

async function comprarPlano(plan){
    const customer = getWithExpiry('commonUser')
    if (customer == 0){
        const Toast = Swal.mixin({
            toast: true,
            showConfirmButton: true,
            timer: 5000,
            timerProgressBar: true,
            title: 'Usuário Não Logado',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#0d6efd',
            cancelButtonColor: '#0dbbdd',
            confirmButtonText: 'Cadastre-se',
            cancelButtonText: 'Realizar Login',
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
          })
          
          Toast.fire().then((result) => {
            if (result.isConfirmed) {
                window.location.href = '/#signup';
            }else if (result.dismiss == 'cancel'){
                 window.location.href = '/login';            
            }
        });
    }
    else if(customer == -1){
        Swal.fire({
            title: 'Login Expirado',
            text: "Faça login novamente para adquirir um plano",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#0d6efd',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Redirecionar à pagina de Login',
            cancelButtonText: 'Cancelar',
            timer: 5000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
            }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = '/login';
            }
        });
    }else{
        const response = await makeSale(customer, plan);
        if (!response.ok){
            var error = await response.json();
            if (error.sale_id)
                showComprarPlanoExistente(error.sale_id)
            else
                showComprarPlanoErro(error.detail)
            return false;
        }else{
            var message = await response.json();
            showComprarPlanoSucesso(message.detail, message.sale_id)
            return false;
        }
    }

}

function showComprarPlanoErro(message){
    Swal.fire({
        icon: 'error',
        title: 'Erro na compra',
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

function showComprarPlanoExistente(sale_id){
    Swal.fire({
        icon: 'warning',
        title: 'Compra não realizada',
        text: 'Você será redirecionado para a pagina do seu plano',
        showConfirmButton: true,
        confirmButtonColor: '#0d6efd',
        confirmButtonText: 'Pagina do Plano',
        timer: 5000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
    }).then(() => {
        window.open('http://localhost:8000/sale/'+ sale_id +'/');
    });
}

function showComprarPlanoSucesso(message, sale_id){
    Swal.fire({
        icon: 'success',
        title: message,
        text: 'Você será redirecionado para a pagina de pagamento.',
        showConfirmButton: true,
        confirmButtonColor: '#0d6efd',
        confirmButtonText: 'Realizar Pagamento',
        timer: 5000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
    }).then(() => {
        window.open('http://localhost:8000/sale/'+ sale_id +'/');
    });
}

function sair(){
    logout();
    window.location.href = '/';
}

window.cadastrarCliente = cadastrarCliente;
window.comprarPlano = comprarPlano;
window.sair = sair;
import {createCustomer} from './api.js'


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
        cadastroErro("Falha ao cadastrar cliente: \n"+ error)
        return false;
    }else{
        const customer = await response.text();
        setWithExpiry('customer', customer, 6000); //Customer session expires in 6000 seconds (10 minutes)
        cadastroSucesso();
    }
}

function getInputs(t,e=document.body){
    const n = [].slice.call(e.querySelectorAll(t));
    if (0 === n.length)
        throw new Error(`GET_ELEMENTS: ${e.id} -> ${t}`);
    return n
}

function cadastroSucesso(){
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

function cadastroErro(message){
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

function setWithExpiry(key, value, ttl=1800) {
	const now = new Date()
    const item = {
        value: value,
        expiry: now.getTime() + ttl,
    }
    localStorage.setItem(key, JSON.stringify(item));
}

function getWithExpiry(key) {
	const itemStr = localStorage.getItem(key)
	if (!itemStr) {
		return 0
	}
	const item = JSON.parse(itemStr)
	const now = new Date()
	if (now.getTime() > item.expiry) {
		localStorage.removeItem(key)
		return -1
	}
	return item.value
}

function comprarPlano(){
    const customer = getWithExpiry('customer')
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
                window.location.href = '#signup';
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
    }
}

window.cadastrarCliente = cadastrarCliente;
window.comprarPlano = comprarPlano;
export async function createCustomer(userInfo){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
    "username": userInfo.username,
    "first_name": userInfo.first_name,
    "last_name": userInfo.last_name,
    "email": userInfo.email,
    "password": userInfo.password,
    "cpf": userInfo.cpf,
    "gender": userInfo.gender,
    "birth": userInfo.birth,
    "phone": {
        "number": userInfo.phone
    },
    "address": {
        "city": userInfo.city
    },
    });

    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };

    return await fetch("http://localhost:8000/customer/", requestOptions);
}
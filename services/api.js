import {getWithExpiry} from '../../utils/local-storage.js'

const api_url = "http://localhost:8000/";

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

        
    var response = await fetch(api_url+"customer/", requestOptions);
    if (!response.ok){
        return response;
    }

    var response = await fetch(api_url+"account/auth/", requestOptions);
    if (!response.ok){
        return response;
    }

    const response_token = await response.json(); 
    myHeaders.append("Authorization", "Bearer " + response_token.token);
    return await fetch(api_url+"account/", {method: 'GET', headers: myHeaders});
}

export async function Authenticate(userCredentials){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "username": userCredentials.username,
        "password": userCredentials.password,
    });

    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };

    const response = await fetch(api_url+"account/auth/", requestOptions);
    if (!response.ok){
        return response;
    }

    const response_token = await response.json();  
    myHeaders.append("Authorization", "Bearer " + response_token.token);
    return await fetch(api_url+"account/", {method: 'GET', headers: myHeaders});
}

export async function makeSale(customer, plan){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + customer.token);

    var raw = JSON.stringify({
        "plan": plan,
        "seller": "0498743b-6ef9-48ea-8eee-1d8b03976588"
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    return await fetch(api_url + "sale/", requestOptions);
}


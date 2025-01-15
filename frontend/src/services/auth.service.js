// import axios from "axios"

// const API_URL = "http://localhost:8000/api/user/"

// export async function signup(username, password) {
//   return await axios.post(API_URL + "signup", {
//     username,
//     password
//   })
// }

// export async function login(username, password) {
//   return await axios.post(API_URL + "login", {
//     username,
//     password
//   })
// }
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/user/';

export async function login(username, password) {
  const response = await axios.post(API_URL + 'login', { username, password }, { withCredentials: true });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response;
}

export function logout() {
  localStorage.removeItem('token');
}

export async function signup(username, password) {
  return await axios.post(
    'http://localhost:8000/api/user/signup',
    { username, password },
    { withCredentials: true }
  );
}


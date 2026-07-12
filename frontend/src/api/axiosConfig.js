import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://protask-backend-c9e4.onrender.com/api', // backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance

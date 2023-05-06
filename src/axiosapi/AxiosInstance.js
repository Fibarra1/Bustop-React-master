import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://beautiful-mendel.68-168-208-58.plesk.page',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    }
});

export default instance;
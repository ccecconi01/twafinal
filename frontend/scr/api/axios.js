import axios from 'axios';
const api = axios.create({ baseURL: 'http://localhost:3000/api' });

api.interceptors.request.use((config) => {
    // Tenta ler o utilizador salvo no navegador (se existir)
    const storedUser = localStorage.getItem('user'); 
    
    if (storedUser) {
        const userObj = JSON.parse(storedUser);
        // Adiciona o header automaticamente em TODAS as requisições
        config.headers['x-user-username'] = userObj.user;
    }
    return config;
});

export default api;
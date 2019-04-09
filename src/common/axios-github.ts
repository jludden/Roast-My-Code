import axios from 'axios';

const axiosGithub = axios.create({
    baseURL: 'http://localhost:3001'
});

// axiosGithub.get("http://localhost:3001/comments")


export default axiosGithub;
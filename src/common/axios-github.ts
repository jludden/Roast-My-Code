import axios from 'axios';

const axiosGithub = axios.create();

axiosGithub.get("http://localhost:3001/comments")


export default axiosGithub;
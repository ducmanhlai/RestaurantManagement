import axios from 'https://cdn.jsdelivr.net/npm/axios@1.4.0/+esm'
export default axios.create({
	baseURL: 'http://localhost:8080',
});
import axios from 'axios';

class ApiService {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    async get (url, params = {}) {
        try {
            const response = await axios.get(`${this.baseUrl}${url}`, { params });
            return response.data;
        } catch (error) {
            throw new Error(`请求失败: ${error.message}`);
        }
    }

    async post (url, data = {}) {
        try {
            const response = await axios.post(`${this.baseUrl}${url}`, data);
            return response.data;
        } catch (error) {
            throw new Error(`请求失败: ${error.message}`);
        }
    }

    // 可以添加其他请求方法，如 put、delete 等
}

export default ApiService
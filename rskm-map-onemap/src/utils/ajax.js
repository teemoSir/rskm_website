import http from '@/utils/http';
class ApiService {
    constructor() {

    }

    async get (url, params = {}) {
        //    console.log(import.meta.env.VITE_APP_BASE_API)
        try {
            const response = await http.get(url, { params });
            return response.data;
        } catch (error) {
            throw new Error(`请求失败: ${error.message}`);
        }
    }

    async post (url, data = {}) {
        if (!data || Object.keys(data).length === 0) {
            throw new Error("请求失败: body 必须包含 'data' 属性");
        }
        try {
            const response = await http.post(url, data);
            return response.data;
        } catch (error) {
            throw new Error(`请求失败: ${error.message}`);
        }
    }

    // 可以添加其他请求方法，如 put、delete 等
}

export default ApiService
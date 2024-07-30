// 状态管理器
const StateManager = {
    // 设置状态
    set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },
    // 获取状态
    get(key) {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : null; // 如果没有值，返回 null
    },
    // 清除状态
    clear(key) {
        localStorage.removeItem(key);
    }
};

export default StateManager;

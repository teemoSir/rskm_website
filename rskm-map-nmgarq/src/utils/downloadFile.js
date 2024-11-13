const downloadTextFile = (text, filename) => {
    // 创建一个Blob对象
    const blob = new Blob([text], { type: 'text/plain' });

    // 创建一个链接元素
    const link = document.createElement('a');

    // 设置链接的下载属性和文件名
    link.setAttribute('href', window.URL.createObjectURL(blob));
    link.setAttribute('download', filename);

    // 将链接隐藏并添加到文档中
    link.style.display = 'none';
    document.body.appendChild(link);

    // 触发点击事件
    link.click();

    // 清理：释放Blob URL和移除链接
    window.URL.revokeObjectURL(link.href);
    document.body.removeChild(link);
}

// 使用示例
//downloadTextFile('Hello, World!', 'example.txt');


export default downloadTextFile;

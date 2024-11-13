import * as XLSX from 'xlsx';

const downloadAndReadExcel = async (path, sheets) => {
    const response = await fetch(path);
    const file = await response.blob();
    if (file instanceof Blob) {
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        return new Promise((resolve, reject) => {
            reader.onload = function (e) {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });

                let html = []
                sheets.map((mm) => {
                    let firstSheetName = workbook.SheetNames[mm];
                    let worksheet = workbook.Sheets[firstSheetName];
                    html.push(XLSX.utils.sheet_to_html(worksheet));
                })
                resolve(html);
            };
            reader.onerror = function (error) {
                reject(error);
            };
        });
    } else {
        return Promise.reject(new Error('参数不是Blob类型'));
    }
}




export { downloadAndReadExcel }
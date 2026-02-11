export const API_BASE_URL = 'https://jpages.mydns.jp/JPagesApi/api';

async function Ajax(signal, token, url = "", method = 'GET', data) {
    const opt = {
        method,
        headers: {
        "Content-Type": "application/json",
        }
    };

    if (signal) {
        opt.signal = signal;
    }

    if (token) {
        opt.headers.Authorization = `Bearer ${token}`;
    }

    if (data) {
        opt.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_BASE_URL}/${url}`, opt);
    return response.json();
}

export default Ajax;

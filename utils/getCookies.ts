export default function getCookies() {
    let cookies = Object.fromEntries(document.cookie.split('; ').map(c => {
        const [key, ...v] = c.split('=');
        return [key, v.join('=')];
    }));
    return cookies;
}
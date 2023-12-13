export default function parseUrl(url) {
    let baseUrl = 'https://weather-app-api-ngiving.vercel.app';
    let decoded = decodeURI(new URL(url).pathname);
    let components = decoded.split('/');
    if (components < 4) throw new HttpException(400, "Bad Request");
    return new URL(components.slice(1).join('/'), baseUrl);
}
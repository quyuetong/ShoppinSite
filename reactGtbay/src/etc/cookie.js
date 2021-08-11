import Cookies from 'universal-cookie';

export function getCookie(key) {
    const cookies = new Cookies();
    return cookies.get(key);
}

export function removeCookie() {
    const cookies = new Cookies();
    cookies.remove("username");
    cookies.remove("userID");
    cookies.remove("firstname");
    cookies.remove("lastname");
    cookies.remove("position");
    cookies.remove("isAdmin");
}
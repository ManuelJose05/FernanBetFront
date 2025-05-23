export function useAuth() {
    return sessionStorage.getItem("login") === 'true' && sessionStorage.getItem("login") !== null;
}
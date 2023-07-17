import decode from 'jwt-decode';

class AuthService {
  getProfile() {
    const currentToken = this.getToken();
    if (!currentToken) {
      return null;
    } else {
      return decode(currentToken);
    }
  }

  loggedIn() {
    if (typeof window !== 'undefined') {
      const token = this.getToken();
      return !!token && !this.isTokenExpired(token);
    }
    return false;
  }

  isTokenExpired(token) {
    try {
      const decoded = decode(token);
      if (decoded.exp < Date.now() / 1000) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('id_token');
          this.logout();
        }
        return true;
      } else {
        return false;
      }
    } catch (err) {
      return false;
    }
  }

  getToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('id_token');
    }
    return null;
  }

  login(idToken) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('id_token', idToken);
      const currentRoute = window.location.pathname;
      window.location.assign(currentRoute); // Reloads the page with the current route
    }
  }

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('id_token');
      const currentRoute = window.location.pathname;
      window.location.assign(currentRoute); // Reloads the page with the current route
    }
  }
}

export default new AuthService();

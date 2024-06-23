// AuthService.js
export const API_URL = "http://localhost:8000";

class AuthService {
  static async login(username, password) {
    // console.log("fooooooooo", username);
    const response = await fetch(`${API_URL}/auth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ username, password }),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const data = await response.json();
    localStorage.setItem("token", data.access_token);
    // return data;
    return { token: data.access_token }; // Return token in an object
  }

  static logout() {
    localStorage.removeItem("token");
  }

  static getToken() {
    // console.log("blabla", localStorage.getItem("token"));
    return localStorage.getItem("token");
  }

  static async register(email, username, password, firstName, lastName, role) {
    const response = await fetch(`${API_URL}/auth/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        username,
        password,
        firstname: firstName,
        lastname: lastName,
        role,
      }),
    });

    const data = await response.json();
    localStorage.setItem("token", data.access_token);
    return { token: data.access_token };
  }
}

export default AuthService;

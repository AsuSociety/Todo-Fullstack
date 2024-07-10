// AuthService.js
export const API_URL = "http://localhost:8000";

class AuthService {
  static async login(username, password) {
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
    // console.log("Response Data:", data); // Log the response data

    localStorage.setItem("token", data.access_token);
    localStorage.setItem("username", data.username);
    localStorage.setItem("email", data.email);
    localStorage.setItem("first_name", data.first_name);
    localStorage.setItem("last_name", data.last_name);
    localStorage.setItem("role", data.role);
    localStorage.setItem("id", data.id);
    localStorage.setItem("icon", data.icon);

    return {
      token: data.access_token,
      username: data.username,
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      role: data.role,
      id: data.id,
      icon: data.icon,
    };
  }

  static logout() {
    localStorage.removeItem("token");
  }

  static getToken() {
    return localStorage.getItem("token");
  }

  static async register(
    email,
    username,
    password,
    firstName,
    lastName,
    role,
    icon = "",
  ) {
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
        icon,
      }),
    });

    const data = await response.json();
    localStorage.setItem("token", data.access_token);
    return { token: data.access_token };
  }
}

export default AuthService;

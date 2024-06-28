// AuthService.js
// import jwt_decode from "jwt-decode";
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

    return {
      token: data.access_token,
      username: data.username,
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      role: data.role,
    }; 
  }

  static logout() {
    localStorage.removeItem("token");
  }

  static getToken() {
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

  // static async getUser(token) {
  //   try {
  //     const tokenParts = token.split('.');
  //     if (tokenParts.length !== 3) {
  //       throw new Error('Invalid token format');
  //     }

  //     const payload = JSON.parse(atob(tokenParts[1]));
  //     const username = payload.sub; // Extract the username from the payload

  //     const response = await fetch(`${API_URL}/auth/${username}`, {
  //       method: "GET",
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     if (!response.ok) {
  //       throw new Error("Failed to fetch user details");
  //     }

  //     const userData = await response.json();
  //     return userData;
  //   } catch (error) {
  //     console.error("Error fetching user details:", error);
  //     throw error;
  //   }
  // }
  
}

export default AuthService;

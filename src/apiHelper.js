import { decode } from 'jwt-js-decode';

const API_BASE_URL = "http://localhost:4000";

export async function registerUser(username, email, passwordHash) {
    const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, passwordHash })
    });

    const data = await response.json();
    console.log(data.token);
    
    // Store the token in local storage
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    
    return data;
  }
  
  export async function loginUser(email, password) {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    console.log(data.token);
    
    // Store the token in local storage
    if (data.token) {
        localStorage.setItem('token', data.token);
    }

    return data;
}

export async function autoLoginUser() {
  const token = localStorage.getItem('token');

  if (token) {
      try {
          // Decode the token to get user information
          const decodedToken = decode(token);
          const currentTime = Date.now() / 1000; // Current time in seconds

          // Check if the token is still valid
          if (decodedToken.payload.exp > currentTime) {
              // Token is valid, user is logged in
              return true;
          } else {
              // Token is expired
              localStorage.removeItem('token'); // Remove expired token
              return false;
          }
      } catch (error) {
          console.error("Error decoding token:", error.message);
          return false; // Return false if there's an error
      }
  }
  return false; // No token found, user is not logged in
}

export async function addSnippet(title, description, code, language = "Plain Text") {
    const token = localStorage.getItem('token'); // Get the token from local storage

    const response = await fetch(`${API_BASE_URL}/snippets`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // Include the token in the headers
        },
        body: JSON.stringify({ title, description, code, language })
    });

    const data = await response.json();
    return data;
}

export async function updateSnippet(snippetId, title, description, code, language = "Plain Text") {
    const token = localStorage.getItem('token'); // Get the token from local storage

    const response = await fetch(`${API_BASE_URL}/snippets/${snippetId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // Include the token in the headers
        },
        body: JSON.stringify({ title, description, code, language })
    });

    const data = await response.json();
    return data;
}

export async function fetchSnippets() {
    const token = localStorage.getItem('token'); // Get the token from local storage

    // Decode the token to get the userId
    const decodedToken = decode(token);
    const userId = decodedToken.payload.userId; // Extract userId from the token

    const response = await fetch(`${API_BASE_URL}/snippets/${userId}`, {
        headers: {
            "Authorization": `Bearer ${token}` // Include the token in the headers
        }
    });

    const snippets = await response.json();
    return snippets;
}

export async function getSnippetById(snipId) {
    const response = await fetch(`${API_BASE_URL}/snippet/${snipId}`);
    const snippet = await response.json();
    return snippet;
}

export async function deleteSnippet(snippetId) {
    const token = localStorage.getItem('token'); // Get the token from local storage

    const response = await fetch(`${API_BASE_URL}/snippets-del/${snippetId}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}` // Include the token in the headers
        }
    });

    const data = await response.json();
    console.log(data);
}

export async function getCodeProperties(code) {
    const response = await fetch(`${API_BASE_URL}/genProp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code })
    });

    const data = await response.json();
    return data;
}

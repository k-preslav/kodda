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
    
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    
    return data;
  }
  
  export async function loginUser(username, password) {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    
    const data = await response.json();
    console.log(data.token);
    
    if (data.token) {
        localStorage.setItem('token', data.token);
    }

    return data;
}
export async function autoLoginUser() {
    const token = localStorage.getItem('token');

    if (token) {
        try {
            const decodedToken = decode(token);
            const currentTime = Date.now() / 1000;

            // Check if the token is expired
            if (decodedToken.payload.exp > currentTime) {
                
                // Verify the token with the server
                const verify = await verifyToken(token);
                if (verify.ok) {
                    // Check if the user exists
                    const exists = await userExists(token);
                    if (exists.ok) {
                        return true; // Token is valid and user exists
                    } else {
                        return false; // User does not exist
                    }
                } else {
                    return false; // Token is not valid
                }
            } else {
                localStorage.removeItem('token'); // Remove expired token
                return false;
            }
        } catch (error) {
            console.error("Error decoding token:", error.message);
            return false;
        }
    }
    return false;
}

export async function verifyToken(token) {
    const response = await fetch(`${API_BASE_URL}/verify-token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    return response;
}

export async function userExists(token) {
    // Decode the token to get the userId
    const decodedToken = decode(token);
    const userId = decodedToken.payload.userId;

    const response = await fetch(`${API_BASE_URL}/user-exists/${userId}`, {
        method: 'POST', // Change to POST
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    const data = await response.json();
    return data;
}


export async function addSnippet(title, description, code, language = "Plain Text") {
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_BASE_URL}/add-snippet`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ title, description, code, language })
    });

    const data = await response.json();
    return data;
}

export async function updateSnippet(snippetId, title, description, code, language = "Plain Text") {
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_BASE_URL}/update-snippet/${snippetId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ title, description, code, language })
    });

    const data = await response.json();
    return data;
}

export async function fetchSnippets() {
    const token = localStorage.getItem('token');

    // Decode the token to get the userId
    const decodedToken = decode(token);
    const userId = decodedToken.payload.userId;

    const response = await fetch(`${API_BASE_URL}/get-snippets-for-user/${userId}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    const snippets = await response.json();
    return snippets;
}

export async function getSnippetById(snipId) {
    const response = await fetch(`${API_BASE_URL}/get-snippet/${snipId}`);
    const snippet = await response.json();
    return snippet;
}

export async function deleteSnippet(snippetId) {
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_BASE_URL}/delete-snippet/${snippetId}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
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

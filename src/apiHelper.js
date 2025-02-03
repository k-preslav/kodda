import { decode } from 'jwt-js-decode';

const API_BASE_URL = "http://localhost:4000";

export async function registerUser(username, email, passwordHash) {
    const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, passwordHash })
    });

    const data = await response.json();
    
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

            if (decodedToken.payload.exp > currentTime) {
                const verify = await verifyToken(token);
                if (verify.ok) {
                    const exists = await userExists(token);
                    if (exists.ok) {
                        const verified = await isUserVerified();
                        if (verified.verified) {
                            resetUserAttempts();
                            return true;
                        } else {
                            console.log("User not verified");

                            sendVerificationCode().then((data) => {
                                if (data.success) {
                                    window.location.href = "../pages/register/verify.html";
                                }
                            });
                        }
                    } else {
                        console.log("User does not exist");
                        return false;
                    }
                } else {
                    console.log("Token is not valid");
                    return false;
                }
            } else {
                console.log("Token is expired");
                localStorage.removeItem('token');
                return false;
            }
        } catch (error) {
            console.error("Error decoding token:", error);
            return false;
        }
    }
    else {
        console.log("No token found");
        return false;
    }
}

export async function sendVerificationCode() {
    const token = localStorage.getItem('token');

    const decodedToken = decode(token);
    const userId = decodedToken.payload.userId;
    
    const response = await fetch(`${API_BASE_URL}/send-user-verify`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId })
    });

    const data = await response.json();
    return data;
}

export async function sendResetPasswordLink() {
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_BASE_URL}/send-reset-password-link`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });

    const data = await response.json();
    return data;
}

export async function resetPassword(newPassword) {
    const token = localStorage.getItem('token');

    const decodedToken = decode(token);
    const userId = decodedToken.payload.userId;

    const response = await fetch(`${API_BASE_URL}/reset-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId, newPassword })
    });

    const data = await response.json();
    return data;
}

export async function resetUserAttempts() {
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_BASE_URL}/reset-user-attempts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });

    const data = await response.json();
    return data;
}

export async function verifyCode(code) {
    const token = localStorage.getItem('token');

    const decodedToken = decode(token);
    const userId = decodedToken.payload.userId;
    
    const response = await fetch(`${API_BASE_URL}/verify-user`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId, verificationCode: code })
    });
    
    const data = await response.json();
    console.log(data);
    return data;
}

export async function verifyToken(token) {
    const response = await fetch(`${API_BASE_URL}/verify-token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    const data = await response.json();
    return data;
}

export async function isUserVerified() {
    const token = localStorage.getItem('token');
    
    const decodedToken = decode(token);
    const userId = decodedToken.payload.userId;

    const response = await fetch(`${API_BASE_URL}/is-user-verified`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId: userId })
    });

    const data = await response.json();
    return data;
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

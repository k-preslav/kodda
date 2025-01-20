const API_BASE_URL = "http://localhost:4000";

export async function registerUser(username, email, passwordHash) {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, passwordHash })
  });

  const data = await response.json();
  return data;
}

export async function loginUser(username, email, password) {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password })
  });

  const data = await response.json();
  return data;
}

export async function loginUserById(userId) {
  const response = await fetch(`${API_BASE_URL}/loginById`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId })
  });

  const data = await response.json();
  return data;
}

export async function addSnippet(userId, title, description, code, language = "Plain Text") {
  const response = await fetch(`${API_BASE_URL}/snippets`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, title, description, code, language })
  });

  const data = await response.json();
  return data;
}

export async function fetchSnippets(userId) {
  const response = await fetch(`${API_BASE_URL}/snippets/${userId}`);
  const snippets = await response.json();
  console.log(snippets);
}

export async function deleteSnippet(snippetId) {
  const response = await fetch(`${API_BASE_URL}/snippets/${snippetId}`, {
    method: "DELETE"
  });

  const data = await response.json();
  console.log(data);
}


export async function getTitleAndDescription(code) {
  const response = await fetch(`${API_BASE_URL}/genDesc`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code })
  });

  const data = await response.json();
  return data;
}
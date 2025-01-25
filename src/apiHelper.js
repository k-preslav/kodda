const API_BASE_URL = "https://kodda-api.loophole.site";

export async function registerUser(username, email, passwordHash) {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, passwordHash })
  });

  const data = await response.json();
  return data;
}

export async function loginUser(email, password) {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
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

export async function updateSnippet(snippetId, userId, title, description, code, language = "Plain Text") {
  const response = await fetch(`${API_BASE_URL}/snippets/${snippetId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, title, description, code, language })
  });

  const data = await response.json();
  return data;
}


export async function fetchSnippets(userId) {
  const response = await fetch(`${API_BASE_URL}/snippets/${userId}`);
  const snippets = await response.json();
  
  return snippets;
}

export async function getSnippetById(snipId) {
  const response = await fetch(`${API_BASE_URL}/snippet/${snipId}`);
  const snippet = await response.json();
  
  return snippet;
}

export async function deleteSnippet(snippetId) {
  const response = await fetch(`${API_BASE_URL}/snippets-del/${snippetId}`, {
    method: "DELETE"
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
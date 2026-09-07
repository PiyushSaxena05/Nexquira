const API_BASE = 'http://localhost:8080/api';
let isRegisterMode = false;

document.addEventListener('DOMContentLoaded', async () => {
    // Purane notes (textarea wale) load karo
    chrome.storage.local.get(['ResearchInsights'], (result) => {
        if (result.ResearchInsights) {
            document.getElementById("notes").value = result.ResearchInsights;
        }
    });

    // Check karo pehle se login hai ya nahi
    const { authToken, userEmail } = await chrome.storage.local.get(['authToken', 'userEmail']);
    if (authToken) {
        showAppView(userEmail);
    } else {
        showAuthView();
    }

    // Auth tab switching
    document.getElementById('loginTabBtn').addEventListener('click', () => switchAuthMode(false));
    document.getElementById('registerTabBtn').addEventListener('click', () => switchAuthMode(true));
    document.getElementById('authSubmitBtn').addEventListener('click', handleAuthSubmit);

    // Main app buttons
    document.getElementById('summarizeBtn').addEventListener('click', Summarize);
    document.getElementById('saveNotesBtn').addEventListener('click', SaveNotes);
    document.getElementById('viewNotesBtn').addEventListener('click', loadMyNotes);
    document.getElementById('logoutBtn').addEventListener('click', logout);
});

function switchAuthMode(registerMode) {
    isRegisterMode = registerMode;
    document.getElementById('loginTabBtn').classList.toggle('active', !registerMode);
    document.getElementById('registerTabBtn').classList.toggle('active', registerMode);
    document.getElementById('nameField').style.display = registerMode ? 'block' : 'none';
    document.getElementById('authSubmitBtn').textContent = registerMode ? 'Register' : 'Login';
    document.getElementById('authError').textContent = '';
}

async function handleAuthSubmit() {
    const email = document.getElementById('emailInput').value.trim();
    const password = document.getElementById('passwordInput').value;
    const name = document.getElementById('nameInput').value.trim();
    const errorEl = document.getElementById('authError');
    errorEl.textContent = '';

    if (!email || !password || (isRegisterMode && !name)) {
        errorEl.textContent = 'Please fill all fields';
        return;
    }

    const endpoint = isRegisterMode ? '/auth/register' : '/auth/login';
    const body = isRegisterMode ? { name, email, password } : { email, password };

    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error(isRegisterMode ? 'Registration failed' : 'Invalid email or password');
        }

        const data = await response.json();

        await chrome.storage.local.set({
            authToken: data.token,
            userEmail: data.email
        });

        showAppView(data.email);
    } catch (error) {
        errorEl.textContent = error.message;
    }
}

function showAuthView() {
    document.getElementById('authView').style.display = 'block';
    document.getElementById('appView').style.display = 'none';
}

function showAppView(email) {
    document.getElementById('authView').style.display = 'none';
    document.getElementById('appView').style.display = 'flex';
    document.getElementById('userEmail').textContent = email;
}

async function logout() {
    await chrome.storage.local.remove(['authToken', 'userEmail']);
    document.getElementById('results').innerHTML = '';
    document.getElementById('notesList').innerHTML = '';
    showAuthView();
}

// Har protected API call ke liye Authorization header nikalne wala helper
async function getAuthHeaders() {
    const { authToken } = await chrome.storage.local.get(['authToken']);
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
    };
}

async function Summarize() {
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        const [{ result }] = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: () => window.getSelection().toString()
        });

        if (!result) {
            showResult('Please select some text first');
            return;
        }

        const headers = await getAuthHeaders();
        const response = await fetch(`${API_BASE}/research/process`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ content: result, operation: 'summarize' })
        });

        if (response.status === 403) {
            showResult('Session expired, please login again.');
            logout();
            return;
        }
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const text = await response.text();
        showResult(text.replace(/\n/g, '<br>'));
    } catch (error) {
        showResult('Error: ' + error.message);
    }
}

async function loadMyNotes() {
    try {
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_BASE}/notes`, { headers });

        if (!response.ok) {
            throw new Error(`Could not fetch notes: ${response.status}`);
        }

        const notes = await response.json();
        renderNotesList(notes);
    } catch (error) {
        document.getElementById('notesList').innerHTML = `<p>Error loading notes: ${error.message}</p>`;
    }
}

function renderNotesList(notes) {
    const container = document.getElementById('notesList');
    if (notes.length === 0) {
        container.innerHTML = '<p>No saved notes yet.</p>';
        return;
    }

    container.innerHTML = notes.map(note => `
        <div class="note-item">
            <div class="note-meta">${note.operation} · ${new Date(note.createdAt).toLocaleString()}</div>
            <div class="note-summary">${note.aiSummary}</div>
        </div>
    `).join('');
}

async function SaveNotes() {
    const notes = document.getElementById('notes').value;
    chrome.storage.local.set({ 'ResearchInsights': notes }, () => {
        alert('Notes saved successfully');
    });
}

function showResult(content) {
    document.getElementById('results').innerHTML = `
        <div class="result-item">
            <div class="result-content">${content}</div>
        </div>
    `;
}

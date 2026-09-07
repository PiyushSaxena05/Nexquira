
const API_BASE = 'http://localhost:8080/api';
let isRegisterMode = false;

document.addEventListener('DOMContentLoaded', async () => {
    chrome.storage.local.get(['ResearchInsights'], (result) => {
        if (result.ResearchInsights) {
            document.getElementById('notes').value = result.ResearchInsights;
        }
    });

    const { authToken, userEmail } =
        await chrome.storage.local.get(['authToken', 'userEmail']);

    if (authToken) {
        showAppView(userEmail);
    } else {
        showAuthView();
    }

    document.getElementById('loginTabBtn')
        .addEventListener('click', () => switchAuthMode(false));

    document.getElementById('registerTabBtn')
        .addEventListener('click', () => switchAuthMode(true));

    document.getElementById('authSubmitBtn')
        .addEventListener('click', handleAuthSubmit);

    document.getElementById('summarizeBtn')
        .addEventListener('click', Summarize);

    document.getElementById('saveNotesBtn')
        .addEventListener('click', SaveNotes);

    document.getElementById('viewNotesBtn')
        .addEventListener('click', loadMyNotes);

    document.getElementById('logoutBtn')
        .addEventListener('click', logout);
});

function switchAuthMode(registerMode) {
    isRegisterMode = registerMode;

    document.getElementById('loginTabBtn')
        .classList.toggle('active', !registerMode);

    document.getElementById('registerTabBtn')
        .classList.toggle('active', registerMode);

    document.getElementById('nameField').style.display =
        registerMode ? 'block' : 'none';

    const submitBtn = document.getElementById('authSubmitBtn');
    const label = submitBtn.querySelector('span:first-child');

    if (label) {
        label.textContent = registerMode
            ? 'Create workspace'
            : 'Login to workspace';
    }

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

    const submitBtn = document.getElementById('authSubmitBtn');
    const label = submitBtn.querySelector('span:first-child');

    submitBtn.disabled = true;

    if (label) {
        label.textContent = isRegisterMode
            ? 'Creating workspace...'
            : 'Signing you in...';
    }

    const endpoint = isRegisterMode
        ? '/auth/register'
        : '/auth/login';

    const body = isRegisterMode
        ? { name, email, password }
        : { email, password };

    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error(
                isRegisterMode
                    ? 'Registration failed'
                    : 'Invalid email or password'
            );
        }

        const data = await response.json();

        await chrome.storage.local.set({
            authToken: data.token,
            userEmail: data.email
        });

        showAppView(data.email);
    } catch (error) {
        errorEl.textContent = error.message;
    } finally {
        submitBtn.disabled = false;

        if (label) {
            label.textContent = isRegisterMode
                ? 'Create workspace'
                : 'Login to workspace';
        }
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

async function getAuthHeaders() {
    const { authToken } =
        await chrome.storage.local.get(['authToken']);

    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
    };
}

async function Summarize() {
    const summarizeBtn = document.getElementById('summarizeBtn');

    try {
        const [tab] = await chrome.tabs.query({
            active: true,
            currentWindow: true
        });

        const [{ result }] = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: () => window.getSelection().toString()
        });

        if (!result) {
            showResult('Please select some text first');
            return;
        }

        summarizeBtn.disabled = true;
        summarizeBtn.classList.add('loading');

        const originalContent = summarizeBtn.innerHTML;

        summarizeBtn.innerHTML = `
            <div class="action-card-top">
                <div class="action-icon">◌</div>
                <span class="action-arrow">↗</span>
            </div>

            <div class="action-card-content">
                <h3>Analyzing...</h3>
                <p>Turning your selection into insight.</p>
            </div>

            <div class="action-card-footer">
                <span>AI is thinking</span>
                <span class="action-status">●</span>
            </div>
        `;

        const headers = await getAuthHeaders();

        const response = await fetch(`${API_BASE}/research/process`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                content: result,
                operation: 'summarize'
            })
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

        showResult(text);

        summarizeBtn.innerHTML = originalContent;
    } catch (error) {
        showResult('Error: ' + error.message);
    } finally {
        summarizeBtn.disabled = false;
        summarizeBtn.classList.remove('loading');
    }
}

async function loadMyNotes() {
    try {
        const headers = await getAuthHeaders();

        const response = await fetch(`${API_BASE}/notes`, {
            headers
        });

        if (!response.ok) {
            throw new Error(`Could not fetch notes: ${response.status}`);
        }

        const notes = await response.json();

        renderNotesList(notes);
    } catch (error) {
        document.getElementById('notesList').innerHTML = `
            <div class="result-item error-state">
                <div class="result-content">
                    Error loading notes: ${escapeHtml(error.message)}
                </div>
            </div>
        `;
    }
}

function renderNotesList(notes) {
    const container = document.getElementById('notesList');

    if (notes.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">▤</div>
                <h3>No saved insights yet</h3>
                <p>Your saved research will appear here.</p>
            </div>
        `;

        return;
    }

    container.innerHTML = notes.map(note => `
        <div class="note-item">
            <div class="note-meta">
                ${escapeHtml(note.operation)}
                ·
                ${new Date(note.createdAt).toLocaleString()}
            </div>

            <div class="note-summary">
                ${escapeHtml(note.aiSummary)}
            </div>
        </div>
    `).join('');
}

async function SaveNotes() {
    const notes = document.getElementById('notes').value;

    chrome.storage.local.set({
        'ResearchInsights': notes
    }, () => {
        alert('Notes saved successfully');
    });
}

function showResult(content) {
    document.getElementById('results').innerHTML = `
        <div class="result-item">
            <div class="result-header">
                <span class="section-kicker">AI INSIGHT</span>
                <span class="result-badge">Generated</span>
            </div>

            <div class="result-content">
                ${escapeHtml(content).replace(/\n/g, '<br>')}
            </div>
        </div>
    `;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

document.getElementById('loginForm').onsubmit = async (e) => {
    e.preventDefault();
    const username = e.target[0].value;
    const password = e.target[1].value;

    const res = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    if (data.success) {
        localStorage.setItem('selected-theme', data.theme || 'default');
        window.location.href = '/dashboard';
    } else {
        alert("SISTEMA: " + data.msg);
    }
};

document.getElementById('regForm').onsubmit = async (e) => {
    e.preventDefault();
    const username = e.target[0].value;
    const password = e.target[1].value;

    const res = await fetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    alert("SISTEMA: " + data.msg);
    if (data.success) toggleAuth(); // Vuelve al login tras registrarse
};
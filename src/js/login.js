const translations = {
    zh: {
        loginTitle: "用户登录",
        username: "用户名",
        password: "密码",
        loginButton: "登录",
        forgotPassword: "忘记密码？",
        register: "新用户注册"
    },
    en: {
        loginTitle: "User Login",
        username: "Username",
        password: "Password",
        loginButton: "Login",
        forgotPassword: "Forgot Password?",
        register: "Register"
    },
    ms: {
        loginTitle: "Log Masuk Pengguna",
        username: "Nama Pengguna",
        password: "Kata Laluan",
        loginButton: "Log Masuk",
        forgotPassword: "Lupa Kata Laluan?",
        register: "Daftar"
    }
};

function changeLanguage() {
    const lang = document.getElementById('language').value;
    const t = translations[lang];
    
    document.getElementById('login-title').textContent = t.loginTitle;
    document.querySelector('label[for="username"]').textContent = t.username;
    document.querySelector('label[for="password"]').textContent = t.password;
    document.querySelector('.login-btn').textContent = t.loginButton;
    document.getElementById('forgot-password').textContent = t.forgotPassword;
    document.getElementById('register-link').textContent = t.register;
}

function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // 获取用户密码
    const userPasswords = JSON.parse(localStorage.getItem('userPasswords') || '{}');
    const storedPassword = userPasswords[username] || 'password';  // 默认密码为 'password'

    if (password === storedPassword) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', username);
        localStorage.setItem('loginTime', Date.now());
        
        // 初始化用户配置文件
        if (!localStorage.getItem('userProfile')) {
            const initialProfile = {
                fullname: username,
                email: '',
                phone: '',
                address: ''
            };
            localStorage.setItem('userProfile', JSON.stringify(initialProfile));
        }
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 100);
    } else {
        const lang = document.getElementById('language').value;
        const errorMsg = {
            'zh': '用户名或密码错误！',
            'en': 'Invalid username or password!',
            'ms': 'Nama pengguna atau kata laluan tidak sah!'
        }[lang] || 'Invalid username or password!';
        alert(errorMsg);
    }
}

function checkLoginState() {
    if (localStorage.getItem('isLoggedIn') === 'true' && 
        window.location.pathname.endsWith('login.html')) {
        window.location.href = 'index.html';
    }
}

document.addEventListener('DOMContentLoaded', checkLoginState); 

// 添加默认用户数据
if (!localStorage.getItem('userPasswords')) {
    const defaultUsers = {
        'admin': 'password',
        'test': 'test123'
    };
    localStorage.setItem('userPasswords', JSON.stringify(defaultUsers));
} 
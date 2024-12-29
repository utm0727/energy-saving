// 检查是否已经定义了 UserManager
if (!window.UserManager) {
    class UserManager {
        constructor() {
            this.initializeUserState();
            this.setupEventListeners();
        }

        initializeUserState() {
            const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
            const username = localStorage.getItem('username');
            const loginTime = localStorage.getItem('loginTime');
            
            // 检查登录是否过期（24小时）
            if (loginTime && Date.now() - parseInt(loginTime) > 24 * 60 * 60 * 1000) {
                this.logout();
                return;
            }

            if (isLoggedIn && !username) {
                const savedProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
                if (savedProfile.fullname) {
                    localStorage.setItem('username', savedProfile.fullname);
                }
            }
            this.updateUIState(isLoggedIn, username);
        }

        setupEventListeners() {
            // 登出按钮点击事件
            document.querySelector('.logout-btn')?.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });

            // 个人资料链接点击事件
            document.querySelector('a[href="#profile"]')?.addEventListener('click', (e) => {
                e.preventDefault();
                showPage('profile');
                // 隐藏下拉菜单
                document.querySelector('.user-dropdown')?.classList.remove('show');
            });
        }

        updateUIState(isLoggedIn, username = '') {
            const loggedInUI = document.querySelector('.logged-in');
            const loggedOutUI = document.querySelector('.logged-out');
            
            if (!loggedInUI || !loggedOutUI) return;

            if (isLoggedIn) {
                loggedInUI.classList.add('active');
                loggedOutUI.classList.remove('active');
                const usernameElement = document.getElementById('username');
                if (usernameElement) {
                    usernameElement.textContent = username;
                }
            } else {
                loggedInUI.classList.remove('active');
                loggedOutUI.classList.add('active');
            }
        }

        logout() {
            const username = localStorage.getItem('username');
            const userPasswords = JSON.parse(localStorage.getItem('userPasswords') || '{}');
            const password = userPasswords[username];
            
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('username');
            localStorage.removeItem('loginTime');
            
            if (password) {
                const passwords = JSON.parse(localStorage.getItem('userPasswords') || '{}');
                passwords[username] = password;
                localStorage.setItem('userPasswords', JSON.stringify(passwords));
            }
            
            this.updateUIState(false);
            window.location.href = 'login.html';
        }

        checkLoginState() {
            const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
            const loginTime = localStorage.getItem('loginTime');
            
            // 检查登录状态和时间
            if (!isLoggedIn || !loginTime || Date.now() - parseInt(loginTime) > 24 * 60 * 60 * 1000) {
                if (window.location.pathname.endsWith('index.html')) {
                    window.location.href = 'login.html';
                }
            }
        }

        checkAuthRequired() {
            // 检查是否需要登录验证
            const protectedPages = ['settings', 'recommendations', 'analysis'];
            const currentPage = window.location.hash.substring(1) || 'dashboard';
            
            if (protectedPages.includes(currentPage) && !localStorage.getItem('isLoggedIn')) {
                window.location.href = 'login.html';
            }
        }
    }
    window.UserManager = UserManager;
}

// 检查是否已经定义
if (!window.mainTranslations) {
    const mainTranslations = {
        zh: {
            // 导航
            dashboard: "主页面板",
            analysis: "用电分析",
            recommendations: "AI建议",
            leaderboard: "社区排行",
            settings: "设置",
            
            // 仪表盘
            monthlyOverview: "本月概览",
            usage: "用电量",
            estimatedCost: "预计费用",
            usageTrend: "用电趋势",
            aiRecommendations: "AI 节能建议",
            realTimeUsage: "实时用电",
            currentUsage: "当前用电",
            
            // 分页面
            usageOverview: "用电概览",
            avgDailyUsage: "日均用电量",
            peakHourUsage: "高峰用电量",
            monthlyTrend: "月度趋势",
            energyUsageAnalysis: "用电分析",
            dailyUsagePattern: "日常用电模式",
            monthlyComparison: "月度对比",
            usageBreakdown: "用电分布",
            
            // 排行榜
            communityChampions: "社区节能冠军",
            allAreas: "所有区域",
            northRegion: "北部区域",
            southRegion: "南部区域",
            centralRegion: "中部区域",
            thisMonth: "本月",
            thisQuarter: "本季度",
            thisYear: "本年度",
            rank: "排名",
            family: "家庭",
            energySaved: "节能能源",
            points: "积分",
            rewards: "奖励",
            
            // 设置页面
            profileSettings: "个人资料设置",
            fullName: "姓名",
            email: "电子邮箱",
            phone: "电话号码",
            address: "地址",
            updateProfile: "更新资料",
            securitySettings: "安全设置",
            currentPassword: "当前密码",
            newPassword: "新密码",
            confirmPassword: "确认密码",
            changePassword: "修改密码",
            notificationSettings: "通知设置",
            emailNotifications: "邮件通知",
            smsNotifications: "短信通知",
            pushNotifications: "推送通知",
            usageAlerts: "用电提醒",
            savingTips: "节能提示",
            billReminders: "账单提醒",
            
            // 用户菜单
            profile: "个人资料",
            logout: "退出登录",
            login: "登录",
            register: "注册",
            
            // 分析页面
            airConditioning: "空调",
            refrigerator: "冰箱",
            waterHeater: "热水器",
            lighting: "照明",
            others: "其他",
            monthlyPotentialSavings: "每月潜在节省",
            usageReductionTarget: "用电减少目标",
            personalizedEnergySavingTips: "个性化节能建议",
            potentialSavings: "潜在节省",
            
            // 奖励系统
            rewardsProgram: "奖励计划",
            monthlyRebate: "月度返利",
            rebateDescription: "前10名家庭可获得10%账单折扣",
            greenPoints: "绿色积分",
            pointsDescription: "使用积分兑换环保产品",
            redeemNow: "立即兑换",
        },
        en: {
            // Navigation
            dashboard: "Dashboard",
            analysis: "Analysis",
            recommendations: "AI Recommendations",
            leaderboard: "Community Leaderboard",
            settings: "Settings",
            
            // Dashboard
            monthlyOverview: "Monthly Overview",
            usage: "Usage",
            estimatedCost: "Estimated Cost",
            usageTrend: "Usage Trend",
            aiRecommendations: "AI Energy Saving Tips",
            realTimeUsage: "Real-time Usage",
            currentUsage: "Current Usage",
            
            // Analysis
            usageOverview: "Usage Overview",
            avgDailyUsage: "Average Daily Usage",
            peakHourUsage: "Peak Hour Usage",
            monthlyTrend: "Monthly Trend",
            energyUsageAnalysis: "Energy Usage Analysis",
            dailyUsagePattern: "Daily Usage Pattern",
            monthlyComparison: "Monthly Comparison",
            usageBreakdown: "Usage Breakdown",
            
            // Leaderboard
            communityChampions: "Community Energy Saving Champions",
            allAreas: "All Areas",
            northRegion: "North Region",
            southRegion: "South Region",
            centralRegion: "Central Region",
            thisMonth: "This Month",
            thisQuarter: "This Quarter",
            thisYear: "This Year",
            rank: "Rank",
            family: "Family",
            energySaved: "Energy Saved",
            points: "Points",
            rewards: "Rewards",
            
            // Settings
            profileSettings: "Profile Settings",
            fullName: "Full Name",
            email: "Email",
            phone: "Phone Number",
            address: "Address",
            updateProfile: "Update Profile",
            securitySettings: "Security Settings",
            currentPassword: "Current Password",
            newPassword: "New Password",
            confirmPassword: "Confirm Password",
            changePassword: "Change Password",
            notificationSettings: "Notification Settings",
            emailNotifications: "Email Notifications",
            smsNotifications: "SMS Notifications",
            pushNotifications: "Push Notifications",
            usageAlerts: "Usage Alerts",
            savingTips: "Saving Tips",
            billReminders: "Bill Reminders",
            
            // User Menu
            profile: "Profile",
            logout: "Logout",
            login: "Login",
            register: "Register",
            
            // Analysis page
            airConditioning: "Air Conditioning",
            refrigerator: "Refrigerator",
            waterHeater: "Water Heater",
            lighting: "Lighting",
            others: "Others",
            monthlyPotentialSavings: "Monthly Potential Savings",
            usageReductionTarget: "Usage Reduction Target",
            personalizedEnergySavingTips: "Personalized Energy Saving Tips",
            potentialSavings: "Potential Savings",
            
            // Rewards system
            rewardsProgram: "Rewards Program",
            monthlyRebate: "Monthly Rebate",
            rebateDescription: "Top 10 families get 10% off their bill",
            greenPoints: "Green Points",
            pointsDescription: "Redeem points for eco-friendly products",
            redeemNow: "Redeem Now",
        },
        ms: {
            // Navigasi
            dashboard: "Panel Utama",
            analysis: "Analisis",
            recommendations: "Cadangan AI",
            leaderboard: "Kedudukan Komuniti",
            settings: "Tetapan",
            
            // Panel Utama
            monthlyOverview: "Gambaran Bulanan",
            usage: "Penggunaan",
            estimatedCost: "Anggaran Kos",
            usageTrend: "Trend Penggunaan",
            aiRecommendations: "Tip Penjimatan Tenaga AI",
            realTimeUsage: "Penggunaan Masa Nyata",
            currentUsage: "Penggunaan Semasa",
            
            // Analisis
            usageOverview: "Gambaran Penggunaan",
            avgDailyUsage: "Purata Penggunaan Harian",
            peakHourUsage: "Penggunaan Waktu Puncak",
            monthlyTrend: "Trend Bulanan",
            energyUsageAnalysis: "Analisis Penggunaan Tenaga",
            dailyUsagePattern: "Corak Penggunaan Harian",
            monthlyComparison: "Perbandingan Bulanan",
            usageBreakdown: "Pecahan Penggunaan",
            
            // Kedudukan
            communityChampions: "Juara Penjimatan Tenaga Komuniti",
            allAreas: "Semua Kawasan",
            northRegion: "Kawasan Utara",
            southRegion: "Kawasan Selatan",
            centralRegion: "Kawasan Tengah",
            thisMonth: "Bulan Ini",
            thisQuarter: "Suku Tahun Ini",
            thisYear: "Tahun Ini",
            rank: "Kedudukan",
            family: "Keluarga",
            energySaved: "Tenaga Dijimatkan",
            points: "Mata",
            rewards: "Ganjaran",
            
            // Tetapan
            profileSettings: "Tetapan Profil",
            fullName: "Nama Penuh",
            email: "Emel",
            phone: "Nombor Telefon",
            address: "Alamat",
            updateProfile: "Kemaskini Profil",
            securitySettings: "Tetapan Keselamatan",
            currentPassword: "Kata Laluan Semasa",
            newPassword: "Kata Laluan Baru",
            confirmPassword: "Sahkan Kata Laluan",
            changePassword: "Tukar Kata Laluan",
            notificationSettings: "Tetapan Pemberitahuan",
            emailNotifications: "Pemberitahuan Emel",
            smsNotifications: "Pemberitahuan SMS",
            pushNotifications: "Pemberitahuan Push",
            usageAlerts: "Amaran Penggunaan",
            savingTips: "Tip Penjimatan",
            billReminders: "Peringatan Bil",
            
            // Menu Pengguna
            profile: "Profil",
            logout: "Log Keluar",
            login: "Log Masuk",
            register: "Daftar",
            
            // Halaman analisis
            airConditioning: "Penghawa Dingin",
            refrigerator: "Peti Sejuk",
            waterHeater: "Pemanas Air",
            lighting: "Pencahayaan",
            others: "Lain-lain",
            monthlyPotentialSavings: "Potensi Penjimatan Bulanan",
            usageReductionTarget: "Sasaran Pengurangan Penggunaan",
            personalizedEnergySavingTips: "Tip Penjimatan Tenaga Peribadi",
            potentialSavings: "Potensi Penjimatan",
            
            // Sistem ganjaran
            rewardsProgram: "Program Ganjaran",
            monthlyRebate: "Rebat Bulanan",
            rebateDescription: "10 keluarga teratas mendapat diskaun 10%",
            greenPoints: "Mata Hijau",
            pointsDescription: "Tebus mata untuk produk mesra alam",
            redeemNow: "Tebus Sekarang",
        }
    };
    window.mainTranslations = mainTranslations;
}

function changeLanguage() {
    const lang = document.getElementById('language').value;
    const t = mainTranslations[lang];
    
    // 更新所有可翻译的文本
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.dataset.translate;
        if (t[key]) {
            element.textContent = t[key];
        }
    });

    // 更新导航链接
    document.querySelector('a[data-page="dashboard"]').textContent = t.dashboard;
    document.querySelector('a[data-page="analysis"]').textContent = t.analysis;
    document.querySelector('a[data-page="recommendations"]').textContent = t.recommendations;
    document.querySelector('a[data-page="leaderboard"]').textContent = t.leaderboard;
    document.querySelector('a[data-page="settings"]').textContent = t.settings;

    // 更新标题和标签
    document.querySelectorAll('h2, h3, label, span').forEach(element => {
        const key = element.dataset.translate;
        if (key && t[key]) {
            element.textContent = t[key];
        }
    });

    // 更新按钮文本
    document.querySelectorAll('button').forEach(button => {
        const key = button.dataset.translate;
        if (key && t[key]) {
            button.textContent = t[key];
        }
    });

    // 保存语言选择
    localStorage.setItem('preferred_language', lang);
    
    // 重新加载 AI 建议
    if (window.dashboard) {
        window.dashboard.displayAIRecommendations();
    }
}

// 页面加载时设置保存的语言
document.addEventListener('DOMContentLoaded', function() {
    const savedLang = localStorage.getItem('preferred_language');
    if (savedLang) {
        document.getElementById('language').value = savedLang;
        changeLanguage();
    }
});

function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    localStorage.removeItem('loginTime');
    
    // 更新UI
    this.updateUIState(false);
    
    // 使用延时确保状态清除完成
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 100);
}

// 检查登录状态
if (localStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = 'login.html';
}

// 设置默认语言
document.addEventListener('DOMContentLoaded', function() {
    const savedLang = localStorage.getItem('preferred_language') || 'en';
    document.getElementById('language').value = savedLang;
    changeLanguage();
});

// 页面切换功能
function showPage(pageId) {
    // 隐藏所有页面
    document.querySelectorAll('.page-content').forEach(page => {
        page.style.display = 'none';
    });
    
    // 显示选中的页面
    const selectedPage = document.getElementById(pageId + '-page');
    if (selectedPage) {
        selectedPage.style.display = 'block';
        
        // 如果是分析页面，重新初始化图表
        if (pageId === 'analysis' && window.dashboard) {
            // 等待DOM更新完成
            setTimeout(() => {
                // 确保图表容器存在
                if (document.getElementById('monthlyComparisonChart')) {
                    window.dashboard.setupCharts();
                } else {
                    console.warn('Chart containers not ready');
                }
            }, 100);
        }
    }
    
    // 更新导航激活状态
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === pageId) {
            link.classList.add('active');
        }
    });
}

// 添加个人资料页面加载函数
function loadUserProfile() {
    const username = localStorage.getItem('username');
    const savedProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    
    const profileData = {
        fullname: username || savedProfile.fullname || 'User',
        email: savedProfile.email || 'user@example.com',
        phone: savedProfile.phone || '+60123456789',
        address: savedProfile.address || 'Sample Address'
    };
    
    if (!localStorage.getItem('userProfile')) {
        localStorage.setItem('userProfile', JSON.stringify(profileData));
    }
    
    // 更新设置页面的表单
    document.getElementById('settings-fullname').value = profileData.fullname;
    document.getElementById('settings-email').value = profileData.email;
    document.getElementById('settings-phone').value = profileData.phone;
    document.getElementById('settings-address').value = profileData.address;
    
    // 更新个人资料页面的表单
    document.getElementById('profile-fullname').value = profileData.fullname;
    document.getElementById('profile-email').value = profileData.email;
    document.getElementById('profile-phone').value = profileData.phone;
    document.getElementById('profile-address').value = profileData.address;
    
    // 更新用户名显示
    const usernameElement = document.getElementById('username');
    if (usernameElement) {
        usernameElement.textContent = profileData.fullname;
    }
}

// 添加保存个人资料的函数
function saveUserProfile(event) {
    event.preventDefault();
    
    // 获取当前表单的ID
    const formId = event.target.id;
    const prefix = formId === 'settings-profile-form' ? 'settings-' : 'profile-';
    
    const profileData = {
        fullname: document.getElementById(prefix + 'fullname').value,
        email: document.getElementById(prefix + 'email').value,
        phone: document.getElementById(prefix + 'phone').value,
        address: document.getElementById(prefix + 'address').value
    };
    
    // 保存到本地存储
    localStorage.setItem('userProfile', JSON.stringify(profileData));
    localStorage.setItem('username', profileData.fullname);
    
    // 更新用户名显示
    const usernameElement = document.getElementById('username');
    if (usernameElement) {
        usernameElement.textContent = profileData.fullname;
    }
    
    // 更新另一个表单的内容
    const otherPrefix = prefix === 'settings-' ? 'profile-' : 'settings-';
    document.getElementById(otherPrefix + 'fullname').value = profileData.fullname;
    document.getElementById(otherPrefix + 'email').value = profileData.email;
    document.getElementById(otherPrefix + 'phone').value = profileData.phone;
    document.getElementById(otherPrefix + 'address').value = profileData.address;
    
    alert('Profile updated successfully!');
}

// 在 DOMContentLoaded 事件中添加表单提交事件监听
document.addEventListener('DOMContentLoaded', function() {
    initializePages();
    
    // 添加个人资料表单提交事件监听
    // 为两个表都添加提交事件监听
    const profileForms = document.querySelectorAll('#main-profile-form, #settings-profile-form');
    profileForms.forEach(form => {
        form.addEventListener('submit', saveUserProfile);
    });

    // ... 其他现有的初始化代码 ...
});

// 设置导航点击事件
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const pageId = e.target.dataset.page;
        showPage(pageId);
        window.location.hash = pageId;
    });
});

// 初始化页面显示
function initializePages() {
    const hash = window.location.hash.substring(1) || 'dashboard';
    showPage(hash);
}

// 添加到 DOMContentLoaded 事件中
document.addEventListener('DOMContentLoaded', function() {
    initializePages();
    // ... 其他现有的初始化代码 ...
});

// 处理浏览器后退/前进按钮
window.addEventListener('hashchange', function() {
    const hash = window.location.hash.substring(1) || 'dashboard';
    showPage(hash);
});

// 在页面切换时检查权限
window.addEventListener('hashchange', () => {
    if (window.UserManager) {
        const userManager = new window.UserManager();
        userManager.checkAuthRequired();
    }
});

// 添加用户下拉菜单控制
function toggleUserDropdown() {
    const dropdown = document.querySelector('.user-dropdown');
    dropdown.classList.toggle('show');
}

// 点击其他地方关闭下拉菜单
document.addEventListener('click', function(event) {
    const userInfo = document.querySelector('.user-info');
    const dropdown = document.querySelector('.user-dropdown');
    
    if (!userInfo?.contains(event.target)) {
        dropdown?.classList.remove('show');
    }
});

// 添加密码修改功能
function handlePasswordChange(event) {
    event.preventDefault();
    
    const username = localStorage.getItem('username');
    if (!username) {
        alert('User not found');
        return;
    }
    
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    // 获取用户密码
    const userPasswords = JSON.parse(localStorage.getItem('userPasswords') || '{}');
    const storedPassword = userPasswords[username] || 'password';
    
    // 验证当前密码
    if (currentPassword !== storedPassword) {
        alert('Current password is incorrect');
        return;
    }
    
    // 验证新密码
    if (newPassword !== confirmPassword) {
        alert('New passwords do not match');
        return;
    }
    
    // 验证新密码强度
    if (newPassword.length < 6) {
        alert('New password must be at least 6 characters long');
        return;
    }
    
    // 保存新密码
    userPasswords[username] = newPassword;
    localStorage.setItem('userPasswords', JSON.stringify(userPasswords));
    
    // 清空表单
    document.getElementById('security-form').reset();
    
    alert('Password updated successfully!');
}

// 添加密码强度检查
function checkPasswordStrength(password) {
    const strengthBar = document.getElementById('password-strength');
    if (!strengthBar) return;
    
    // 移除有的类
    strengthBar.classList.remove('weak', 'medium', 'strong');
    
    if (!password) {
        strengthBar.style.width = '0';
        return;
    }
    
    // 简单的密码强度检查
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    
    // 设置强度条样式
    switch(strength) {
        case 0:
        case 1:
            strengthBar.classList.add('weak');
            break;
        case 2:
        case 3:
            strengthBar.classList.add('medium');
            break;
        case 4:
            strengthBar.classList.add('strong');
            break;
    }
}

// 在 DOMContentLoaded 事件中添加事件监听器
document.addEventListener('DOMContentLoaded', function() {
    // ... 现有的初始化代码 ...
    
    // 添加密码修改表单提交事件监听
    const securityForm = document.getElementById('security-form');
    if (securityForm) {
        securityForm.addEventListener('submit', handlePasswordChange);
    }
    
    // 添加密码强度检查
    const newPasswordInput = document.getElementById('new-password');
    if (newPasswordInput) {
        newPasswordInput.addEventListener('input', (e) => {
            checkPasswordStrength(e.target.value);
        });
    }
}); 
class SettingsManager {
    constructor() {
        this.initializeListeners();
        // 延迟加载用户资料
        setTimeout(() => this.loadUserProfile(), 100);
    }

    initializeListeners() {
        // Profile form
        document.getElementById('profile-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateProfile();
        });

        // Security form
        document.getElementById('security-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.changePassword();
        });

        // Password strength checker
        document.getElementById('new-password')?.addEventListener('input', (e) => {
            this.checkPasswordStrength(e.target.value);
        });

        // Notification form
        document.getElementById('notification-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveNotificationSettings();
        });

        // 2FA setup
        document.getElementById('enable-2fa')?.addEventListener('click', () => {
            this.setup2FA();
        });
    }

    async loadUserProfile() {
        try {
            const fullnameInput = document.getElementById('fullname');
            const emailInput = document.getElementById('email');
            const phoneInput = document.getElementById('phone');
            const addressInput = document.getElementById('address');
            const usageThresholdInput = document.getElementById('usage-threshold');

            if (!fullnameInput || !emailInput || !phoneInput || !addressInput) {
                console.log('Profile form elements not found');
                return;
            }

            // 从本地存储获取用户资料
            const savedProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
            
            fullnameInput.value = savedProfile.fullname || '';
            emailInput.value = savedProfile.email || '';
            phoneInput.value = savedProfile.phone || '';
            addressInput.value = savedProfile.address || '';
            
            if (usageThresholdInput) {
                usageThresholdInput.value = localStorage.getItem('usage_threshold') || '300';
            }
        } catch (error) {
            console.error('Error loading user profile:', error);
        }
    }

    async updateProfile() {
        const formData = new FormData(document.getElementById('profile-form'));
        const profile = Object.fromEntries(formData);

        try {
            // 模拟API调用
            await new Promise(resolve => setTimeout(resolve, 1000));
            alert('Profile updated successfully!');
        } catch (error) {
            alert('Failed to update profile. Please try again.');
        }
    }

    checkPasswordStrength(password) {
        const strengthIndicator = document.getElementById('password-strength');
        let strength = 0;

        // 检查长度
        if (password.length >= 8) strength++;
        // 检查是否包含数字
        if (/\d/.test(password)) strength++;
        // 检查是否包含特殊字符
        if (/[!@#$%^&*]/.test(password)) strength++;

        strengthIndicator.className = 'password-strength';
        if (strength === 1) strengthIndicator.classList.add('weak');
        else if (strength === 2) strengthIndicator.classList.add('medium');
        else if (strength === 3) strengthIndicator.classList.add('strong');
    }

    async changePassword() {
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (newPassword !== confirmPassword) {
            alert('New passwords do not match!');
            return;
        }

        try {
            // 模拟API调用
            await new Promise(resolve => setTimeout(resolve, 1000));
            alert('Password changed successfully!');
            document.getElementById('security-form').reset();
        } catch (error) {
            alert('Failed to change password. Please try again.');
        }
    }

    async saveNotificationSettings() {
        const formData = new FormData(document.getElementById('notification-form'));
        const settings = Object.fromEntries(formData);

        try {
            // 模拟API调用
            await new Promise(resolve => setTimeout(resolve, 1000));
            alert('Notification settings saved!');
        } catch (error) {
            alert('Failed to save notification settings. Please try again.');
        }
    }

    async setup2FA() {
        const setupContainer = document.querySelector('.setup-2fa');
        setupContainer.style.display = 'block';

        // 模拟获取2FA设置信息
        const qrCode = await this.generate2FAQRCode();
        document.querySelector('.qr-code').innerHTML = qrCode;
    }

    async generate2FAQRCode() {
        // 模拟生成QR码
        return '<img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/EnergyApp:user@example.com?secret=JBSWY3DPEHPK3PXP&issuer=EnergyApp" alt="2FA QR Code">';
    }
}

// 初始化设置管理器
document.addEventListener('DOMContentLoaded', () => {
    window.settingsManager = new SettingsManager();
}); 
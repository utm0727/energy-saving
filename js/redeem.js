class RedeemSystem {
    constructor() {
        this.points = 1200; // 初始点数
        this.initializeListeners();
    }

    initializeListeners() {
        // 为所有兑换按钮添加事件监听
        document.querySelectorAll('.redeem-item-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const points = parseInt(e.target.dataset.points);
                this.redeemItem(points, e.target);
            });
        });

        // 更新所有按钮状态
        this.updateButtonStates();
    }

    redeemItem(points, button) {
        if (this.points >= points) {
            const itemName = button.closest('.redeem-item').querySelector('h3').textContent;
            if (confirm(`Confirm to redeem ${itemName} for ${points} points?`)) {
                this.points -= points;
                this.updatePointsDisplay();
                this.updateButtonStates();
                alert('Redemption successful! We will contact you for delivery details.');
            }
        } else {
            alert('Insufficient points!');
        }
    }

    updatePointsDisplay() {
        document.querySelector('.points-value').textContent = this.points;
    }

    updateButtonStates() {
        document.querySelectorAll('.redeem-item-btn').forEach(button => {
            const points = parseInt(button.dataset.points);
            button.disabled = this.points < points;
        });
    }
}

function showRedeemModal() {
    document.getElementById('redeemModal').style.display = 'block';
}

function closeRedeemModal() {
    document.getElementById('redeemModal').style.display = 'none';
}

// 点击模态框外部关闭
window.onclick = function(event) {
    const modal = document.getElementById('redeemModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// 初始化兑换系统
document.addEventListener('DOMContentLoaded', () => {
    window.redeemSystem = new RedeemSystem();
}); 
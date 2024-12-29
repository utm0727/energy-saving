class CommunityLeaderboard {
    constructor() {
        this.leaderboardData = [];
        this.currentFilter = {
            area: 'all',
            time: 'month'
        };
    }

    async fetchLeaderboard() {
        // 模拟获取排行榜数据
        this.leaderboardData = [
            { rank: 4, name: "Tan Family", savings: 35, rewardPoints: 980 },
            { rank: 5, name: "Lee Family", savings: 33, rewardPoints: 920 },
            { rank: 6, name: "Singh Family", savings: 31, rewardPoints: 890 },
            { rank: 7, name: "Zhang Family", savings: 29, rewardPoints: 850 },
            { rank: 8, name: "Lim Family", savings: 27, rewardPoints: 820 },
            { rank: 9, name: "Raj Family", savings: 25, rewardPoints: 780 },
            { rank: 10, name: "Abdullah Family", savings: 23, rewardPoints: 750 }
        ];
        this.displayLeaderboard();
    }

    displayLeaderboard() {
        const tbody = document.getElementById('leaderboardBody');
        if (!tbody) return;

        tbody.innerHTML = this.leaderboardData.map(entry => `
            <tr>
                <td>${entry.rank}</td>
                <td>${entry.name}</td>
                <td>${entry.savings} kWh</td>
                <td>${entry.rewardPoints} pts</td>
                <td>${this.getRewardBadge(entry.rank)}</td>
            </tr>
        `).join('');
    }

    getRewardBadge(rank) {
        if (rank <= 3) return '🏆 Premium Reward';
        if (rank <= 5) return '🌟 Gold Reward';
        if (rank <= 10) return '✨ Silver Reward';
        return '-';
    }

    init() {
        // 设置过滤器事件监听
        document.getElementById('area-filter')?.addEventListener('change', (e) => {
            this.currentFilter.area = e.target.value;
            this.fetchLeaderboard();
        });

        document.getElementById('time-filter')?.addEventListener('change', (e) => {
            this.currentFilter.time = e.target.value;
            this.fetchLeaderboard();
        });

        // 初始加载数据
        this.fetchLeaderboard();
    }
}

// 初始化排行榜
document.addEventListener('DOMContentLoaded', () => {
    const leaderboard = new CommunityLeaderboard();
    leaderboard.init();
}); 
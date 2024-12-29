class Dashboard {
    constructor() {
        this.energyData = null;
        this.aiRecommendations = [];
        this.charts = {
            usage: null,
            dailyPattern: null,
            monthlyComparison: null,
            breakdown: null
        };
    }

    async init() {
        try {
            console.log('Initializing dashboard...');
            if (!window.energyDatabase) {
                console.error('Energy database not found');
                return;
            }
            await this.loadRealData();
            this.setupCharts();
            this.displayAIRecommendations();
            this.startRealTimeUpdates();
            console.log('Dashboard initialized successfully');
        } catch (error) {
            console.error('Error initializing dashboard:', error);
        }
    }

    async loadRealData() {
        try {
            const allData = window.energyDatabase.dailyUsage;
            this.energyData = {
                totalUsage: allData.slice(-30).reduce((sum, day) => sum + day.usage, 0),
                totalCost: allData.slice(-30).reduce((sum, day) => sum + day.cost, 0),
                averageUsage: allData.slice(-30).reduce((sum, day) => sum + day.usage, 0) / 30,
                data: allData
            };
            console.log('Energy data loaded:', this.energyData);
            this.updateDashboard();
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }

    setupCharts() {
        console.log('Setting up charts...');
        if (!this.energyData) {
            console.error('No energy data available');
            return;
        }

        if (!document.getElementById('usageChart')) {
            console.warn('Chart containers not ready');
            return;
        }

        Object.values(this.charts).forEach(chart => {
            if (chart) {
                try {
                    chart.destroy();
                } catch (error) {
                    console.warn('Error destroying chart:', error);
                }
            }
        });

        this.charts = {
            usage: null,
            dailyPattern: null,
            monthlyComparison: null,
            breakdown: null
        };

        try {
            this.setupUsageChart();
            this.setupDailyPatternChart();
            this.setupMonthlyComparisonChart();
            this.setupBreakdownChart();
            console.log('Charts setup complete');
        } catch (error) {
            console.error('Error setting up charts:', error);
        }
    }

    setupUsageChart() {
        try {
            const canvas = document.getElementById('usageChart');
            if (!canvas) {
                console.warn('Usage chart canvas not found');
                return;
            }

            const newCanvas = document.createElement('canvas');
            newCanvas.id = 'usageChart';
            Object.assign(newCanvas.style, {
                width: '100%',
                height: '100%',
                maxHeight: '400px'
            });
            canvas.parentNode.replaceChild(newCanvas, canvas);

            const ctx = newCanvas.getContext('2d');
            const data = this.energyData.data.map(d => d.usage);
            const labels = this.energyData.data.map(d => d.date);

            this.charts.usage = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Daily Usage (kWh)',
                        data: data,
                        borderColor: '#2196F3',
                        backgroundColor: 'rgba(33, 150, 243, 0.1)',
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    layout: {
                        padding: {
                            top: 20,
                            bottom: 20
                        }
                    },
                    interaction: {
                        intersect: false,
                        mode: 'index'
                    },
                    plugins: {
                        legend: {
                            position: 'top',
                        }
                    },
                    scales: {
                        x: {
                            grid: {
                                display: false
                            },
                            ticks: {
                                maxTicksLimit: 7
                            }
                        },
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(0,0,0,0.05)'
                            }
                        }
                    }
                }
            });
            console.log('Usage chart setup complete');
        } catch (error) {
            console.error('Error setting up usage chart:', error);
        }
    }

    setupDailyPatternChart() {
        try {
            const canvas = document.getElementById('dailyPatternChart');
            if (!canvas) return;
            
            const newCanvas = document.createElement('canvas');
            newCanvas.id = 'dailyPatternChart';
            Object.assign(newCanvas.style, {
                width: '100%',
                height: '100%',
                maxHeight: '400px'
            });
            canvas.parentNode.replaceChild(newCanvas, canvas);
            
            const ctx = newCanvas.getContext('2d');
            const data = this.calculateDailyPattern();
            this.charts.dailyPattern = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['12AM', '3AM', '6AM', '9AM', '12PM', '3PM', '6PM', '9PM'],
                    datasets: [{
                        label: 'Average Usage (kWh)',
                        data: data,
                        borderColor: '#4CAF50',
                        fill: true,
                        backgroundColor: 'rgba(76, 175, 80, 0.1)'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    layout: {
                        padding: {
                            top: 20,
                            bottom: 20,
                            left: 20,
                            right: 20
                        }
                    },
                    interaction: {
                        intersect: false,
                        mode: 'index'
                    },
                    plugins: {
                        legend: {
                            position: 'top'
                        }
                    },
                    scales: {
                        x: {
                            grid: {
                                display: false
                            }
                        },
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(0,0,0,0.05)'
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error setting up daily pattern chart:', error);
        }
    }

    setupMonthlyComparisonChart() {
        try {
            const canvas = document.getElementById('monthlyComparisonChart');
            if (!canvas) {
                console.warn('Monthly comparison chart canvas not found');
                return;
            }

            console.log('Setting up monthly comparison chart');
            const newCanvas = document.createElement('canvas');
            newCanvas.id = 'monthlyComparisonChart';
            Object.assign(newCanvas.style, {
                width: '100%',
                height: '100%',
                maxHeight: '400px'
            });
            canvas.parentNode.replaceChild(newCanvas, canvas);

            const ctx = newCanvas.getContext('2d');
            const monthlyData = this.calculateMonthlyComparison();
            console.log('Monthly data:', monthlyData);

            if (!monthlyData.data || monthlyData.data.length === 0) {
                console.warn('No valid monthly data available');
                return;
            }

            this.charts.monthlyComparison = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: monthlyData.labels,
                    datasets: [{
                        label: 'Monthly Usage (kWh)',
                        data: monthlyData.data,
                        backgroundColor: 'rgba(33, 150, 243, 0.8)',
                        borderColor: '#2196F3',
                        borderWidth: 1,
                        borderRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    layout: {
                        padding: {
                            top: 20,
                            bottom: 20,
                            left: 20,
                            right: 20
                        }
                    },
                    animation: {
                        duration: 1000,
                        easing: 'easeInOutQuart'
                    },
                    plugins: {
                        legend: {
                            position: 'top'
                        }
                    },
                    scales: {
                        x: {
                            grid: {
                                display: false
                            }
                        },
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(0,0,0,0.05)'
                            }
                        }
                    }
                }
            });
            console.log('Monthly comparison chart created successfully');
        } catch (error) {
            console.error('Error setting up monthly comparison chart:', error);
            console.error('Error details:', error.stack);
        }
    }

    setupBreakdownChart() {
        try {
            const canvas = document.getElementById('breakdownChart');
            if (!canvas) return;
            
            const newCanvas = document.createElement('canvas');
            newCanvas.id = 'breakdownChart';
            Object.assign(newCanvas.style, {
                width: '100%',
                height: '100%',
                maxHeight: '400px'
            });
            canvas.parentNode.replaceChild(newCanvas, canvas);
            
            const ctx = newCanvas.getContext('2d');
            const breakdownData = this.calculateApplianceBreakdown();
            
            this.charts.breakdown = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: Object.keys(breakdownData),
                    datasets: [{
                        data: Object.values(breakdownData),
                        backgroundColor: [
                            '#FF6384',
                            '#36A2EB',
                            '#FFCE56',
                            '#4BC0C0',
                            '#9966FF'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    layout: {
                        padding: {
                            top: 20,
                            bottom: 20,
                            left: 20,
                            right: 20
                        }
                    },
                    plugins: {
                        legend: {
                            position: 'right',
                            labels: {
                                padding: 20,
                                font: {
                                    size: 12
                                }
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error setting up breakdown chart:', error);
        }
    }

    displayAIRecommendations() {
        const dashboardContainer = document.getElementById('aiRecommendations');
        const recommendationsContainer = document.getElementById('aiTipsList');
        
        const currentLang = localStorage.getItem('preferred_language') || 'en';
        
        const recommendations = this.generateRecommendations();
        
        const recommendationHTML = recommendations[currentLang].map(rec => `
            <div class="recommendation-item ${rec.priority}-priority">
                <h3>${rec.title}</h3>
                <p>${rec.description}</p>
                <div class="analysis">
                    <strong>${currentLang === 'zh' ? '分析：' : currentLang === 'ms' ? 'Analisis:' : 'Analysis:'}</strong> ${rec.analysis}
                </div>
                <div class="implementation">
                    <strong>${currentLang === 'zh' ? '实施方法：' : currentLang === 'ms' ? 'Cara Pelaksanaan:' : 'How to implement:'}</strong>
                    <p>${rec.implementation}</p>
                </div>
                <div class="potential-savings">
                    ${currentLang === 'zh' ? '潜在节省：' : currentLang === 'ms' ? 'Potensi Penjimatan:' : 'Potential Savings:'} ${rec.potentialSavings}
                </div>
            </div>
        `).join('');

        if (dashboardContainer) {
            dashboardContainer.innerHTML = recommendationHTML;
        }
        if (recommendationsContainer) {
            recommendationsContainer.innerHTML = recommendationHTML;
        }
    }

    generateRecommendations() {
        const recentData = this.energyData.data.slice(-7);
        const recommendations = { zh: [], en: [], ms: [] };
        
        const avgUsage = recentData.reduce((sum, day) => sum + day.usage, 0) / recentData.length;
        
        const acUsage = recentData.reduce((sum, day) => sum + day.appliances['Air Conditioning'], 0) / recentData.length;
        const acPercentage = (acUsage / avgUsage) * 100;
        
        if (acPercentage > 40) {
            recommendations.en.push({
                title: "Optimize AC Usage",
                description: `Your AC usage is ${acPercentage.toFixed(0)}% of total consumption. Consider optimizing settings.`,
                analysis: "High energy consumption from air conditioning",
                implementation: "1. Set temperature to 25°C\n2. Use fans with AC\n3. Clean filters monthly",
                potentialSavings: `${(acUsage * 0.2).toFixed(1)} kWh/month`,
                priority: "high"
            });
            recommendations.zh.push({
                title: "优化空调使用",
                description: `空调用电占总用电量的${acPercentage.toFixed(0)}%，建议优化使用方式。`,
                analysis: "空���用电量占比过高",
                implementation: "1. 将温度设置为25°C\n2. 搭配风扇使用\n3. 定期清洁过滤网",
                potentialSavings: `每月${(acUsage * 0.2).toFixed(1)}千瓦时`,
                priority: "high"
            });
        }
        
        const nightUsage = recentData.reduce((sum, day) => {
            const nightHours = day.peakHours.morning * 0.5;
            return sum + nightHours;
        }, 0) / recentData.length;
        
        if (nightUsage > avgUsage * 0.15) {
            recommendations.en.push({
                title: "Reduce Standby Power",
                description: `${(nightUsage/avgUsage*100).toFixed(0)}% power consumed during inactive hours.`,
                analysis: "Significant standby power detected",
                implementation: "1. Use smart power strips\n2. Unplug unused devices\n3. Enable power saving modes",
                potentialSavings: `${(nightUsage * 0.5).toFixed(1)} kWh/month`,
                priority: "medium"
            });
            recommendations.zh.push({
                title: "减少待机耗电",
                description: `非活动时段消耗了${(nightUsage/avgUsage*100).toFixed(0)}%的电量。`,
                analysis: "待机功耗明显",
                implementation: "1. 使用智能��座\n2. 拔掉未使用设备\n3. 启用节能模式",
                potentialSavings: `每月${(nightUsage * 0.5).toFixed(1)}千瓦时`,
                priority: "medium"
            });
        }
        
        const lightingUsage = recentData.reduce((sum, day) => sum + day.appliances['Lighting'], 0) / recentData.length;
        if (lightingUsage > avgUsage * 0.2) {
            recommendations.en.push({
                title: "Lighting Optimization",
                description: "High lighting energy consumption detected.",
                analysis: "Traditional bulbs may be in use",
                implementation: "1. Switch to LED bulbs\n2. Install motion sensors\n3. Maximize natural light",
                potentialSavings: `${(lightingUsage * 0.6).toFixed(1)} kWh/month`,
                priority: "medium"
            });
            recommendations.zh.push({
                title: "照明系统优化",
                description: "检测到照明用电量偏高。",
                analysis: "可能使用传统灯泡",
                implementation: "1. 更换为LED灯泡\n2. 安装动作感应器\n3. 充分利用自然光",
                potentialSavings: `每月${(lightingUsage * 0.6).toFixed(1)}千瓦时`,
                priority: "medium"
            });
        }
        
        if (recommendations.en.length === 0) {
            recommendations.en.push({
                title: "Maintain Good Practices",
                description: "Your energy usage patterns are good. Keep it up!",
                analysis: "Energy consumption is within normal range",
                implementation: "1. Continue monitoring usage\n2. Consider smart home upgrades\n3. Share tips with community",
                potentialSavings: "2-3 kWh/month",
                priority: "low"
            });
            recommendations.zh.push({
                title: "保持良好习惯",
                description: "您的用电模式良好，请继续保持！",
                analysis: "用电量在正常范围内",
                implementation: "1. 继续监控用电\n2. 考虑智能家居升级\n3. 与社区分享节能经验",
                potentialSavings: "每月2-3千瓦时",
                priority: "low"
            });
        }
        
        return recommendations;
    }

    updateDashboard() {
        try {
            const statsElements = document.querySelectorAll('.stat-value');
            if (statsElements.length >= 2) {
                statsElements[0].textContent = Math.round(this.energyData.totalUsage);
                statsElements[1].textContent = `RM ${Math.round(this.energyData.totalCost)}`;
            }
            console.log('Dashboard updated with new data');
        } catch (error) {
            console.error('Error updating dashboard:', error);
        }
    }

    startRealTimeUpdates() {
        try {
            const baseUsage = this.energyData.averageUsage / 24;
            setInterval(() => {
                const usage = (baseUsage + (Math.random() - 0.5)).toFixed(1);
                const usageElement = document.getElementById('currentUsage');
                const gaugeElement = document.getElementById('usageGauge');
                
                if (usageElement) {
                    usageElement.textContent = usage;
                }
                
                if (gaugeElement) {
                    const percent = (usage / (baseUsage * 2) * 100).toFixed(0);
                    gaugeElement.style.setProperty('--usage-percent', `${percent}%`);
                }
            }, 3000);
        } catch (error) {
            console.error('Error updating real-time data:', error);
        }
    }

    calculateDailyPattern() {
        const hourlyData = Array(8).fill(0);
        const recentData = this.energyData.data.slice(-7);
        
        recentData.forEach(day => {
            hourlyData[0] += day.peakHours.morning / 7;
            hourlyData[1] += (day.peakHours.morning * 0.8) / 7;
            hourlyData[2] += (day.peakHours.morning * 0.6) / 7;
            hourlyData[3] += day.peakHours.afternoon / 7;
            hourlyData[4] += (day.peakHours.afternoon * 1.2) / 7;
            hourlyData[5] += day.peakHours.evening / 7;
            hourlyData[6] += (day.peakHours.evening * 1.1) / 7;
            hourlyData[7] += (day.peakHours.evening * 0.7) / 7;
        });

        return hourlyData.map(value => +value.toFixed(2));
    }

    calculateMonthlyComparison() {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        console.log('Starting monthly comparison calculation');
        
        if (!this.energyData || !this.energyData.data) {
            console.warn('No energy data available for monthly comparison');
            return { labels: months.slice(0, 6), data: new Array(6).fill(0) };
        }

        const dates = this.energyData.data.map(day => new Date(day.date));
        const latestDate = new Date(Math.max.apply(null, dates));
        console.log('Latest date in data:', latestDate);

        const monthlyUsage = {};
        this.energyData.data.forEach(day => {
            const date = new Date(day.date);
            const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
            if (!monthlyUsage[monthKey]) {
                monthlyUsage[monthKey] = {
                    total: 0,
                    count: 0
                };
            }
            monthlyUsage[monthKey].total += day.usage;
            monthlyUsage[monthKey].count++;
        });

        const sortedMonths = Object.keys(monthlyUsage)
            .sort()
            .slice(-6);

        const monthlyAverages = [];
        const monthLabels = [];

        sortedMonths.forEach(monthKey => {
            const [year, month] = monthKey.split('-');
            const data = monthlyUsage[monthKey];
            const average = +(data.total / data.count * 30).toFixed(1);
            monthlyAverages.push(average);
            monthLabels.push(months[parseInt(month)]);
        });

        console.log('Monthly data processed:', {
            monthlyAverages,
            monthLabels
        });

        if (monthlyAverages.length === 0) {
            return { labels: months.slice(0, 6), data: new Array(6).fill(0) };
        }
        
        return {
            labels: monthLabels,
            data: monthlyAverages
        };
    }

    calculateApplianceBreakdown() {
        const recentData = this.energyData.data.slice(-30);
        const breakdown = {};
        
        recentData.forEach(day => {
            Object.entries(day.appliances).forEach(([appliance, usage]) => {
                breakdown[appliance] = (breakdown[appliance] || 0) + usage;
            });
        });

        const total = Object.values(breakdown).reduce((a, b) => a + b, 0);
        Object.keys(breakdown).forEach(key => {
            breakdown[key] = +((breakdown[key] / total) * 100).toFixed(1);
        });

        return breakdown;
    }
}

window.Dashboard = Dashboard; 
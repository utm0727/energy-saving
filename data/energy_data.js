const energyDatabase = {
    dailyUsage: [
        {
            date: '2024-01-01',
            usage: 12.5,
            cost: 25.0,
            peakHours: {
                morning: 4.2,
                afternoon: 3.8,
                evening: 4.5
            },
            appliances: {
                'Air Conditioning': 5.5,
                'Refrigerator': 2.0,
                'Water Heater': 1.5,
                'Lighting': 1.0,
                'Others': 2.5
            }
        }
    ],
    calculateDailyCost: function(usage) {
        return usage * 2;
    }
};

// 生成6个月的示例数据
const startDate = new Date('2023-07-01');
for (let i = 0; i < 180; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    
    // 生成随机用电量，根据月份调整基准值
    const month = date.getMonth();
    let baseUsage = 12.5;
    
    // 根据月份调整用电量基准值
    switch(month) {
        case 0: // 1月
            baseUsage = 15.0; // 冬季用电较高
            break;
        case 1: // 2月
            baseUsage = 14.0;
            break;
        case 2: // 3月
            baseUsage = 12.0;
            break;
        case 3: // 4月
            baseUsage = 11.0;
            break;
        case 4: // 5月
            baseUsage = 13.0; // 开始变热
            break;
        case 5: // 6月
            baseUsage = 14.5; // 夏季用电上升
            break;
        case 6: // 7月
            baseUsage = 15.5; // 夏季高峰
            break;
        case 7: // 8月
            baseUsage = 15.0; // 夏季持续
            break;
        case 8: // 9月
            baseUsage = 14.0; // 开始转凉
            break;
        case 9: // 10月
            baseUsage = 12.0; // 秋季
            break;
        case 10: // 11月
            baseUsage = 13.0; // 开始供暖
            break;
        case 11: // 12月
            baseUsage = 14.0; // 冬季来临
            break;
    }
    
    // 添加一些随机波动，但保持在合理范围内
    const dailyUsage = baseUsage + (Math.random() - 0.5) * 2;
    
    energyDatabase.dailyUsage.push({
        date: date.toISOString().split('T')[0],
        usage: +dailyUsage.toFixed(2),
        cost: +(dailyUsage * 2).toFixed(2),
        peakHours: {
            morning: +(dailyUsage * 0.3).toFixed(2),
            afternoon: +(dailyUsage * 0.4).toFixed(2),
            evening: +(dailyUsage * 0.3).toFixed(2)
        },
        appliances: {
            'Air Conditioning': +(dailyUsage * 0.4).toFixed(2),
            'Refrigerator': +(dailyUsage * 0.2).toFixed(2),
            'Water Heater': +(dailyUsage * 0.15).toFixed(2),
            'Lighting': +(dailyUsage * 0.1).toFixed(2),
            'Others': +(dailyUsage * 0.15).toFixed(2)
        }
    });
}

window.energyDatabase = energyDatabase; 
import energyDatabase from '../data/energy_data.js';

class AIAnalysisService {
    constructor() {
        this.db = energyDatabase;
    }

    async generateUsagePrediction() {
        try {
            const prediction = this.db.predictNextMonth();
            const analysis = this.analyzePattern(prediction);
            console.log('AI Analysis:', { prediction, analysis });
            return {
                prediction,
                analysis,
                recommendations: this.generateRecommendations(analysis)
            };
        } catch (error) {
            console.error('Error in AI analysis:', error);
            return {
                prediction: null,
                analysis: null,
                recommendations: []
            };
        }
    }

    analyzePattern(prediction) {
        const recentData = this.db.dailyUsage.slice(-30);
        const avgUsage = recentData.reduce((sum, day) => sum + day.usage, 0) / 30;
        const predictedAvg = prediction.averageUsage;

        return {
            trend: predictedAvg > avgUsage ? 'increasing' : 'decreasing',
            changePercent: +((predictedAvg - avgUsage) / avgUsage * 100).toFixed(1),
            peakDays: this.identifyPeakDays(prediction.dailyPredictions),
            impactFactors: this.analyzeImpactFactors(recentData),
            potentialSavings: this.calculatePotentialSavings(prediction)
        };
    }

    identifyPeakDays(predictions) {
        const avg = predictions.reduce((a, b) => a + b) / predictions.length;
        const threshold = avg * 1.2;
        return predictions.reduce((peaks, usage, index) => {
            if (usage > threshold) {
                peaks.push({
                    day: index + 1,
                    usage: usage,
                    percent: +((usage - avg) / avg * 100).toFixed(1)
                });
            }
            return peaks;
        }, []);
    }

    analyzeImpactFactors(data) {
        return {
            weather: {
                correlation: this.calculateCorrelation(
                    data.map(d => d.temperature),
                    data.map(d => d.usage)
                ),
                impact: 'high'
            },
            weekday: {
                correlation: this.calculateWeekdayImpact(data),
                impact: 'medium'
            },
            appliances: this.analyzeApplianceUsage(data)
        };
    }

    calculateCorrelation(x, y) {
        const n = x.length;
        const sum_x = x.reduce((a, b) => a + b);
        const sum_y = y.reduce((a, b) => a + b);
        const sum_xy = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
        const sum_xx = x.reduce((sum, xi) => sum + xi * xi, 0);
        const sum_yy = y.reduce((sum, yi) => sum + yi * yi, 0);

        return (n * sum_xy - sum_x * sum_y) / 
               Math.sqrt((n * sum_xx - sum_x * sum_x) * (n * sum_yy - sum_y * sum_y));
    }

    calculateWeekdayImpact(data) {
        const weekdayUsage = data.filter(d => ![0,6].includes(new Date(d.date).getDay()));
        const weekendUsage = data.filter(d => [0,6].includes(new Date(d.date).getDay()));
        
        const avgWeekday = weekdayUsage.reduce((sum, day) => sum + day.usage, 0) / weekdayUsage.length;
        const avgWeekend = weekendUsage.reduce((sum, day) => sum + day.usage, 0) / weekendUsage.length;
        
        return +(avgWeekend / avgWeekday).toFixed(2);
    }

    analyzeApplianceUsage(data) {
        const applianceData = {};
        const totalUsage = data.reduce((sum, day) => sum + day.usage, 0);

        Object.keys(data[0].appliances).forEach(appliance => {
            const usage = data.reduce((sum, day) => sum + day.appliances[appliance], 0);
            applianceData[appliance] = {
                percentage: +((usage / totalUsage) * 100).toFixed(1),
                trend: this.calculateApplianceTrend(data, appliance)
            };
        });

        return applianceData;
    }

    calculateApplianceTrend(data, appliance) {
        const usage = data.map(day => day.appliances[appliance]);
        const trend = this.db.calculateTrend(usage);
        return trend > 0 ? 'increasing' : 'decreasing';
    }

    calculatePotentialSavings(prediction) {
        const baselineUsage = prediction.totalUsage;
        const potentialReductions = {
            ac: 0.15, // 15% potential reduction in AC usage
            lighting: 0.20, // 20% potential reduction in lighting
            standby: 0.10 // 10% reduction in standby power
        };

        const savings = Object.entries(potentialReductions).reduce((total, [category, reduction]) => {
            return total + (baselineUsage * reduction);
        }, 0);

        return {
            kWh: +savings.toFixed(2),
            percentage: +((savings / baselineUsage) * 100).toFixed(1),
            cost: +(savings * this.db.rates.peak).toFixed(2)
        };
    }

    generateRecommendations(analysis) {
        const recommendations = [];

        // 基于趋势的建议
        if (analysis.trend === 'increasing') {
            recommendations.push({
                type: 'trend',
                title: 'Usage Trend Alert',
                description: `Your energy usage is trending upward by ${analysis.changePercent}%. Consider implementing energy-saving measures.`,
                priority: 'high',
                potentialSavings: analysis.potentialSavings.kWh
            });
        }

        // 基于高峰日的建议
        if (analysis.peakDays.length > 0) {
            recommendations.push({
                type: 'peak',
                title: 'Peak Usage Management',
                description: `You have ${analysis.peakDays.length} predicted high-usage days. Consider load shifting during these days.`,
                priority: 'medium',
                potentialSavings: analysis.potentialSavings.kWh * 0.3
            });
        }

        // 基于设备使用的建议
        const applianceRecs = this.generateApplianceRecommendations(analysis.impactFactors.appliances);
        recommendations.push(...applianceRecs);

        return recommendations;
    }

    generateApplianceRecommendations(applianceData) {
        const recommendations = [];
        
        if (applianceData.ac.percentage > 30) {
            recommendations.push({
                type: 'appliance',
                title: 'AC Optimization',
                description: 'Your AC usage is high. Consider setting temperature 1-2 degrees higher and using fans.',
                priority: 'high',
                potentialSavings: 15
            });
        }

        if (applianceData.lighting.trend === 'increasing') {
            recommendations.push({
                type: 'appliance',
                title: 'Lighting Efficiency',
                description: 'Consider switching to LED bulbs and using natural light when possible.',
                priority: 'medium',
                potentialSavings: 10
            });
        }

        return recommendations;
    }
}

window.AIAnalysisService = AIAnalysisService; 
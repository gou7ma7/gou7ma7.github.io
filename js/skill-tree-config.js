const echartsConfig = {
    title: {
        text: 'AI 时代，从零开始技能树',
        left: 'center',
        textStyle: {
            fontSize: 24,
            fontWeight: 'bold'
        }
    },
    backgroundColor: '#ffffff',
    series: [{
        type: 'tree',
        layout: 'orthogonal',
        orient: 'LR',
        initialTreeDepth: 2,
        symbolSize: function(value, params) {
            const level = params.treePathInfo?.length || 1;
            const baseSize = 80 - (level * 15);
            return Math.max(baseSize, 35);
        },
        itemStyle: {
            color: function(params) {
                const progress = parseInt(params.data.value) || 0;
                if (progress > 70) return '#91cc75';
                if (progress > 30) return '#fac858';
                return '#ee6666';
            },
            borderWidth: 2
        },
        label: {
            position: 'inside',
            rotate: 0,
            fontSize: 14,
            color: '#333',
            formatter: function(params) {
                if (params.data.invisible) return '';
                const name = params.data.name;
                const value = params.data.value;
                return `${name}\n${value ? value + '%' : ''}`;
            }
        },
        lineStyle: {
            width: 2,
            curveness: 0.1
        }
    }]
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = echartsConfig;
} else if (typeof window !== 'undefined') {
    window.echartsConfig = echartsConfig;
} 
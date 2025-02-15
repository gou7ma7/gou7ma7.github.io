const echartsConfig = {
    title: {
        text: 'AI 时代，从零开始技能树',
        left: 'center',
        textStyle: {
            fontSize: 24,        // 标题字体大小
            fontWeight: 'bold'  // 标题字体粗细
        }
    },
    backgroundColor: '#ffffff', // 图表背景颜色
    series: [{
        type: 'tree',           // 图表类型为树形图
        layout: 'orthogonal',   // 正交布局（水平/垂直）
        orient: 'LR',           // 布局方向：Left to Right
        initialTreeDepth: 2,    // 初始展开层级（2表示展开到第二层）
        
        // ================= 节点样式配置 =================
        symbolSize: function(value, params) {
            // 动态计算节点大小（根据层级）
            const level = params.treePathInfo?.length || 1; // 当前节点层级
            const baseSize = 80 - (level * 15);            // 基础尺寸随层级递减
            return Math.max(baseSize, 35);                  // 最小保持35像素
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
        
        // ================= 标签样式 =================
        label: {
            position: 'inside', // 标签位置（内部）
            rotate: 0,          // 旋转角度
            fontSize: 14,       // 字体大小
            color: '#333',      // 字体颜色
            formatter: function(params) {
                // 标签内容格式化
                if (params.data.invisible) return ''; // 隐藏根节点标签
                const name = params.data.name;
                const value = params.data.value;
                return `${name}\n${value ? value + '%' : ''}`; // 显示名称和进度
            }
        },
        
        // ================= 连接线样式 =================
        lineStyle: {
            width: 2,
            curveness: 0.7
        },
        
        // ================= 其他配置 =================
        expandAndCollapse: true, // 允许展开/折叠节点
        animationDuration: 550, // 展开/折叠动画时长（毫秒）
        roam: true,              // 允许平移和缩放
        // 完全禁用悬停效果
        emphasis: false
    }]
};

// 模块导出配置（Node.js环境）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = echartsConfig;
} 
// 浏览器全局变量（网页环境）
else if (typeof window !== 'undefined') {
    window.echartsConfig = echartsConfig;
} 
/**
 * 热力图主入口文件
 * 负责初始化热力图并处理相关事件
 */

// 从组件导入初始化函数
import { initHeatmap } from './heatmap-component.js';

/**
 * 页面加载完成后初始化热力图
 */
document.addEventListener('DOMContentLoaded', () => {
    // 动态加载ECharts库
    const script = document.createElement('script');
    // 使用CDN引入ECharts
    script.src = 'https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js';
    // ECharts加载完成后初始化热力图
    script.onload = () => {
        initHeatmap();
    };
    // 将脚本添加到文档头部
    document.head.appendChild(script);
});

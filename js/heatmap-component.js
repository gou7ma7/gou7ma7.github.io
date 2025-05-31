// 热力图配置常量
const HEATMAP_CONFIG = {
    containerId: 'heatmap',
    dataUrl: window.location.origin + '/js/heatmap-data.json'
};

// 枚举定义 (简化xAxis)
const AXIS_ENUMS = {
    xAxis: ['Infrastructure', 'Cloud Baidu', 'Kubernetes']
};


/**
 * 初始化热力图
 */
function initHeatmap() {
    // 确保容器存在
    const container = document.getElementById(HEATMAP_CONFIG.containerId);
    if (!container) {
        console.error('Heatmap container not found');
        return;
    }

    // 从指定URL获取热力图数据
    fetch(HEATMAP_CONFIG.dataUrl)
        .then(response => response.json())
        .then(dataList => {
            // 标记数据已加载
            window.heatmapDataLoaded = true;
            
            // 初始化ECharts实例
            const chart = echarts.init(container);
            
            // 为每组数据生成配置项
            const options = dataList.map(data => generateHeatmapOption(data));
            
            // 合并所有配置项
            const mergedOption = {
                title: {
                    text: 'Technology Capability Heatmap',
                    left: 'center'
                },
                tooltip: {
                    show: true,
                    trigger: 'item',
                    position: 'top',
                    formatter: function(params) {
                        return params.data.tooltip || params.data.name;
                    },
                    extraCssText: 'text-align:left; padding:5px;'
                },
                grid: options[0].option.grid,
                visualMap: options[0].option.visualMap,
                xAxis: {
                    type: 'category',
                    data: [...new Set(options.flatMap(opt => opt.option.xAxis.data))],
                    splitArea: { show: true }
                },
                yAxis: {
                    type: 'category',
                    data: options.map(opt => opt.option.yAxis.data[0]),
                    splitArea: { show: true }
                },
                series: options.map(opt => opt.option.series[0])
            };
            
            // 应用配置项渲染热力图
            chart.setOption(mergedOption);
            
            // 触发渲染完成事件
            const event = new Event('heatmapRendered');
            document.dispatchEvent(event);
            
            // 添加点击事件
            chart.on('click', function(params) {
                if (params.data.link) {
                    window.location.hash = params.data.link;
                }
            });
            
        })
        .catch(error => {
            console.error('Heatmap initialization failed:', error);
        });
}

/**
 * 生成热力图配置选项
 * @param {Object} data - 原始数据对象
 * @returns {Object} 包含热力图配置选项的对象
 */
function generateHeatmapOption(data) {
    // 处理数据项 (仅验证xAxis)
    const heatmapData = data.items.map(item => {
        if (!AXIS_ENUMS.xAxis.includes(item.xAxis)) {
            console.warn(`Invalid xAxis value: ${item.xAxis}. Valid values are: ${AXIS_ENUMS.xAxis.join(', ')}`);
        }
        return {
            name: item.name,
            value: [item.xAxis, data.yAxis, item.value],
            tooltip: item.tooltip
        };
    });

    // 获取所有唯一的xAxis值
    const xAxisData = [...new Set(data.items.map(item => item.xAxis))];

    // 配置ECharts选项
    const option = {
        // 标题配置
        title: {
            text: `${data.yAxis} Heatmap`, // 使用英文子标题
            left: 'center' // 标题居中
        },
        // 提示框配置
        tooltip: {
            show: true,
            trigger: 'item',
            position: 'top',
            formatter: function(params) {
                return params.data.tooltip || params.data.name;
            },
            extraCssText: 'text-align:left; padding:5px;' // 增强样式
        },
        // 网格配置
        grid: {
            left: '3%', // 左侧留白
            right: '7%', // 右侧留白
            bottom: '20%', // 增加底部留白(防止与visualMap重叠)
            containLabel: true // 包含坐标轴标签
        },
        // X轴配置
        xAxis: {
            type: 'category', // 类目轴
            data: xAxisData, // 使用所有xAxis值
            splitArea: { show: true } // 显示分割区域
        },
        // Y轴配置
        yAxis: {
            type: 'category', // 类目轴
            data: [data.yAxis], // 使用yAxis值
            splitArea: { show: true } // 显示分割区域
        },
        // 视觉映射组件配置
        visualMap: {
            min: 0, // 最小值
            max: 100, // 最大值
            text: ['Proficient', 'Beginner'], // 添加文本标签
            calculable: true, // 显示拖拽手柄
            orient: 'horizontal', // 水平方向
            left: 'center', // 水平居中
            bottom: '10%', // 底部对齐(增加间距)
            inRange: {
                // 颜色渐变范围
                color: ['#e0f3f8', '#abd9e9', '#74add1', '#4575b4', '#313695']
            }
        },
        // 系列配置
        series: [{
            name: data.yAxis, // 使用yAxis作为系列名称
            type: 'heatmap', // 热力图类型
            data: heatmapData, // 使用处理后的热力图数据
            label: { 
                show: true,
                formatter: function(params) {
                    return params.data.name; // 显示数据项名称
                }
            },
            emphasis: { // 高亮样式
                itemStyle: {
                    shadowBlur: 10, // 阴影模糊大小
                    shadowColor: 'rgba(0, 0, 0, 0.5)' // 阴影颜色
                }
            }
        }]
    };

    return { option }; // 返回配置选项
}

// 导出函数
export { initHeatmap, generateHeatmapOption };

var chartDom = document.getElementById('skillTree');
var myChart = echarts.init(chartDom);
var currentZoom = 1;

// 禁用所有滚轮交互的终极方案
myChart.getZr().on('mousewheel', e => {
    e.stop();
    e.event.preventDefault();
    e.event.stopImmediatePropagation();
    return false;
});

// 在图表渲染完成后绑定事件
myChart.on('finished', function() {
    myChart.getZr().on('mousewheel', function(event) {
        event.stop();
        event.preventDefault();
    });
});

// 缩放控制函数
function zoom(factor) {
    currentZoom *= factor;
    myChart.setOption({
        series: [{
            zoom: currentZoom
        }]
    });
}

function resetZoom() {
    currentZoom = 1;
    myChart.setOption({
        series: [{
            zoom: 1
        }]
    });
}

// 加载技能树数据
fetch('/js/skill-tree-data.json')
    .then(response => response.json())
    .then(skillTreeData => {
        const option = {
            ...echartsConfig,
            series: [{
                ...echartsConfig.series[0],
                data: [skillTreeData]
            }]
        };
        myChart.setOption(option);
    })
    .catch(error => console.error('Error loading skill tree data:', error));

window.addEventListener('resize', function() {
    myChart.resize();
});
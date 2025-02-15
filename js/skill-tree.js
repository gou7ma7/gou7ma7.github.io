var chartDom = document.getElementById('skillTree');
var myChart = echarts.init(chartDom);
var currentZoom = 1;

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
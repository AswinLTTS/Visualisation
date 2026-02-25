// Helper to create time-series charts
function createMetricChart(canvasId, label, color, yAxisLabel, yMin = null, yMax = null) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: label,
                data: [],
                borderColor: color,
                backgroundColor: color.replace('1)', '0.1)').replace(')', ', 0.1)'),
                borderWidth: 2,
                tension: 0.4,
                pointRadius: 0,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            scales: {
                x: {
                    display: true,
                    title: { display: false },
                    ticks: { display: false }, // Hide X ticks for compact view
                    grid: { color: 'rgba(255,255,255,0.05)' }
                },
                y: {
                    display: true,
                    title: { display: true, text: yAxisLabel, color: '#aaa', font: { size: 10 } },
                    ticks: { color: '#aaa', font: { size: 10 } },
                    grid: { color: 'rgba(255,255,255,0.1)' },
                    min: yMin,
                    max: yMax
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    });
}

function updateChartData(chart, data, currentTime, timeWindow = 60) {
    // Find relevant data up to currentTime
    // Optimization: Don't rebuild array every frame. 
    // Maintain a "cursor" index if possible, or binary search.
    // For sim simplicity, we filter last window.

    // Simple approach: show window [currentTime - timeWindow, currentTime]
    // Filter data efficiently

    const visibleData = [];
    const visibleLabels = [];

    // Find index close to currentTime
    // Assuming data is sorted by time
    // We scan backward from last know index or simple loop
    // Given 6000 points, simple loop is okay-ish, but let's be smarter if needed.

    // We actually want a scrolling chart OF THE simulation.
    // So we just push data as SimTime advances?
    // Cesium allows scrubbing. So chart should reflect [T-Window, T].

    // Let's grab range
    const startT = Math.max(0, currentTime - timeWindow);
    const endT = currentTime;

    // We search the full dataset for points in range
    // NOTE: This might be slow for 20k points every frame.
    // Better: Just show the whole history up to T, but limit X axis?
    // Let's try sampling or just simple filtering.

    const relevant = data.filter(d => d.time >= startT && d.time <= endT);

    chart.data.labels = relevant.map(d => d.time.toFixed(1));
    chart.data.datasets[0].data = relevant.map(d => d.value);

    chart.update('none');
}

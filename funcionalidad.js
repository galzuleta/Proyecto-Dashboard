// Datos anuales desde 2001 hasta 2024 basados en tendencias históricas
const annualData = {
    years: [2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 
            2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 
            2021, 2022, 2023, 2024],
    windows: [96, 95.5, 95.0, 94, 94.0, 93.0, 91.5, 89.5, 94.82, 93.4, 
              91.49, 89.98, 90.67, 88.98, 86.92, 83.77, 83.75, 80.39, 
              77.83, 76.78, 74.74, 75.43, 68.84, 72.87],
    linux: [0.01, 0.08, 0.1, 0.12, 0.14, 0.16, 0.2, 0.5, 0.68, 0.77, 
            0.79, 0.86, 1.10, 1.33, 1.62, 1.50, 1.64, 1.60, 
            1.68, 1.76, 2.21, 2.56, 3.05, 4.12],
    macos: [2.5, 2.7, 3, 3.1, 3.3, 3.8, 4, 4.2, 4.50, 6.19, 
            7.72, 9.16, 8.23, 9.69, 11.46, 14.73, 14.61, 18.01, 
            20.49, 21.46, 23.05, 22.01, 28.11, 23.01]
};

// Colores para los sistemas operativos
const colors = {
    windows: 'rgba(74, 144, 226, 1)',   
    linux: 'rgba(243, 156, 18, 1)',    
    macos: 'rgba(127, 140, 141, 1)'    
};


// Variables globales
let osChart;

// Inicializar gráfico
function initChart() {
    const ctx = document.getElementById('osChart').getContext('2d');
    
    // Datasets iniciales
    const datasets = [
    {
        label: 'Windows',
        data: annualData.windows,
        borderColor: colors.windows,
        backgroundColor: colors.windows.replace('1)', '0.1)'),
        borderWidth: 3,
        tension: 0.6,                     // más curvas
        cubicInterpolationMode: 'monotone', // curva suave estilo ECG
        fill: false
    },
    {
        label: 'Linux',
        data: annualData.linux,
        borderColor: colors.linux,
        backgroundColor: colors.linux.replace('1)', '0.1)'),
        borderWidth: 3,
        tension: 0.6,
        cubicInterpolationMode: 'monotone',
        fill: false
    },
    {
        label: 'macOS',
        data: annualData.macos,
        borderColor: colors.macos,
        backgroundColor: colors.macos.replace('1)', '0.1)'),
        borderWidth: 3,
        tension: 0.6,
        cubicInterpolationMode: 'monotone',
        fill: false
    }
];
    
    osChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: annualData.years,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Evolución Anual del Porcentaje de Usuarios por Sistema Operativo',
                    font: {
                        size: 16
                    }
                },
                legend: {
                    position: 'top',
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.parsed.y.toFixed(2)}%`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 0,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Porcentaje de Usuarios (%)'
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Año'
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'nearest'
            }
        }
    });
    
    updateStats();
}

// Actualizar gráfico según selecciones
function updateChart() {
    const windowsChecked = document.getElementById('windows').checked;
    const linuxChecked = document.getElementById('linux').checked;
    const macosChecked = document.getElementById('macos').checked;
    const chartType = document.getElementById('chartType').value;
    const timeRange = document.getElementById('timeRange').value;
    
    // Actualizar tipo de gráfico
    osChart.config.type = chartType;
    
    // Actualizar visibilidad de datasets
    osChart.data.datasets[0].hidden = !windowsChecked;
    osChart.data.datasets[1].hidden = !linuxChecked;
    osChart.data.datasets[2].hidden = !macosChecked;
    
    // Actualizar rango de tiempo
    let startIndex = 0;
    if (timeRange !== 'all') {
        startIndex = Math.max(0, annualData.years.length - parseInt(timeRange));
    }
    
    // Aplicar filtro de rango de tiempo
    osChart.data.labels = annualData.years.slice(startIndex);
    osChart.data.datasets[0].data = annualData.windows.slice(startIndex);
    osChart.data.datasets[1].data = annualData.linux.slice(startIndex);
    osChart.data.datasets[2].data = annualData.macos.slice(startIndex);
    
    // Actualizar gráfico
    osChart.update();
    
    updateStats();
}

// Actualizar estadísticas en las tarjetas
function updateStats() {
    const lastIndex = annualData.years.length - 1;   // Índice del año más reciente (2024)
    const prevIndex = lastIndex - 1;                // Índice del año anterior (2023)
    
    // Función auxiliar para calcular cambio
    const calcChange = (current, prev) => {
        const change = current - prev;
        return {
            value: current.toFixed(2) + '%',
            change: (change >= 0 ? '+' : '') + change.toFixed(2) + '%',
            className: change >= 0 ? 'positive' : 'negative'
        };
    };

    // Windows
    const win = calcChange(annualData.windows[lastIndex], annualData.windows[prevIndex]);
    document.getElementById('windows-stat').textContent = win.value;
    document.getElementById('windows-change').textContent = win.change;
    document.getElementById('windows-change').className = `stat-change ${win.className}`;

    // Linux
    const lin = calcChange(annualData.linux[lastIndex], annualData.linux[prevIndex]);
    document.getElementById('linux-stat').textContent = lin.value;
    document.getElementById('linux-change').textContent = lin.change;
    document.getElementById('linux-change').className = `stat-change ${lin.className}`;

    // macOS
    const mac = calcChange(annualData.macos[lastIndex], annualData.macos[prevIndex]);
    document.getElementById('macos-stat').textContent = mac.value;
    document.getElementById('macos-change').textContent = mac.change;
    document.getElementById('macos-change').className = `stat-change ${mac.className}`;
}

// Llenar tabla con datos
function populateTable() {
    const tableBody = document.querySelector('#dataTable tbody');
    tableBody.innerHTML = '';
    
    for (let i = 0; i < annualData.years.length; i++) {
        const row = document.createElement('tr');
        
        const yearCell = document.createElement('td');
        yearCell.textContent = annualData.years[i];
        row.appendChild(yearCell);
        
        const windowsCell = document.createElement('td');
        windowsCell.textContent = annualData.windows[i].toFixed(2);
        row.appendChild(windowsCell);
        
        const linuxCell = document.createElement('td');
        linuxCell.textContent = annualData.linux[i].toFixed(2);
        row.appendChild(linuxCell);
        
        const macosCell = document.createElement('td');
        macosCell.textContent = annualData.macos[i].toFixed(2);
        row.appendChild(macosCell);
        
        tableBody.appendChild(row);
    }
}

// Inicializar dashboard
document.addEventListener('DOMContentLoaded', function() {
    initChart();
    populateTable();
    
    // Agregar event listeners a los controles
    document.getElementById('windows').addEventListener('change', updateChart);
    document.getElementById('linux').addEventListener('change', updateChart);
    document.getElementById('macos').addEventListener('change', updateChart);
    document.getElementById('chartType').addEventListener('change', updateChart);
    document.getElementById('timeRange').addEventListener('change', updateChart);
});
import { Chart as ChartJS } from 'chart.js/auto';
import { Line } from 'react-chartjs-2';

export default function WeatherChart({labels, dayTemps, nightTemps}) {
    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Daytime high',
                backgroundColor: '#fee953',
                borderColor: '#fee953',
                data: dayTemps
            },
            {
                label: 'Nighttime low',
                backgroundColor: '#3775b7',
                borderColor: '#3775b7',
                data: nightTemps
            }
        ]
    };

    const options = {
        layout: {
            padding: 25
        },
        plugins: {
            title: {
                display: true,
                text: ['14 Day Trend', 'Here is your temperature trend for the next 14 Days.'],
                align: 'start',
                padding: '20',
                font: {
                    size: 18
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    callback: function(value, index, values) {
                        const label = labels[index].split(' ');
                        return label;
                    }
                }
            },
            y: {
                suggestMin: 2 * Math.round((Math.min(...nightTemps)-3) / 2),
                suggestMax: 2 * Math.round((Math.max(...dayTemps)+3) / 2),
                ticks: {
                    callback: function(value, index, ticks) {
                        return value + '°C`';
                    }
                }
            }
        }
    }

    return (
        <div className='chart-container'>
            <Line data={data} options={options} />
        </div>
    )
}
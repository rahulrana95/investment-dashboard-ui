import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { format, parseISO } from 'date-fns';
import { config } from '../../config';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

function convertValue(value: string) {
    if (typeof value !== 'string') {
        throw new Error('Input value must be a string');
    }

    if (value.includes('Crore')) {
        return parseFloat(value.split(' ')[0]);
    } else if (value.includes('Lakh')) {
        const lakhsValue = parseFloat(value.split(' ')[0]);
        const croresValue = lakhsValue / 100;
        return croresValue
    } else {
        throw new Error('Invalid input value format. Must include "crores" or "lakhs".');
    }
}

interface ChartData {
    date: string;
    totalreturns: number;
    totalvalue: number;
    totalreturnpercentage: number;
    id: string
}

const PercentageView = () => {
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${config.baseURL}/api/v1/getTotalInvestments`, {
            method: 'GET',
            credentials: 'include', // Ensure this is included
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => response.json())
            .then(data => {
                setChartData(data.totalInvestments.map((item: any) => {
                    return {
                        date: item.date,
                        totalreturns: (item.totalreturns),
                        totalvalue: (item.totalvalue),
                        totalreturnpercentage: item.totalreturnpercentage,
                        id: item.id
                    };
                }));
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    }, []);

    const data = {
        labels: chartData.map(item => format(item.date, 'dd/MMM/yyyy')), //Use parseISO to parse ISO formatted dates


        datasets: [
            {
                label: 'Net percentage',
                data: chartData.map(item => item.totalreturnpercentage),
                backgroundColor: 'rgba(75,192,192,0.2)',
                borderColor: 'rgba(75,192,192,1)',
                fill: true, // This property fills the area under the line
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Networth over time  (In crores)',
            },
            tooltip: {
                callbacks: {
                    label: (context: any) => {
                        const index = context.dataIndex;
                        const dataItem = chartData[index];
                        return [
                            `Total Amount: ${dataItem.totalvalue} Crores`,
                            `Net PL Amount: ${Math.round((dataItem.totalreturns + Number.EPSILON) * 100) / 100} Crores`,
                            `Net PL Percentage: ${dataItem.totalreturnpercentage}`,
                        ];
                    }
                }
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Date'
                },
                ticks: {
                    //   callback: function(value: any, index: any, values: any) {
                    //     console.log(arguments)
                    //     return values[index].label;
                    //   },
                    maxRotation: 45,
                    minRotation: 45,
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Net percentage'
                }
            }
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <Line data={data} options={options} />
        </div>
    );
};

export default PercentageView;

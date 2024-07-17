import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { format, parseISO } from 'date-fns';

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

interface InvestmentData {
    date: Date;
    value: number;
}

function calculateInvestmentOver25Years(startDate: Date, initialValue: number, annualRate: number, monthlyContribution: number): InvestmentData[] {
    const data: InvestmentData[] = [];
    const monthlyRate = annualRate / 12 / 100;
    const daysIn15Days = 15;
    const totalDays = 25 * 365; // Approximately, not accounting for leap years
    
    let currentValue = initialValue;
    let currentDate = new Date(startDate);

    for (let day = 0; day <= totalDays; day += daysIn15Days) {
        // Update date
        currentDate.setDate(currentDate.getDate() + daysIn15Days);
        
        // Add monthly contribution at the start of each month
        if (currentDate.getDate() === 1) {
            currentValue += monthlyContribution;
        }

        // Apply compound interest
        currentValue *= Math.pow(1 + monthlyRate, daysIn15Days / 30);

        // Store the result for each 15-day period
        data.push({
            date: new Date(currentDate),
            value: currentValue
        });
    }

    return data;
}

// Usage example
const startDate = new Date('2024-07-01');
const initialValue = 1.10e7; // 1.10 crore in lakhs
const annualRate = 25; // 25%
const monthlyContribution = 2e5; // 2 lakhs

const investmentData = calculateInvestmentOver25Years(startDate, initialValue, annualRate, monthlyContribution);


const croreBase = 10000000;

const PredictionView = () => {
  const [chartData, setChartData] = useState<InvestmentData[]>(investmentData);
  const [loading, setLoading] = useState(false);


  const data = {
    labels: chartData.map(item => format(item.date, 'dd/MMM/yyyy')), //Use parseISO to parse ISO formatted dates


    datasets: [
      {
        label: 'Net value',
        data: chartData.map(item => item.value/croreBase),
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
        text: 'Predicted Networth over time  (In crores)',
      },
      tooltip: {
        callbacks: {
          label: (context:any) => {
            const index = context.dataIndex;
            const dataItem = chartData[index];
            return [
              `Total Amount: ${dataItem.value/croreBase} Crores`,
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
          text: 'Net value'
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

export default PredictionView;

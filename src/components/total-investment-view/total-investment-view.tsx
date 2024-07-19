import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { format, parseISO } from 'date-fns';
import './total-investment-view.css';
import { Box, Typography, useTheme, Grid } from '@mui/material';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
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

const PredictedActualComparison = ({ predictedValue, actualValue }: { predictedValue: number, actualValue: number }) => {
  const theme = useTheme();
  const croreBase = 10000000; // Base value for crores

  const predictedValueInCrores = parseFloat(((predictedValue || 0) / croreBase).toFixed(3));
  const actualValueInCrores = parseFloat(actualValue?.toFixed(3));

  const isActualGreater = actualValueInCrores > predictedValueInCrores;

  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: theme.palette.divider,
        borderRadius: 2,
        padding: 2,
        backgroundColor: theme.palette.background.paper,
        marginBottom: 2,
      }}
    >
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={8}>
          <Typography variant="body1">
            Predicted value as of today is{' '}
            <span style={{ fontWeight: 'bold' }}>{predictedValueInCrores} Crores</span>
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: isActualGreater ? theme.palette.success.main : theme.palette.error.main, fontWeight: 'bold' }}
          >
            While Actual value is{' '}
            <span style={{ fontWeight: 'bold' }}>{actualValueInCrores} Crores</span>
          </Typography>
        </Grid>
        <Grid item xs={4} container direction="column" alignItems="center">
          {!isActualGreater ? (
            <>
              <ArrowDropDownIcon color="error" />
              <Typography variant="body2" color="error">
                -{((1 - actualValueInCrores / predictedValueInCrores) * 100).toFixed(2)}%
              </Typography>
            </>
          ) : (
            <>
              <ArrowDropUpIcon color="success" />
              <Typography variant="body2" color="success">
                +{((1 - predictedValueInCrores / actualValueInCrores) * 100).toFixed(2)}%
              </Typography>
            </>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

interface InvestmentData {
  date: Date;
  value: number;
}

function calculateInvestmentOver25Years(startDate: Date, initialValue: number, annualRate: number, monthlyContribution: number): InvestmentData[] {
  const data: InvestmentData[] = [];
  const monthlyRate = annualRate / 12 / 100;
  const daysIn15Days = 1;
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

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

interface ChartData {
  date: string;
  totalreturns: number;
  totalvalue: number;
  totalreturnpercentage: number;
  id: string
}

function getTodayValue() {
  const today = new Date();
  const formattedToday = formatDate(today); // Format today's date to match the date format in investmentData

  const todayData = investmentData.find(data => formatDate(data.date) === formattedToday);

  return todayData || null; // Return null if no data for today is found
}

const Chart = () => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [externalData, setExternalData] = useState<InvestmentData[]>(investmentData);

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
        label: 'Total Amount',
        data: chartData.map(item => item.totalvalue),
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
        fill: true, // This property fills the area under the line
      }
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
        text: 'Networth over time',
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const index = context.dataIndex;
            const datasetLabel = context.dataset.label;
            console.log(datasetLabel)
            if (datasetLabel === 'Total Amount') {
              const dataItem = chartData[index];

              return [
                `Total Amount: ${dataItem.totalvalue} Crores`,
                `Net PL Amount: ${Math.round((dataItem.totalreturns + Number.EPSILON) * 100) / 100} Crores`,
                `Net PL Percentage: ${dataItem.totalreturnpercentage}`,
              ];
            } else {
              const dataItem = externalData[index];
              return [
                `Total Amount: ${dataItem.value} Crores`,
              ];
            }
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
          text: 'Total Amount (In crores)'
        }
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  console.log(data.datasets)
  return (
    <div>
      <PredictedActualComparison predictedValue={getTodayValue()?.value || 0} actualValue={data.datasets[0].data[data.datasets[0].data.length - 1]} />
      <Line data={data} options={options} />
    </div>
  );
};

export default Chart;

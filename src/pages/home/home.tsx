import Chart from '../../components/total-investment-view/total-investment-view';
import React, { useState } from 'react';
import { Box, Button, Grid, MenuItem, Select, TextField, Typography } from '@mui/material';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import { format } from 'date-fns';
import PercentageView from '../../components/total-investment-view/percentage-view';
import PredictionView from '../../components/total-investment-view/prediction';

  const getStartDate = (amount: number, unit: 'day' | 'week' | 'month' | 'year'): Date => {
    const today = new Date();
    const pastDate = new Date(today);
    switch (unit) {
      case 'day':
        pastDate.setDate(today.getDate() + amount);
        break;
      case 'week':
        pastDate.setDate(today.getDate() + amount * 7);
        break;
      case 'month':
        pastDate.setMonth(today.getMonth() + amount);
        break;
      case 'year':
        pastDate.setFullYear(today.getFullYear() + amount);
        break;
      default:
        break;
    }
    return pastDate;
  };

const DateRangePicker = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [presetOption, setPresetOption] = useState<string>('last1Month');

  const presetOptions = [
    { key: 'last1Month', label: 'Last 1 Month', startDate: getStartDate(-1, 'month'), endDate: new Date() },
    { key: 'last3Months', label: 'Last 3 Months', startDate: getStartDate(-3, 'month'), endDate: new Date() },
    { key: 'last6Months', label: 'Last 6 Months', startDate: getStartDate(-6, 'month'), endDate: new Date() },
    { key: 'last1Year', label: 'Last 1 Year', startDate: getStartDate(-1, 'year'), endDate: new Date() },
    { key: 'last2Years', label: 'Last 2 Years', startDate: getStartDate(-2, 'year'), endDate: new Date() },
    { key: 'last3Years', label: 'Last 3 Years', startDate: getStartDate(-3, 'year'), endDate: new Date() },
    { key: 'last5Years', label: 'Last 5 Years', startDate: getStartDate(-5, 'year'), endDate: new Date() },
    { key: 'last10Years', label: 'Last 10 Years', startDate: getStartDate(-10, 'year'), endDate: new Date() },
  ];

  const handlePresetOptionChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const optionKey = event.target.value as string;
    setPresetOption(optionKey);
    const selectedPreset = presetOptions.find(option => option.key === optionKey);
    if (selectedPreset) {
      setStartDate(selectedPreset.startDate);
      setEndDate(selectedPreset.endDate);
    }
  };

  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date);
  };



  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={3}>
          <Select
            value={presetOption}
            // @ts-ignore
            onChange={handlePresetOptionChange}
            fullWidth
            size="small"
            variant="outlined"
          >
            {presetOptions.map(option => (
              <MenuItem key={option.key} value={option.key}>{option.label}</MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={3}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DesktopDatePicker
              label="Start Date"
              value={startDate}
              onChange={handleStartDateChange}
              renderInput={(params: any) => <TextField {...params} />}
              minDate={null}
              maxDate={endDate || undefined}
              size="small"
              variant="outlined"
              fullWidth
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={3}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DesktopDatePicker
              label="End Date"
              value={endDate}
              onChange={handleEndDateChange}
              renderInput={(params: any) => <TextField {...params} />}
              minDate={startDate || null}
              size="small"
              variant="outlined"
              fullWidth
            />
          </LocalizationProvider>
        </Grid>
      </Grid>
    </Box>
  );
};



const Home = () => {
  return (
    <div>
        <DateRangePicker/>
      <Chart/>
      <PercentageView/>
      <PredictionView/>
    </div>
  );
};

export default Home;

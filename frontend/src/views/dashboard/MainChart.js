import React, { useEffect, useRef, useState } from 'react'
import { CChartBar } from '@coreui/react-chartjs'
import { getStyle } from '@coreui/utils'

const MainChart = () => {
  const chartRef = useRef(null)
  const [chartData, setChartData] = useState({
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    datasets: [],
  })

  // Random data generator for payroll and overtime values
  const randomPayroll = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
  const randomOvertime = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

  useEffect(() => {
    const fetchPayrollData = () => {
      const payrollData = Array.from({ length: 12 }, () => randomPayroll(5000, 20000))
      const overtimeData = Array.from({ length: 12 }, () => randomOvertime(1000, 5000)) // Random overtime data

      setChartData({
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        datasets: [
          {
            label: 'Total Payroll',
            backgroundColor: 'rgba(27, 121, 221, 0.6)', // Light blue color
            borderColor: 'rgb(27, 121, 221)',
            borderWidth: 2,
            data: payrollData,
            barThickness: 35,
          },
          {
            label: 'Total Overtime',
            backgroundColor: 'rgba(128, 0, 128, 0.6)', // Purple color
            borderColor: 'rgb(128, 0, 128)',
            borderWidth: 2,
            data: overtimeData,
            barThickness: 35, // Same bar thickness for consistency
          },
        ],
      })
    }

    fetchPayrollData()
  }, [])

  return (
    <CChartBar
      ref={chartRef}
      style={{ height: '300px', marginTop: '40px' }}
      data={chartData}
      options={{
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,  // Show legend
          },
        },
        scales: {
          x: {
            grid: {
              color: getStyle('--cui-border-color-translucent'),
              drawOnChartArea: false,
            },
            ticks: {
              color: getStyle('--cui-body-color'),
            },
          },
          y: {
            beginAtZero: true,
            border: {
              color: getStyle('--cui-border-color-translucent'),
            },
            grid: {
              color: getStyle('--cui-border-color-translucent'),
            },
            max: 25000,  // Adjust max for payroll range
            ticks: {
              color: getStyle('--cui-body-color'),
              maxTicksLimit: 5,
              stepSize: 5000,  // Step size for payroll increments
            },
          },
        },
        elements: {
          bar: {
            borderRadius: 4,  // Add rounded corners to bars
            borderWidth: 2,
          },
        },
      }}
    />
  )
}

export default MainChart

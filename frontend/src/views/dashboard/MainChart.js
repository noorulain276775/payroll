import React, { useEffect, useRef, useState } from 'react'
import { CChartBar } from '@coreui/react-chartjs'
import { getStyle } from '@coreui/utils'

const MainChart = ({ monthlyData }) => {
  const chartRef = useRef(null)
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  })

  useEffect(() => {
    const prepareChartData = () => {
      const currentDate = new Date()
      const currentYear = currentDate.getFullYear()
      const currentMonth = currentDate.getMonth() + 1 // JavaScript months are 0-indexed

      // Generate the latest 12 months (month and year combinations)
      const monthsAndYears = []
      for (let i = 0; i < 12; i++) {
        const date = new Date(currentYear, currentMonth - 1 - i, 1)
        monthsAndYears.unshift({
          month: date.getMonth() + 1,
          year: date.getFullYear(),
        })
      }

      // Map data to the latest 12 months
      const salaryData = monthsAndYears.map(({ month, year }) => {
        const matchingData = monthlyData.find((data) => data.month === month && data.year === year)
        return matchingData ? matchingData.total_salary : 0.1 // Use a small value (0.1) for empty months
      })

      // Generate colors for bars
      const colors = monthsAndYears.map(({ year }) =>
        year === currentYear ? 'rgba(128, 0, 128, 0.6)' : 'rgba(173, 216, 230, 0.6)' // Purple for current year, Light blue for previous year
      )

      setChartData({
        labels: monthsAndYears.map(({ month, year }) =>
          `${new Date(2020, month - 1).toLocaleString('default', { month: 'short' })} (${year})`
        ), // Display month names with year (e.g., "Jan (2025)")
        datasets: [
          {
            label: 'Total Salary',
            backgroundColor: colors,
            borderColor: colors.map((color) => color.replace('0.6', '1')), // Make border color match but fully opaque
            borderWidth: 2,
            data: salaryData,
            barThickness: 35,
          },
        ],
      })
    }

    prepareChartData()
  }, [monthlyData])

  return (
    <>
      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        <span style={{ display: 'inline-block', marginRight: '15px' }}>
          <span
            style={{
              display: 'inline-block',
              width: '12px',
              height: '12px',
              backgroundColor: 'rgba(128, 0, 128, 0.6)',
              borderRadius: '50%',
              marginRight: '5px',
            }}
          ></span>
          Current Year
        </span>
        <span style={{ display: 'inline-block' }}>
          <span
            style={{
              display: 'inline-block',
              width: '12px',
              height: '12px',
              backgroundColor: 'rgba(173, 216, 230, 0.6)',
              borderRadius: '50%',
              marginRight: '5px',
            }}
          ></span>
          Previous Year
        </span>
      </div>
      <CChartBar
        ref={chartRef}
        style={{ height: '300px', marginTop: '40px' }}
        data={chartData}
        options={{
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false, // Hide default legend
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
              grid: {
                color: getStyle('--cui-border-color-translucent'),
              },
              ticks: {
                color: getStyle('--cui-body-color'),
                maxTicksLimit: 5,
                stepSize: 5000, // Step size for payroll increments
              },
            },
          },
          elements: {
            bar: {
              borderRadius: 4, // Add rounded corners to bars
              borderWidth: 2,
            },
          },
        }}
      />
    </>
  )
}

export default MainChart

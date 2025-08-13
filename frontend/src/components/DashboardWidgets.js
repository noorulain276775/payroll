import React from 'react'
import { CChartLine } from '@coreui/react-chartjs'
import { CCol, CRow, CWidgetStatsA } from '@coreui/react'

// Constants
const DEFAULT_VALUE = 'N/A';
const DECIMAL_PLACES = 0;

const formatValue = (value) => {
  // If value is null, undefined, or NaN, return 'N/A'
  if (value == null || isNaN(value)) {
    return DEFAULT_VALUE;
  }
  // Otherwise, return the value formatted to specified decimal places
  return parseFloat(value).toFixed(DECIMAL_PLACES);
}

export const DashboardWidgets = ({
  totalSalaryForMonth,
  totalOvertimeForMonth,
  previousMonthSalary,
  previousMonthOvertime,
  totalEmployees,
  averageSalaryForMonth
}) => {
  return (
    <CRow>
      {/* Total Employees Widget */}
      <CCol sm={3}>
        <CWidgetStatsA
          className="mb-4"
          color="primary"
          value={<>{formatValue(totalEmployees)}</>}
          title="Total Employees"
          chart={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 100 50"
              style={{ width: '100%', height: '100%' }}
            >
              <path
                d="M0,40 C20,10, 40,10, 60,30 C80,50, 100,30, 120,40"
                fill="transparent"
                stroke="rgba(9, 32, 58, 0.8)"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M0,30 C20,50, 40,40, 60,20 C80,0, 100,20, 120,10"
                fill="transparent"
                stroke="rgba(173, 216, 230, 0.8)"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          }
        />
      </CCol>

      {/* Previous Month Salary Widget */}
      <CCol sm={3}>
        <CWidgetStatsA
          className="mb-4"
          color="info"
          value={<>{formatValue(previousMonthSalary)}</>}
          title="Previous Month Payroll"
          chart={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 100 50"
              style={{ width: '100%', height: '100%' }}
            >
              <path
                d="M0,35 C25,10, 50,20, 75,35 C100,50, 125,30, 150,45"
                fill="transparent"
                stroke="rgba(57, 224, 216, 0.8)"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M0,45 C25,30, 50,40, 75,25 C100,10, 125,25, 150,35"
                fill="transparent"
                stroke="rgba(29, 94, 124, 0.8)"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          }
        />
      </CCol>


      {/* Current Month Salary Widget */}
      <CCol sm={3}>
        <CWidgetStatsA
          className="mb-4"
          color="warning"
          value={<>{formatValue(totalSalaryForMonth)}</>}
          title="Current Month Salary"
          chart={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 100 50"
              style={{ width: '100%', height: '100%' }}
            >
              <path
                d="M0,40 L20,20 L40,35 L60,15 L80,30 L100,10"
                fill="transparent"
                stroke="rgb(207, 135, 0)"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M0,45 L20,25 L40,40 L60,20 L80,35 L100,15"
                fill="transparent"
                stroke="rgb(255, 202, 26)"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          }
        />
      </CCol>


      {/* Average Salary Widget */}
      <CCol sm={3}>
        <CWidgetStatsA
          className="mb-4"
          color="danger"
          value={<>{formatValue(averageSalaryForMonth)}</>}
          title="Average Salary"
          chart={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 100 50"
              style={{ width: '100%', height: '100%' }}
            >
              <path
                d="M0,30 C15,10, 25,35, 40,20 C55,5, 65,35, 80,15 C90,5, 100,30, 100,40"
                fill="transparent"
                stroke="rgba(228, 137, 137, 0.8)"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M0,40 C20,25, 40,20, 60,35 C80,50, 100,25, 100,40"
                fill="transparent"
                stroke="rgba(196, 48, 48, 0.8)"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          }
        />
      </CCol>

    </CRow>
  )
}

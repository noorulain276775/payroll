import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CButtonGroup,
  CFormSelect,
  CFormInput,
  CFormLabel,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CSpinner,
  CBadge,
  CProgress
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { 
  cilBarChart, 
  cilCheckCircle, 
  cilReload,
  cilPlus,
  cilMinus,
  cilMoney,
  cilX,
  cilArrowRight
} from '@coreui/icons';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { fetchPayrollRecords } from '../../store/slices/payrollSlice';
import { selectPayrollRecords, selectPayrollLoading, selectPayrollError } from '../../store/slices/payrollSlice';
import { useReduxOperations } from '../../hooks/useReduxOperations';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const MainChart = () => {
  const dispatch = useDispatch();
  const { checkAuth, handleApiError } = useReduxOperations();
  
  // Redux state
  const payrollRecords = useSelector(selectPayrollRecords);
  const isLoading = useSelector(selectPayrollLoading);
  const error = useSelector(selectPayrollError);
  
  // Local state
  const [chartType, setChartType] = useState('bar');
  const [timeRange, setTimeRange] = useState('6months');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [showTrends, setShowTrends] = useState(true);
  const [showProjections, setShowProjections] = useState(false);
  const [customDateRange, setCustomDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [exportFormat, setExportFormat] = useState('png');

  // Fetch payroll data when component mounts
  // useEffect(() => {
  //   if (checkAuth()) {
  //     dispatch(fetchPayrollRecords());
  //   }
  // }, [dispatch, checkAuth]); // Now safe to include checkAuth since it's memoized

  // TEMPORARILY DISABLED TO STOP INFINITE API CALLS
  // TODO: Re-enable once the infinite loop issue is resolved

  // Process real payroll data from API
  const processedData = useMemo(() => {
    if (!payrollRecords || payrollRecords.length === 0) {
      return [];
    }

    // Group payroll records by month
    const monthlyData = {};
    payrollRecords.forEach(record => {
      const date = new Date(record.payroll_month);
      const monthKey = date.toLocaleString('default', { month: 'short' });
      const year = date.getFullYear();
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: monthKey,
          year: year,
          basicSalary: 0,
          allowances: 0,
          overtime: 0,
          deductions: 0,
          grossSalary: 0,
          netSalary: 0,
          count: 0
        };
      }
      
      monthlyData[monthKey].basicSalary += record.basic_salary || 0;
      monthlyData[monthKey].allowances += (record.housing_allowance || 0) + (record.transport_allowance || 0) + (record.other_allowance || 0);
      monthlyData[monthKey].overtime += record.overtime_amount || 0;
      monthlyData[monthKey].deductions += record.total_deductions || 0;
      monthlyData[monthKey].grossSalary += record.gross_salary || 0;
      monthlyData[monthKey].netSalary += record.net_salary || 0;
      monthlyData[monthKey].count += 1;
    });

    // Convert to array and sort by date
    return Object.values(monthlyData).sort((a, b) => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return months.indexOf(a.month) - months.indexOf(b.month);
    });
  }, [payrollRecords]);

  // Filter data based on selected time range
  const filteredData = useMemo(() => {
    if (timeRange === 'custom' && customDateRange.startDate && customDateRange.endDate) {
      // Custom date range logic would go here
      return processedData;
    } else if (timeRange === 'year') {
      return processedData;
    } else if (timeRange === '6months') {
      return processedData.slice(-6);
    } else if (timeRange === '3months') {
      return processedData.slice(-3);
    }
    return processedData;
  }, [timeRange, customDateRange, processedData]);

  // Calculate summary statistics from real data
  const summaryStats = useMemo(() => {
    if (!filteredData.length) return {};
    
    const totalBasicSalary = filteredData.reduce((sum, item) => sum + item.basicSalary, 0);
    const totalAllowances = filteredData.reduce((sum, item) => sum + item.allowances, 0);
    const totalOvertime = filteredData.reduce((sum, item) => sum + item.overtime, 0);
    const totalDeductions = filteredData.reduce((sum, item) => sum + item.deductions, 0);
    const totalGrossSalary = filteredData.reduce((sum, item) => sum + item.grossSalary, 0);
    const totalNetSalary = filteredData.reduce((sum, item) => sum + item.netSalary, 0);
    
    const avgBasicSalary = totalBasicSalary / filteredData.length;
    const avgNetSalary = totalNetSalary / filteredData.length;
    
    // Calculate trends
    const firstMonth = filteredData[0];
    const lastMonth = filteredData[filteredData.length - 1];
    const salaryGrowth = firstMonth && lastMonth ? ((lastMonth.netSalary - firstMonth.netSalary) / firstMonth.netSalary) * 100 : 0;
    
    return {
      totalBasicSalary,
      totalAllowances,
      totalOvertime,
      totalDeductions,
      totalGrossSalary,
      totalNetSalary,
      avgBasicSalary,
      avgNetSalary,
      salaryGrowth,
      employeeCount: filteredData.reduce((sum, item) => sum + item.count, 0)
    };
  }, [filteredData]);

  // Chart data configuration using real data
  const chartData = useMemo(() => ({
    labels: filteredData.map(item => item.month),
    datasets: [
      {
        label: 'Basic Salary',
        data: filteredData.map(item => item.basicSalary),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
        fill: false,
        tension: 0.4
      },
      {
        label: 'Allowances',
        data: filteredData.map(item => item.allowances),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        fill: false,
        tension: 0.4
      },
      {
        label: 'Overtime',
        data: filteredData.map(item => item.overtime),
        backgroundColor: 'rgba(255, 206, 86, 0.6)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 2,
        fill: false,
        tension: 0.4
      },
      {
        label: 'Net Salary',
        data: filteredData.map(item => item.netSalary),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 3,
        fill: showProjections,
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 8
      }
    ]
  }), [filteredData, showProjections]);

  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: `Payroll Trends - ${timeRange === 'custom' ? 'Custom Range' : timeRange === 'year' ? 'Full Year' : `${timeRange} View`}`,
        font: {
          size: 16,
          weight: 'bold'
        },
        padding: {
          top: 10,
          bottom: 20
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: $${context.parsed.y.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          font: {
            size: 11
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          callback: function(value) {
            return '$' + value.toLocaleString();
          },
          font: {
            size: 11
          }
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    },
    elements: {
      point: {
        hoverRadius: 8,
        radius: 4
      }
    }
  }), [timeRange, showProjections]);

  // Handle chart export
  const handleExport = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      if (exportFormat === 'png') {
        const link = document.createElement('a');
        link.download = `payroll-chart-${timeRange}-${new Date().toISOString().split('T')[0]}.png`;
        link.href = canvas.toDataURL();
        link.click();
      } else if (exportFormat === 'pdf') {
        // PDF export logic would go here
        alert('PDF export functionality would be implemented here');
      }
    }
  };

  // Handle data refresh
  const handleRefresh = () => {
    if (checkAuth()) {
      dispatch(fetchPayrollRecords());
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  // Get trend indicator
  const getTrendIndicator = (value) => {
    if (value > 0) {
              return (
          <CBadge color="success" className="d-flex align-items-center gap-1">
            <CIcon icon={cilPlus} size="sm" />
            +{value.toFixed(1)}%
          </CBadge>
        );
    } else if (value < 0) {
              return (
          <CBadge color="danger" className="d-flex align-items-center gap-1">
            <CIcon icon={cilMinus} size="sm" />
            {value.toFixed(1)}%
          </CBadge>
        );
    }
    return (
      <CBadge color="secondary" className="d-flex align-items-center gap-1">
        No change
      </CBadge>
    );
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="text-center py-5">
        <CSpinner size="lg" />
        <p className="mt-3">Loading payroll data...</p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="text-center py-5">
        <div className="text-danger mb-3">
          <CIcon icon={cilX} size="3xl" />
        </div>
        <h5>Failed to load payroll data</h5>
        <p className="text-muted">{error}</p>
        <CButton color="primary" onClick={handleRefresh}>
          <CIcon icon={cilArrowRight} className="me-2" />
          Try Again
        </CButton>
      </div>
    );
  }

  return (
    <div className="main-chart-container">
      {/* Header with Controls */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-2">
            <CIcon icon={cilBarChart} className="me-2 text-primary" />
            Payroll Analytics Dashboard
          </h2>
          <p className="text-muted mb-0">
            Comprehensive view of payroll trends, employee compensation, and financial insights
          </p>
        </div>
        
        <div className="d-flex gap-2">
          <CButton
            color="outline-secondary"
            onClick={handleRefresh}
            className="d-flex align-items-center gap-2"
          >
                            <CIcon icon={cilArrowRight} />
            Refresh
          </CButton>
          
          <CDropdown>
            <CDropdownToggle color="outline-primary">
                              <CIcon icon={cilCheckCircle} className="me-2" />
              Export
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem onClick={() => setExportFormat('png')}>
                Export as PNG
              </CDropdownItem>
              <CDropdownItem onClick={() => setExportFormat('pdf')}>
                Export as PDF
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
          
          <CButton
            color="primary"
            onClick={handleExport}
            className="d-flex align-items-center gap-2"
          >
                            <CIcon icon={cilCheckCircle} />
            Download
          </CButton>
        </div>
      </div>

      {/* Summary Statistics Cards */}
      <CRow className="mb-4">
        <CCol xs={12} md={3}>
          <CCard className="summary-card h-100 border-0 shadow-sm">
            <CCardBody className="text-center p-4">
              <div className="mb-3">
                <CIcon icon={cilMoney} size="2xl" className="text-primary" />
              </div>
              <h4 className="mb-2">{formatCurrency(summaryStats.totalNetSalary || 0)}</h4>
              <p className="text-muted mb-2">Total Net Payroll</p>
              {summaryStats.salaryGrowth !== undefined && getTrendIndicator(summaryStats.salaryGrowth)}
            </CCardBody>
          </CCard>
        </CCol>
        
        <CCol xs={12} md={3}>
          <CCard className="summary-card h-100 border-0 shadow-sm">
            <CCardBody className="text-center p-4">
                              <div className="mb-3">
                  <CIcon icon={cilPlus} size="2xl" className="text-success" />
                </div>
              <h4 className="mb-2">{formatCurrency(summaryStats.avgNetSalary || 0)}</h4>
              <p className="text-muted mb-2">Average Net Salary</p>
              <div className="small text-muted">
                Per employee per month
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        
        <CCol xs={12} md={3}>
          <CCard className="summary-card h-100 border-0 shadow-sm">
            <CCardBody className="text-center p-4">
              <div className="mb-3">
                <CIcon icon={cilBarChart} size="2xl" className="text-info" />
              </div>
              <h4 className="mb-2">{formatCurrency(summaryStats.totalAllowances || 0)}</h4>
              <p className="text-muted mb-2">Total Allowances</p>
              <div className="small text-muted">
                Housing, Transport, Other
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        
        <CCol xs={12} md={3}>
          <CCard className="summary-card h-100 border-0 shadow-sm">
            <CCardBody className="text-center p-4">
                              <div className="mb-3">
                  <CIcon icon={cilMinus} size="2xl" className="text-warning" />
                </div>
              <h4 className="mb-2">{formatCurrency(summaryStats.totalDeductions || 0)}</h4>
              <p className="text-muted mb-2">Total Deductions</p>
              <div className="small text-muted">
                Taxes, Benefits, etc.
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Chart Controls */}
      <CCard className="border-0 shadow-sm mb-4">
        <CCardBody>
          <CRow className="align-items-center">
            <CCol md={3}>
              <div className="mb-3">
                <CFormLabel>Chart Type</CFormLabel>
                <CButtonGroup className="w-100">
                  <CButton
                    color={chartType === 'bar' ? 'primary' : 'outline-primary'}
                    onClick={() => setChartType('bar')}
                    size="sm"
                  >
                    <CIcon icon={cilBarChart} className="me-1" />
                    Bar
                  </CButton>
                  <CButton
                    color={chartType === 'line' ? 'primary' : 'outline-primary'}
                    onClick={() => setChartType('line')}
                    size="sm"
                  >
                    <CIcon icon={cilBarChart} className="me-1" />
                    Line
                  </CButton>
                </CButtonGroup>
              </div>
            </CCol>
            
            <CCol md={3}>
              <div className="mb-3">
                <CFormLabel>Time Range</CFormLabel>
                <CFormSelect
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  size="sm"
                >
                  <option value="3months">Last 3 Months</option>
                  <option value="6months">Last 6 Months</option>
                  <option value="year">Full Year</option>
                  <option value="custom">Custom Range</option>
                </CFormSelect>
              </div>
            </CCol>
            
            <CCol md={3}>
              <div className="mb-3">
                <CFormLabel>Year</CFormLabel>
                <CFormSelect
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  size="sm"
                >
                  {Array.from({ length: 5 }, (_, i) => {
                    const year = new Date().getFullYear() - 2 + i;
                    return <option key={year} value={year}>{year}</option>;
                  })}
                </CFormSelect>
              </div>
            </CCol>
            
            <CCol md={3}>
              <div className="mb-3">
                <CFormLabel>Options</CFormLabel>
                <div className="d-flex gap-2">
                  <CButton
                    color={showTrends ? 'primary' : 'outline-primary'}
                    onClick={() => setShowTrends(!showTrends)}
                    size="sm"
                  >
                    Trends
                  </CButton>
                  <CButton
                    color={showProjections ? 'primary' : 'outline-primary'}
                    onClick={() => setShowProjections(!showProjections)}
                    size="sm"
                  >
                    Projections
                  </CButton>
                </div>
              </div>
            </CCol>
          </CRow>
          
          {/* Custom Date Range */}
          {timeRange === 'custom' && (
            <CRow className="mt-3">
              <CCol md={6}>
                <CFormLabel>Start Date</CFormLabel>
                <CFormInput
                  type="date"
                  value={customDateRange.startDate}
                  onChange={(e) => setCustomDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                  size="sm"
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel>End Date</CFormLabel>
                <CFormInput
                  type="date"
                  value={customDateRange.endDate}
                  onChange={(e) => setCustomDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                  size="sm"
                />
              </CCol>
            </CRow>
          )}
        </CCardBody>
      </CCard>

      {/* Main Chart */}
      <CCard className="border-0 shadow-sm mb-4">
        <CCardHeader className="bg-white border-bottom">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <CIcon icon={cilBarChart} className="me-2" />
              Payroll Trends Analysis
            </h5>
            <div className="d-flex gap-2">
                              <CBadge color="primary" className="d-flex align-items-center gap-1">
                  <CIcon icon={cilPlus} size="sm" />
                  {filteredData.length} months
                </CBadge>
            </div>
          </div>
        </CCardHeader>
        <CCardBody>
          <div style={{ height: '400px', position: 'relative' }}>
            {chartType === 'bar' ? (
              <Bar data={chartData} options={chartOptions} />
            ) : (
              <Line data={chartData} options={chartOptions} />
            )}
          </div>
        </CCardBody>
      </CCard>

      {/* Additional Insights */}
      <CRow>
        <CCol md={6}>
          <CCard className="border-0 shadow-sm h-100">
            <CCardHeader className="bg-white border-bottom">
                              <h6 className="mb-0">
                  <CIcon icon={cilPlus} className="me-2" />
                  Salary Growth Trends
                </h6>
            </CCardHeader>
            <CCardBody>
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span>Monthly Growth Rate</span>
                  <span className="fw-bold">{summaryStats.salaryGrowth > 0 ? '+' : ''}{summaryStats.salaryGrowth?.toFixed(1) || 0}%</span>
                </div>
                <CProgress 
                  value={Math.abs(summaryStats.salaryGrowth || 0)} 
                  color={summaryStats.salaryGrowth >= 0 ? 'success' : 'danger'}
                  className="mb-3"
                />
                
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span>Average Monthly Salary</span>
                  <span className="fw-bold">{formatCurrency(summaryStats.avgNetSalary || 0)}</span>
                </div>
                <CProgress 
                  value={((summaryStats.avgNetSalary || 0) / 10000) * 100} 
                  color="info"
                  className="mb-3"
                />
                
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span>Total Payroll Volume</span>
                  <span className="fw-bold">{formatCurrency(summaryStats.totalNetSalary || 0)}</span>
                </div>
                <CProgress 
                  value={((summaryStats.totalNetSalary || 0) / 1000000) * 100} 
                  color="warning"
                />
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        
        <CCol md={6}>
          <CCard className="border-0 shadow-sm h-100">
            <CCardHeader className="bg-white border-bottom">
              <h6 className="mb-0">
                <CIcon icon={cilReload} className="me-2" />
                Chart Configuration
              </h6>
            </CCardHeader>
            <CCardBody>
              <div className="mb-3">
                <h6>Current Settings</h6>
                <ul className="list-unstyled">
                  <li><strong>Chart Type:</strong> {chartType === 'bar' ? 'Bar Chart' : 'Line Chart'}</li>
                  <li><strong>Time Range:</strong> {timeRange === 'custom' ? 'Custom Range' : timeRange === 'year' ? 'Full Year' : `${timeRange} View`}</li>
                  <li><strong>Year:</strong> {selectedYear}</li>
                  <li><strong>Trends:</strong> {showTrends ? 'Enabled' : 'Disabled'}</li>
                  <li><strong>Projections:</strong> {showProjections ? 'Enabled' : 'Disabled'}</li>
                </ul>
              </div>
              
              <div className="mb-3">
                <h6>Data Summary</h6>
                <ul className="list-unstyled">
                  <li><strong>Data Points:</strong> {filteredData.length}</li>
                  <li><strong>Date Range:</strong> {filteredData[0]?.month} - {filteredData[filteredData.length - 1]?.month}</li>
                  <li><strong>Total Records:</strong> {summaryStats.employeeCount || 0}</li>
                </ul>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  );
};

export default MainChart;

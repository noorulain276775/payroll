import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  CTable,
  CTableBody,
  CTableRow,
  CTableDataCell,
  CTableHeaderCell,
  CTableHead,
  CCardHeader,
  CCard,
  CCardBody,
  CAlert,
  CRow,
  CCol,
  CBadge,
  CButton,
  CSpinner
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { 
  cilMoney, 
  cilTrendingUp, 
  cilTrendingDown, 
  cilCalendar, 
  cilFileText,
  cilWarning,
  cilCheckCircle,
  cilInfo
} from '@coreui/icons';
import { selectIsAuthenticated } from '../../store/slices/authSlice';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorDisplay from '../../components/common/ErrorDisplay';

const EmployeeSalaryRevisions = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [salaryRevisions, setSalaryRevisions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Redux state
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }
    
    // Simulate API call - replace with actual Redux action
    fetchSalaryRevisions();
  }, [isAuthenticated, navigate]);

  const fetchSalaryRevisions = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API delay - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data - replace with actual data
      const mockData = [
        {
          id: 1,
          previous_basic_salary: 5000,
          previous_transport_allowance: 500,
          previous_housing_allowance: 800,
          previous_other_allowance: 200,
          previous_gross_salary: 6500,
          new_basic_salary: 5500,
          new_transport_allowance: 600,
          new_housing_allowance: 900,
          new_other_allowance: 250,
          new_gross_salary: 7250,
          revision_date: '2024-01-15',
          effective_from: '2024-02-01',
          reason: 'Annual Performance Review - Promotion',
          status: 'active'
        },
        {
          id: 2,
          previous_basic_salary: 4500,
          previous_transport_allowance: 400,
          previous_housing_allowance: 700,
          previous_other_allowance: 150,
          previous_gross_salary: 5750,
          new_basic_salary: 5000,
          new_transport_allowance: 500,
          new_housing_allowance: 800,
          new_other_allowance: 200,
          new_gross_salary: 6500,
          revision_date: '2023-07-01',
          effective_from: '2023-08-01',
          reason: 'Mid-year Salary Adjustment',
          status: 'active'
        }
      ];
      
      setSalaryRevisions(mockData);
    } catch (err) {
      setError('Failed to fetch salary revisions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    return (
      <CBadge color="success" className="d-flex align-items-center gap-1">
        <CIcon icon={cilCheckCircle} size="sm" />
        Active
      </CBadge>
    );
  };

  const calculateChange = (oldValue, newValue) => {
    const change = newValue - oldValue;
    const percentage = oldValue > 0 ? ((change / oldValue) * 100) : 0;
    return { change, percentage };
  };

  const getChangeIndicator = (oldValue, newValue) => {
    const { change, percentage } = calculateChange(oldValue, newValue);
    const isPositive = change >= 0;
    
    return (
      <div className="d-flex align-items-center">
        <CIcon 
          icon={isPositive ? cilTrendingUp : cilTrendingDown} 
          className={`me-1 ${isPositive ? 'text-success' : 'text-danger'}`}
        />
        <span className={`small ${isPositive ? 'text-success' : 'text-danger'}`}>
          {isPositive ? '+' : ''}{formatCurrency(change)} ({isPositive ? '+' : ''}{percentage.toFixed(1)}%)
        </span>
      </div>
    );
  };

  // Show loading state
  if (isLoading) {
    return <LoadingSpinner text="Loading salary revisions..." />;
  }

  // Show error state
  if (error) {
    return (
      <ErrorDisplay 
        error={error}
        onRetry={fetchSalaryRevisions}
        title="Failed to load salary revisions"
      />
    );
  }

  // Show no data state
  if (!salaryRevisions || salaryRevisions.length === 0) {
    return (
      <div className="text-center py-5">
        <div className="mb-4">
          <CIcon icon={cilMoney} size="4xl" className="text-muted" />
        </div>
        <h4 className="text-muted mb-3">No Salary Revisions Found</h4>
        <p className="text-muted mb-4">
          Your salary revision history will appear here once changes are made.
        </p>
        <CButton 
          color="primary" 
          onClick={fetchSalaryRevisions}
          className="px-4"
        >
          <CIcon icon={cilInfo} className="me-2" />
          Refresh
        </CButton>
      </div>
    );
  }

  // Calculate summary statistics
  const totalRevisions = salaryRevisions.length;
  const averageIncrease = salaryRevisions.reduce((sum, rev) => {
    const increase = rev.new_gross_salary - rev.previous_gross_salary;
    return sum + increase;
  }, 0) / totalRevisions;

  return (
    <div className="salary-revisions-container">
      {/* Header Section */}
      <div className="mb-4">
        <h2 className="mb-3">
          <CIcon icon={cilMoney} className="me-2 text-primary" />
          Salary Revision History
        </h2>
        <p className="text-muted mb-0">
          Track your salary changes and understand how your compensation has evolved over time
        </p>
      </div>

      {/* Summary Cards */}
      <CRow className="mb-4">
        <CCol xs={12} md={4}>
          <CCard className="summary-card h-100 border-0 shadow-sm">
            <CCardBody className="text-center p-4">
              <div className="mb-3">
                <CIcon icon={cilFileText} size="2xl" className="text-info" />
              </div>
              <h4 className="mb-2">{totalRevisions}</h4>
              <p className="text-muted mb-0">Total Revisions</p>
            </CCardBody>
          </CCard>
        </CCol>
        
        <CCol xs={12} md={4}>
          <CCard className="summary-card h-100 border-0 shadow-sm">
            <CCardBody className="text-center p-4">
              <div className="mb-3">
                <CIcon icon={cilTrendingUp} size="2xl" className="text-success" />
              </div>
              <h4 className="mb-2">{formatCurrency(averageIncrease)}</h4>
              <p className="text-muted mb-0">Average Increase</p>
            </CCardBody>
          </CCard>
        </CCol>
        
        <CCol xs={12} md={4}>
          <CCard className="summary-card h-100 border-0 shadow-sm">
            <CCardBody className="text-center p-4">
              <div className="mb-3">
                <CIcon icon={cilCalendar} size="2xl" className="text-warning" />
              </div>
              <h4 className="mb-2">
                {salaryRevisions[0] ? formatDate(salaryRevisions[0].effective_from) : 'N/A'}
              </h4>
              <p className="text-muted mb-0">Latest Effective Date</p>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Salary Revisions Table */}
      <CCard className="border-0 shadow-sm">
        <CCardHeader className="bg-white border-bottom">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <CIcon icon={cilTrendingUp} className="me-2" />
              Revision Details
            </h5>
            <small className="text-muted">
              {totalRevisions} revision{totalRevisions !== 1 ? 's' : ''} found
            </small>
          </div>
        </CCardHeader>
        <CCardBody className="p-0">
          <div className="table-responsive">
            <CTable hover className="mb-0">
              <CTableHead className="bg-light">
                <CTableRow>
                  <CTableHeaderCell className="border-0">Component</CTableHeaderCell>
                  <CTableHeaderCell className="border-0">Previous Amount</CTableHeaderCell>
                  <CTableHeaderCell className="border-0">New Amount</CTableHeaderCell>
                  <CTableHeaderCell className="border-0">Change</CTableHeaderCell>
                  <CTableHeaderCell className="border-0">Effective From</CTableHeaderCell>
                  <CTableHeaderCell className="border-0">Reason</CTableHeaderCell>
                  <CTableHeaderCell className="border-0">Status</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {salaryRevisions.map((revision, index) => (
                  <React.Fragment key={revision.id}>
                    {/* Basic Salary Row */}
                    <CTableRow className="table-primary">
                      <CTableDataCell className="fw-bold">
                        <CIcon icon={cilMoney} className="me-2" />
                        Basic Salary
                      </CTableDataCell>
                      <CTableDataCell>{formatCurrency(revision.previous_basic_salary)}</CTableDataCell>
                      <CTableDataCell>{formatCurrency(revision.new_basic_salary)}</CTableDataCell>
                      <CTableDataCell>{getChangeIndicator(revision.previous_basic_salary, revision.new_basic_salary)}</CTableDataCell>
                      <CTableDataCell>{formatDate(revision.effective_from)}</CTableDataCell>
                      <CTableDataCell>{revision.reason}</CTableDataCell>
                      <CTableDataCell>{getStatusBadge(revision.status)}</CTableDataCell>
                    </CTableRow>
                    
                    {/* Transport Allowance Row */}
                    <CTableRow>
                      <CTableDataCell className="fw-semibold ps-4">
                        Transport Allowance
                      </CTableDataCell>
                      <CTableDataCell>{formatCurrency(revision.previous_transport_allowance)}</CTableDataCell>
                      <CTableDataCell>{formatCurrency(revision.new_transport_allowance)}</CTableDataCell>
                      <CTableDataCell>{getChangeIndicator(revision.previous_transport_allowance, revision.new_transport_allowance)}</CTableDataCell>
                      <CTableDataCell>{formatDate(revision.effective_from)}</CTableDataCell>
                      <CTableDataCell>{revision.reason}</CTableDataCell>
                      <CTableDataCell>{getStatusBadge(revision.status)}</CTableDataCell>
                    </CTableRow>
                    
                    {/* Housing Allowance Row */}
                    <CTableRow>
                      <CTableDataCell className="fw-semibold ps-4">
                        Housing Allowance
                      </CTableDataCell>
                      <CTableDataCell>{formatCurrency(revision.previous_housing_allowance)}</CTableDataCell>
                      <CTableDataCell>{formatCurrency(revision.new_housing_allowance)}</CTableDataCell>
                      <CTableDataCell>{getChangeIndicator(revision.previous_housing_allowance, revision.new_housing_allowance)}</CTableDataCell>
                      <CTableDataCell>{formatDate(revision.effective_from)}</CTableDataCell>
                      <CTableDataCell>{revision.reason}</CTableDataCell>
                      <CTableDataCell>{getStatusBadge(revision.status)}</CTableDataCell>
                    </CTableRow>
                    
                    {/* Other Allowances Row */}
                    <CTableRow>
                      <CTableDataCell className="fw-semibold ps-4">
                        Other Allowances
                      </CTableDataCell>
                      <CTableDataCell>{formatCurrency(revision.previous_other_allowance)}</CTableDataCell>
                      <CTableDataCell>{formatCurrency(revision.new_other_allowance)}</CTableDataCell>
                      <CTableDataCell>{getChangeIndicator(revision.previous_other_allowance, revision.new_other_allowance)}</CTableDataCell>
                      <CTableDataCell>{formatDate(revision.effective_from)}</CTableDataCell>
                      <CTableDataCell>{revision.reason}</CTableDataCell>
                      <CTableDataCell>{getStatusBadge(revision.status)}</CTableDataCell>
                    </CTableRow>
                    
                    {/* Total Gross Salary Row */}
                    <CTableRow className="table-success fw-bold">
                      <CTableDataCell>
                        <CIcon icon={cilTrendingUp} className="me-2" />
                        Total Gross Salary
                      </CTableDataCell>
                      <CTableDataCell>{formatCurrency(revision.previous_gross_salary)}</CTableDataCell>
                      <CTableDataCell>{formatCurrency(revision.new_gross_salary)}</CTableDataCell>
                      <CTableDataCell>{getChangeIndicator(revision.previous_gross_salary, revision.new_gross_salary)}</CTableDataCell>
                      <CTableDataCell>{formatDate(revision.effective_from)}</CTableDataCell>
                      <CTableDataCell>{revision.reason}</CTableDataCell>
                      <CTableDataCell>{getStatusBadge(revision.status)}</CTableDataCell>
                    </CTableRow>
                    
                    {/* Separator Row */}
                    {index < salaryRevisions.length - 1 && (
                      <CTableRow>
                        <CTableDataCell colSpan="7" className="p-0">
                          <hr className="my-3" />
                        </CTableDataCell>
                      </CTableRow>
                    )}
                  </React.Fragment>
                ))}
              </CTableBody>
            </CTable>
          </div>
        </CCardBody>
      </CCard>

      {/* Footer Info */}
      <div className="text-center mt-4">
        <small className="text-muted">
          <CIcon icon={cilInfo} className="me-1" />
          Salary revisions are effective from the specified date and reflect in your next payroll
        </small>
      </div>
    </div>
  );
};

export default EmployeeSalaryRevisions;

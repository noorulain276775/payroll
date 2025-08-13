import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CCol,
  CAlert,
  CSpinner
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilMoney, cilBank, cilWarning } from '@coreui/icons';
import { fetchSalaryDetails } from '../../store/slices/employeeSlice';
import { selectSalaryDetails, selectEmployeesLoading, selectEmployeesError } from '../../store/slices/employeeSlice';
import { selectIsAuthenticated, selectUserType } from '../../store/slices/authSlice';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorDisplay from '../../components/common/ErrorDisplay';

const EmployeeSalaryDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Redux state
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userType = useSelector(selectUserType);
  const salaryDetails = useSelector(selectSalaryDetails);
  const isLoading = useSelector(selectEmployeesLoading);
  const error = useSelector(selectEmployeesError);

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    // Only employees can view salary details
    if (userType !== 'Employee') {
      navigate('/dashboard');
      return;
    }

    // Fetch salary details
    dispatch(fetchSalaryDetails());
  }, [dispatch, isAuthenticated, userType, navigate]);

  // Show loading state
  if (isLoading) {
    return <LoadingSpinner text="Loading salary details..." />;
  }

  // Show error state
  if (error) {
    return (
      <ErrorDisplay 
        error={error}
        onRetry={() => dispatch(fetchSalaryDetails())}
        title="Failed to load salary details"
      />
    );
  }

  // Show no data state
  if (!salaryDetails || Object.keys(salaryDetails).length === 0) {
    return (
      <CRow className="justify-content-center mt-5">
        <CCol xs={12} md={8} lg={6}>
          <CAlert color="warning" className="text-center p-4">
            <CIcon icon={cilWarning} size="2xl" className="mb-3" />
            <h5 className="fw-bold">Salary Details Not Found</h5>
            <p>Your salary details have not been added by the Admin yet.</p>
            <p>Please contact the Admin for assistance.</p>
          </CAlert>
        </CCol>
      </CRow>
    );
  }

  const renderInfo = (label, value, icon = null) => (
    <div className="mb-3">
      <div className="d-flex align-items-center mb-1">
        {icon && <CIcon icon={icon} className="me-2 text-muted" />}
        <strong className="text-muted">{label}:</strong>
      </div>
      <div className="fw-semibold">
        {value ? (
          typeof value === 'number' ? `$${value.toLocaleString()}` : value
        ) : (
          <span className="text-muted">Not Available</span>
        )}
      </div>
    </div>
  );

  return (
    <CCard>
      <CCardHeader className="bg-primary text-white">
        <h4 className="mb-0">
          <CIcon icon={cilMoney} className="me-2" />
          Employee Salary Details
        </h4>
      </CCardHeader>
      <CCardBody>
        <CRow>
          <CCol xs={12} md={6}>
            {renderInfo('Basic Salary', salaryDetails.basic_salary, cilMoney)}
          </CCol>
          <CCol xs={12} md={6}>
            {renderInfo('Housing Allowance', salaryDetails.housing_allowance, cilMoney)}
          </CCol>
        </CRow>
        <CRow>
          <CCol xs={12} md={6}>
            {renderInfo('Transport Allowance', salaryDetails.transport_allowance, cilMoney)}
          </CCol>
          <CCol xs={12} md={6}>
            {renderInfo('Other Allowances', salaryDetails.other_allowance, cilMoney)}
          </CCol>
        </CRow>
        <CRow>
          <CCol xs={12} md={6}>
            {renderInfo('Bank Name', salaryDetails.bank_name, cilBank)}
          </CCol>
          <CCol xs={12} md={6}>
            {renderInfo('Account Number', salaryDetails.account_no, cilBank)}
          </CCol>
        </CRow>
        <CRow>
          <CCol xs={12} md={6}>
            {renderInfo('IBAN', salaryDetails.iban, cilBank)}
          </CCol>
          <CCol xs={12} md={6}>
            {renderInfo('SWIFT Code', salaryDetails.swift_code, cilBank)}
          </CCol>
        </CRow>
        
        {/* Additional salary information */}
        {salaryDetails.total_salary && (
          <CRow>
            <CCol xs={12}>
              <div className="border-top pt-3 mt-3">
                <div className="d-flex align-items-center justify-content-between">
                  <h5 className="mb-0">
                    <CIcon icon={cilMoney} className="me-2 text-success" />
                    Total Monthly Salary
                  </h5>
                  <div className="h4 mb-0 text-success fw-bold">
                    ${salaryDetails.total_salary.toLocaleString()}
                  </div>
                </div>
              </div>
            </CCol>
          </CRow>
        )}
      </CCardBody>
    </CCard>
  );
};

export default EmployeeSalaryDetails;

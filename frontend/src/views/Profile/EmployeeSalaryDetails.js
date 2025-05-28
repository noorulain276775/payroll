import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../../config';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CCol,
  CAlert,
} from '@coreui/react';

const EmployeeSalaryDetails = () => {
  const [employee, setEmployee] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    if (!token) {
      window.location.href = "/";
      return;
    }
    axios
      .get(`${BASE_URL}/employee/salary-details/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setEmployee(response.data);
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user_type');
          window.location.href = '/'
        }
      });
  }, [navigate, token]);

  if (!employee || Object.keys(employee).length === 0) {
    return (
      <CRow className="justify-content-center mt-5">
        <CCol xs={12} md={8} lg={6}>
          <CAlert color="warning" className="text-center p-4">
            <h5 className="fw-bold">Your Salary Details are not found</h5>
            <p>Your salary details have not been added by the Admin.</p>
            <p>Please contact the Admin for assistance.</p>
          </CAlert>
        </CCol>
      </CRow>
    );
  }

  const renderInfo = (label, value) => (
    <div className="mb-3">
      <strong>{label}:</strong>
      <div>{value ? value : 'Not Available'}</div>
    </div>
  );

  return (
    <CCard>
      <CCardHeader>
        <h4>Employee Salary Details</h4>
      </CCardHeader>
      <CCardBody>
        <CRow>
          <CCol xs={12} md={6}>
            {renderInfo('Basic Salary', employee.basic_salary)}
          </CCol>
          <CCol xs={12} md={6}>
            {renderInfo('Housing Allowance', employee.housing_allowance)}
          </CCol>
        </CRow>
        <CRow>
          <CCol xs={12} md={6}>
            {renderInfo('Transport Allowance', employee.transport_allowance)}
          </CCol>
          <CCol xs={12} md={6}>
            {renderInfo('Other Allowances', employee.other_allowance)}
          </CCol>
        </CRow>
        <CRow>
          <CCol xs={12} md={6}>
            {renderInfo('Bank Name', employee.bank_name)}
          </CCol>
          <CCol xs={12} md={6}>
            {renderInfo('Account Number', employee.account_no)}
          </CCol>
        </CRow>
        <CRow>
          <CCol xs={12} md={6}>
            {renderInfo('IBAN', employee.iban)}
          </CCol>
          <CCol xs={12} md={6}>
            {renderInfo('SWIFT Code', employee.swift_code)}
          </CCol>
        </CRow>
        <CRow>
          <CCol xs={12} md={6}>
            {renderInfo('Gross Salary', employee.gross_salary)}
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>
  );
};

export default EmployeeSalaryDetails;

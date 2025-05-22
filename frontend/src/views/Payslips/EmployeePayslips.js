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
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle
} from '@coreui/react';

const EmployeePayslips = () => {
  const [payrolls, setPayrolls] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    if (!token) {
      window.location.href = "/";
      return;
    }
    axios
      .get(`${BASE_URL}/employee/payroll/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setPayrolls(response.data);
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user_type');
          window.location.reload();
          navigate('/');
        }
      });
  }, [navigate, token]);

  const handleDownloadPDF = (payroll) => {
    setLoading(true);
    axios
      .get(`${BASE_URL}/employee/payroll/download/${payroll.id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob', // Important for PDF download
      })
      .then((response) => {
        const file = new Blob([response.data], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(file);
        link.download = `Payroll_${payroll.month}_${payroll.year}.pdf`;
        link.click();
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error downloading PDF:", error);
        setLoading(false);
      });
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
  ];

  if (!payrolls || payrolls.length === 0) {
    return (
      <CRow className="justify-content-center mt-5">
        <CCol xs={12} md={8} lg={6}>
          <CAlert color="warning" className="text-center p-4">
            <h5 className="fw-bold">No Payrolls have been created yet</h5>
            <p>To view your payroll and download payslips, please contact the Admin for assistance.</p>
          </CAlert>
        </CCol>
      </CRow>
    );
  }

  return (
    <CCard>
      <CCardHeader>
        <h4 className="d-inline">My Payrolls</h4>
        <div className="float-end">
          <small className="text-muted">
            <span className="me-3">R-OT: Regular Overtime</span>
            <span className="me-3">H-OT: Holidays Overtime</span>
            <span>LWP: Leave Without Pay</span>
          </small>
        </div>
      </CCardHeader>
      <CCardBody>
        <CTable bordered>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell width="10%">Month</CTableHeaderCell>
              <CTableHeaderCell width="10%">Year</CTableHeaderCell>
              <CTableHeaderCell width="10%">H-OT</CTableHeaderCell>
              <CTableHeaderCell width="10%">R-OT</CTableHeaderCell>
              <CTableHeaderCell width="10%">LWP</CTableHeaderCell>
              <CTableHeaderCell width="12%">Deductions</CTableHeaderCell>
              <CTableHeaderCell width="12%">Net Pay</CTableHeaderCell>
              <CTableHeaderCell width="21%">Remarks</CTableHeaderCell>
              <CTableHeaderCell width="7%">Actions</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {payrolls.map((payroll) => (
              <CTableRow key={payroll.id}>
                <CTableDataCell>{monthNames[payroll.month - 1]}</CTableDataCell>
                <CTableDataCell>{payroll.year}</CTableDataCell>
                <CTableDataCell>{payroll.overtime_days}</CTableDataCell>
                <CTableDataCell>{payroll.normal_overtime_days}</CTableDataCell>
                <CTableDataCell>{payroll.unpaid_days}</CTableDataCell>
                <CTableDataCell>{payroll.other_deductions}</CTableDataCell>
                <CTableDataCell>{payroll.total_salary_for_month}</CTableDataCell>
                <CTableDataCell style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                  {payroll.remarks ? payroll.remarks : "Not Available"}
                </CTableDataCell>
                <CTableDataCell>
                  <CDropdown>
                    <CDropdownToggle color="secondary">
                      Actions
                    </CDropdownToggle>
                    <CDropdownMenu>
                      <CDropdownItem onClick={() => handleDownloadPDF(payroll)}>
                        {loading ? "Downloading..." : "Download PDF"}
                      </CDropdownItem>
                    </CDropdownMenu>
                  </CDropdown>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </CCardBody>
    </CCard>
  );
};

export default EmployeePayslips;
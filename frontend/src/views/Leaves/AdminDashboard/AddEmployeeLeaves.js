import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  CForm, CFormLabel, CFormInput, CFormTextarea, CFormSelect,
  CButton, CAlert, CCard, CCardHeader, CCardBody, CCol, CRow
} from '@coreui/react';
import { BASE_URL, API_ENDPOINTS } from '../../../config';

const leaveTypeOptions = [
  'Annual', 'Sick', 'Unpaid', 'Maternity', 'Paternity',
  'Compassionate', 'Personal Leave', 'Emergency Leave', 'Other',
];

const AddEmployeeLeaves = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [leaveType, setLeaveType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [daysTaken, setDaysTaken] = useState(0);
  const [reason, setReason] = useState('');
  const [remarks, setRemarks] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const token = localStorage.getItem('authToken');
  const today = new Date().toISOString().split("T")[0];

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${BASE_URL}${API_ENDPOINTS.EMPLOYEES}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.clear();
        window.location.href = '/';
      }
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diff = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
      setDaysTaken(diff > 0 ? diff : 0);
    } else {
      setDaysTaken(0);
    }
  }, [startDate, endDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!leaveType || !startDate || !endDate || !reason || !remarks || !selectedEmployee) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
              await axios.post(`${BASE_URL}${API_ENDPOINTS.ADD_LEAVES}`, {
        employee: selectedEmployee,
        leave_type: leaveType,
        start_date: startDate,
        end_date: endDate,
        reason,
        days_taken: daysTaken,
        remarks
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccessMsg('Leave application submitted successfully. If rejected, it might be due to insufficient leave balance.');
      setSelectedEmployee('');
      setLeaveType('');
      setStartDate('');
      setEndDate('');
      setReason('');
      setRemarks('');
      setDaysTaken(0);

      setTimeout(() => setSuccessMsg(''), 9000);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.clear();
        window.location.href = '/';
      } else if (err.response?.status === 400) {
        setError('Invalid data. Please check your input.');
      } else if (err.response?.status === 500) {
        setError('Server error. Please try again later.');
      } else {
        setError('Error submitting leave application.');
      }
      setTimeout(() => setError(''), 5000);
    }
  };

  return (
    <CCard>
      <CCardHeader>
        <h4 className="mb-0">Add Employee Leaves</h4>
      </CCardHeader>
      <CCardBody>
        {error && <CAlert color="danger">{error}</CAlert>}
        {successMsg && <CAlert color="success">{successMsg}</CAlert>}

        <CForm onSubmit={handleSubmit}>
          {/* EMPLOYEE SELECT */}
          <CRow className="mb-3">
            <CCol md={3}>
              <CFormLabel>Select Employee <span className="text-danger">*</span></CFormLabel>
            </CCol>
            <CCol md={9}>
              <CFormSelect value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)}>
                <option value="">Select User</option>
                {employees.map((em) => (
                  <option key={em.id} value={em.id}>{em.first_name} {em.last_name}</option>
                ))}
              </CFormSelect>
            </CCol>
          </CRow>

          {/* LEAVE TYPE */}
          <CRow className="mb-3">
            <CCol md={3}>
              <CFormLabel>Leave Type <span className="text-danger">*</span></CFormLabel>
            </CCol>
            <CCol md={9}>
              <CFormSelect value={leaveType} onChange={(e) => setLeaveType(e.target.value)}>
                <option value="">Select leave type</option>
                {leaveTypeOptions.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </CFormSelect>
            </CCol>
          </CRow>

          {/* START DATE */}
          <CRow className="mb-3">
            <CCol md={3}>
              <CFormLabel>Start Date <span className="text-danger">*</span></CFormLabel>
            </CCol>
            <CCol md={9}>
              <CFormInput type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </CCol>
          </CRow>

          {/* END DATE */}
          <CRow className="mb-3">
            <CCol md={3}>
              <CFormLabel>End Date <span className="text-danger">*</span></CFormLabel>
            </CCol>
            <CCol md={9}>
              <CFormInput type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </CCol>
          </CRow>

          {/* DAYS TAKEN */}
          {daysTaken > 0 && (
            <CRow className="mb-3">
              <CCol md={3}>
                <CFormLabel>Days Taken</CFormLabel>
              </CCol>
              <CCol md={9}>
                <CFormInput type="text" value={`${daysTaken} day(s)`} disabled />
              </CCol>
            </CRow>
          )}

          {/* REASON */}
          <CRow className="mb-3">
            <CCol md={3}>
              <CFormLabel>Reason <span className="text-danger">*</span></CFormLabel>
            </CCol>
            <CCol md={9}>
              <CFormTextarea rows="2" value={reason} onChange={(e) => setReason(e.target.value)} />
            </CCol>
          </CRow>

          {/* REMARKS */}
          <CRow className="mb-3">
            <CCol md={3}>
              <CFormLabel>Remarks <span className="text-danger">*</span></CFormLabel>
            </CCol>
            <CCol md={9}>
              <CFormTextarea rows="2" value={remarks} onChange={(e) => setRemarks(e.target.value)} />
            </CCol>
          </CRow>

          {/* SUBMIT BUTTON */}
          <CRow>
            <CCol md={{ offset: 3, span: 9 }}>
              <CButton type="submit" color="primary">Submit</CButton>
            </CCol>
          </CRow>
        </CForm>
      </CCardBody>
    </CCard>
  );
};

export default AddEmployeeLeaves;

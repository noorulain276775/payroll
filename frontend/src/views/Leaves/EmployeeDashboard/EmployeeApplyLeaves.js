import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CForm, CFormLabel, CFormInput, CFormTextarea, CFormSelect, CButton, CAlert, CCard, CCardHeader, CCardBody } from '@coreui/react';
import { BASE_URL } from '../../../../config';

const leaveTypeOptions = [
  'Annual',
  'Sick',
  'Unpaid',
  'Maternity',
  'Paternity',
  'Compassionate',
  'Personal Leave',
  'Emergency Leave',
  'Other',
];

const EmployeeApplyLeaves = () => {
  const [leaveType, setLeaveType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [daysTaken, setDaysTaken] = useState(0);
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const token = localStorage.getItem('authToken');

  // Disable past dates
  const today = new Date().toISOString().split("T")[0];

  // Calculate days taken
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setDaysTaken(diffDays > 0 ? diffDays : 0);
    } else {
      setDaysTaken(0);
    }
  }, [startDate, endDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    // Frontend validation
    if (!leaveType || !startDate || !endDate || !reason) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/leaves/`, {
        leave_type: leaveType,
        start_date: startDate,
        end_date: endDate,
        reason,
        days_taken: daysTaken
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccessMsg('Leave application submitted successfully! Please check your leave balance incase it is rejected by the system.');
      setLeaveType('');
      setStartDate('');
      setEndDate('');
      setReason('');
      setDaysTaken(0);
      setTimeout(() => {
        setSuccessMsg('');
      }
        , 9000);
    } catch (err) {
      console.error(err);
      setError('Error submitting leave application.');
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('authToken');
        window.location.href = '/';
      }
      if (err.response && err.response.status === 400) {
        setError('Invalid data. Please check your input.');
      }
      if (err.response && err.response.status === 500) {
        setError('Server error. Please try again later.');
      }
      setTimeout(() => {
        setError('');
      }
        , 5000);
    }
  };

  return (
    <CCard>
      <div>
        <CCardHeader>
          <h4 className="mb-2">Apply for Leave</h4>
        </CCardHeader>
        <CCardBody>
          <div className='mb-2 nt-2'>
            {error && <CAlert color="danger">{error}</CAlert>}
            {successMsg && <CAlert color="success">{successMsg}</CAlert>}
          </div>
          <CForm onSubmit={handleSubmit}>
            <div className="mb-3">
              <CFormLabel>
                Leave Type <span style={{ color: 'red' }}>*</span>
              </CFormLabel>
              <CFormSelect
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                required
              >
                <option value="">Select leave type</option>
                {leaveTypeOptions.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </CFormSelect>
            </div>

            <div className="mb-3">
              <CFormLabel>
                Start Date <span style={{ color: 'red' }}>*</span>
              </CFormLabel>
              <CFormInput
                type="date"
                min={today}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <CFormLabel>
                End Date <span style={{ color: 'red' }}>*</span>
              </CFormLabel>
              <CFormInput
                type="date"
                min={startDate || today}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>

            {daysTaken > 0 && (
              <div className="mb-3">
                <CFormLabel>Days Taken</CFormLabel>
                <CFormInput type="text" value={`${daysTaken} day(s)`} disabled />
              </div>
            )}

            <div className="mb-3">
              <CFormLabel>
                Reason <span style={{ color: 'red' }}>*</span>
              </CFormLabel>
              <CFormTextarea
                rows="3"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              />
            </div>

            <CButton type="submit" color="primary">
              Submit
            </CButton>
          </CForm>
        </CCardBody>
      </div>
    </CCard>
  );
};

export default EmployeeApplyLeaves;

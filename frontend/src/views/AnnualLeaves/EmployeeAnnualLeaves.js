import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CForm, CFormLabel, CFormInput, CFormTextarea, CFormSelect, CButton, CAlert } from '@coreui/react';
import { BASE_URL } from '../../../config';

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

const EmployeeAnnualLeaves = () => {
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

      setSuccessMsg('Leave application submitted successfully!');
      setLeaveType('');
      setStartDate('');
      setEndDate('');
      setReason('');
      setDaysTaken(0);
    } catch (err) {
      console.error(err);
      setError('Error submitting leave application.');
    }
  };

  return (
    <div className="p-4">
      <h4 className="mb-4">Apply for Leave</h4>

      {error && <CAlert color="danger">{error}</CAlert>}
      {successMsg && <CAlert color="success">{successMsg}</CAlert>}

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
    </div>
  );
};

export default EmployeeAnnualLeaves;

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  CForm, 
  CFormLabel, 
  CFormInput, 
  CFormTextarea, 
  CFormSelect, 
  CButton, 
  CAlert, 
  CCard, 
  CCardHeader, 
  CCardBody,
  CSpinner
} from '@coreui/react';
import { createLeave } from '../../../store/slices/leaveSlice';
import { selectLeavesCreating, selectLeavesError, selectLeavesSuccessMessage } from '../../../store/slices/leaveSlice';
import { selectIsAuthenticated } from '../../../store/slices/authSlice';

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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Local state
  const [leaveType, setLeaveType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [daysTaken, setDaysTaken] = useState(0);
  const [reason, setReason] = useState('');
  
  // Redux state
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isCreating = useSelector(selectLeavesCreating);
  const error = useSelector(selectLeavesError);
  const successMessage = useSelector(selectLeavesSuccessMessage);

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

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Clear form on successful submission
  useEffect(() => {
    if (successMessage) {
      setLeaveType('');
      setStartDate('');
      setEndDate('');
      setReason('');
      setDaysTaken(0);
    }
  }, [successMessage]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation
    if (!leaveType || !startDate || !endDate || !reason) {
      return;
    }

    const leaveData = {
      leave_type: leaveType,
      start_date: startDate,
      end_date: endDate,
      reason,
      days_taken: daysTaken
    };

    dispatch(createLeave(leaveData));
  };

  const resetForm = () => {
    setLeaveType('');
    setStartDate('');
    setEndDate('');
    setReason('');
    setDaysTaken(0);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <CCard>
      <CCardHeader>
        <h4 className="mb-2">Apply for Leave</h4>
        <p className="text-muted mb-0">Submit your leave request for approval</p>
      </CCardHeader>
      <CCardBody>
        {/* Success Message */}
        {successMessage && (
          <CAlert color="success" className="mb-4">
            <strong>Success!</strong> {successMessage}
          </CAlert>
        )}

        {/* Error Message */}
        {error && (
          <CAlert color="danger" className="mb-4">
            <strong>Error:</strong> {error}
          </CAlert>
        )}

        <CForm onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <CFormLabel htmlFor="leaveType">Leave Type *</CFormLabel>
              <CFormSelect
                id="leaveType"
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                required
                disabled={isCreating}
              >
                <option value="">Select Leave Type</option>
                {leaveTypeOptions.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </CFormSelect>
            </div>

            <div className="col-md-6 mb-3">
              <CFormLabel htmlFor="daysTaken">Days Requested</CFormLabel>
              <CFormInput
                id="daysTaken"
                type="number"
                value={daysTaken}
                readOnly
                className="bg-light"
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <CFormLabel htmlFor="startDate">Start Date *</CFormLabel>
              <CFormInput
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={today}
                required
                disabled={isCreating}
              />
            </div>

            <div className="col-md-6 mb-3">
              <CFormLabel htmlFor="endDate">End Date *</CFormLabel>
              <CFormInput
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate || today}
                required
                disabled={isCreating}
              />
            </div>
          </div>

          <div className="mb-4">
            <CFormLabel htmlFor="reason">Reason for Leave *</CFormLabel>
            <CFormTextarea
              id="reason"
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please provide a detailed reason for your leave request..."
              required
              disabled={isCreating}
            />
          </div>

          <div className="d-flex gap-2">
            <CButton
              type="submit"
              color="primary"
              disabled={isCreating || !leaveType || !startDate || !endDate || !reason}
              className="px-4"
            >
              {isCreating ? (
                <>
                  <CSpinner size="sm" className="me-2" />
                  Submitting...
                </>
              ) : (
                'Submit Leave Request'
              )}
            </CButton>
            
            <CButton
              type="button"
              color="outline-secondary"
              onClick={resetForm}
              disabled={isCreating}
              className="px-4"
            >
              Reset Form
            </CButton>
          </div>
        </CForm>
      </CCardBody>
    </CCard>
  );
};

export default EmployeeApplyLeaves;

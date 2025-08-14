import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  CTable,
  CTableBody,
  CTableRow,
  CTableDataCell,
  CTableHeaderCell,
  CTableHead,
  CCard,
  CCardHeader,
  CCardBody,
  CBadge,
  CSpinner
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { 
  cilCalendar, 
  cilClock, 
  cilFile,
  cilCheck,
  cilX
} from '@coreui/icons';
import { fetchLeaves } from '../../../store/slices/leaveSlice';
import { selectLeaves, selectLeavesLoading, selectLeavesError } from '../../../store/slices/leaveSlice';
import { selectIsAuthenticated } from '../../../store/slices/authSlice';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import ErrorDisplay from '../../../components/common/ErrorDisplay';

const EmployeeLeavesRequests = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Redux state
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const leaves = useSelector(selectLeaves);
  const isLoading = useSelector(selectLeavesLoading);
  const error = useSelector(selectLeavesError);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }
    
    dispatch(fetchLeaves());
  }, [dispatch, isAuthenticated, navigate]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      'pending': { color: 'warning', icon: cilClock, text: 'Pending' },
      'approved': { color: 'success', icon: cilCheck, text: 'Approved' },
      'rejected': { color: 'danger', icon: cilX, text: 'Rejected' },
      'cancelled': { color: 'secondary', icon: cilX, text: 'Cancelled' }
    };
    
    const config = statusConfig[status?.toLowerCase()] || statusConfig.pending;
    
    return (
      <CBadge color={config.color} className="d-flex align-items-center gap-1">
        <CIcon icon={config.icon} size="sm" />
        {config.text}
      </CBadge>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Show loading state
  if (isLoading) {
    return <LoadingSpinner text="Loading your leave requests..." />;
  }

  // Show error state
  if (error) {
    return (
      <ErrorDisplay 
        error={error}
        onRetry={() => dispatch(fetchLeaves())}
        title="Failed to load leave requests"
      />
    );
  }

  // Show no data state
  if (!leaves || leaves.length === 0) {
    return (
      <div className="text-center py-5">
        <div className="mb-4">
          <CIcon icon={cilCalendar} size="4xl" className="text-muted" />
        </div>
        <h4 className="text-muted mb-3">No Leave Requests Found</h4>
        <p className="text-muted mb-4">
          You haven't submitted any leave requests yet.
        </p>
      </div>
    );
  }

  // Filter leaves for current employee (in real app, this would be filtered by API)
  const employeeLeaves = leaves.filter(leave => leave.employee === 'current'); // Placeholder filter

  return (
    <div className="leave-requests-container">
      {/* Header Section */}
      <div className="mb-4">
        <h2 className="mb-3">
          <CIcon icon={cilCalendar} className="me-2 text-primary" />
          My Leave Requests
        </h2>
        <p className="text-muted mb-0">
          Track the status of your submitted leave requests
        </p>
      </div>

      {/* Leave Requests Table */}
      <CCard className="border-0 shadow-sm">
        <CCardHeader className="bg-white border-bottom">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <CIcon icon={cilFile} className="me-2" />
              Leave History
            </h5>
            <small className="text-muted">
              {employeeLeaves.length} request{employeeLeaves.length !== 1 ? 's' : ''} found
            </small>
          </div>
        </CCardHeader>
        <CCardBody className="p-0">
          <div className="table-responsive">
            <CTable hover className="mb-0">
              <CTableHead className="bg-light">
                <CTableRow>
                  <CTableHeaderCell className="border-0">Leave Type</CTableHeaderCell>
                  <CTableHeaderCell className="border-0">Duration</CTableHeaderCell>
                  <CTableHeaderCell className="border-0">Start Date</CTableHeaderCell>
                  <CTableHeaderCell className="border-0">End Date</CTableHeaderCell>
                  <CTableHeaderCell className="border-0">Reason</CTableHeaderCell>
                  <CTableHeaderCell className="border-0">Status</CTableHeaderCell>
                  <CTableHeaderCell className="border-0">Submitted On</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {employeeLeaves.map((leave, index) => (
                  <CTableRow key={leave.id || index} className="align-middle">
                    <CTableDataCell>
                      <div className="d-flex align-items-center">
                        <CIcon icon={cilCalendar} className="me-2 text-primary" />
                        <strong>{leave.leave_type}</strong>
                      </div>
                    </CTableDataCell>
                    
                    <CTableDataCell>
                      <div className="d-flex align-items-center">
                        <CIcon icon={cilClock} className="me-2 text-info" />
                        {calculateDuration(leave.start_date, leave.end_date)} day(s)
                      </div>
                    </CTableDataCell>
                    
                    <CTableDataCell>
                      <div className="fw-semibold">
                        {formatDate(leave.start_date)}
                      </div>
                    </CTableDataCell>
                    
                    <CTableDataCell>
                      <div className="fw-semibold">
                        {formatDate(leave.end_date)}
                      </div>
                    </CTableDataCell>
                    
                    <CTableDataCell>
                      <div className="text-truncate" style={{ maxWidth: '200px' }} title={leave.reason}>
                        {leave.reason}
                      </div>
                    </CTableDataCell>
                    
                    <CTableDataCell>
                      {getStatusBadge(leave.status)}
                    </CTableDataCell>
                    
                    <CTableDataCell>
                      <div className="text-muted small">
                        {formatDate(leave.created_at)}
                      </div>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </div>
        </CCardBody>
      </CCard>

      {/* Summary Statistics */}
      <div className="mt-4">
        <div className="row text-center">
          <div className="col-md-3">
            <div className="p-3 bg-light rounded">
              <h6 className="text-muted mb-1">Total Requests</h6>
              <h4 className="text-primary mb-0">{employeeLeaves.length}</h4>
            </div>
          </div>
          <div className="col-md-3">
            <div className="p-3 bg-light rounded">
              <h6 className="text-muted mb-1">Pending</h6>
              <h4 className="text-warning mb-0">
                {employeeLeaves.filter(l => l.status === 'pending').length}
              </h4>
            </div>
          </div>
          <div className="col-md-3">
            <div className="p-3 bg-light rounded">
              <h6 className="text-muted mb-1">Approved</h6>
              <h4 className="text-success mb-0">
                {employeeLeaves.filter(l => l.status === 'approved').length}
              </h4>
            </div>
          </div>
          <div className="col-md-3">
            <div className="p-3 bg-light rounded">
              <h6 className="text-muted mb-1">Rejected</h6>
              <h4 className="text-danger mb-0">
                {employeeLeaves.filter(l => l.status === 'rejected').length}
              </h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeLeavesRequests;

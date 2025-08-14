import React, { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import dayjs from "dayjs";
import {
    CCard,
    CCardHeader,
    CCardBody,
    CTable,
    CTableBody,
    CTableRow,
    CTableDataCell,
    CTableHeaderCell,
    CTableHead,
    CRow,
    CCol,
    CProgress,
    CBadge
} from "@coreui/react";
import CIcon from '@coreui/icons-react';
import { 
    cilCalendar, 
    cilClock, 
    cilInfo,
    cilCheck,
    cilX
} from '@coreui/icons';
import { fetchLeaveBalances } from '../../../store/slices/leaveSlice';
import { selectLeaveBalances, selectLeaveBalancesLoading, selectLeaveBalancesError } from '../../../store/slices/leaveSlice';
import { selectIsAuthenticated } from '../../../store/slices/authSlice';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import ErrorDisplay from '../../../components/common/ErrorDisplay';

const EmployeeOwnLeaveBalance = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    // Redux state
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const leaveBalances = useSelector(selectLeaveBalances);
    const isLoading = useSelector(selectLeaveBalancesLoading);
    const error = useSelector(selectLeaveBalancesError);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/');
            return;
        }
        
        dispatch(fetchLeaveBalances());
    }, [dispatch, isAuthenticated, navigate]);

    const getStatusBadge = (status) => {
        const statusConfig = {
            'available': { color: 'success', icon: cilCheck, text: 'Available' },
            'used': { color: 'info', icon: cilClock, text: 'Used' },
            'pending': { color: 'warning', icon: cilClock, text: 'Pending' },
            'exhausted': { color: 'danger', icon: cilX, text: 'Exhausted' }
        };
        
        const config = statusConfig[status?.toLowerCase()] || statusConfig.available;
        
        return (
            <CBadge color={config.color} className="d-flex align-items-center gap-1">
                <CIcon icon={config.icon} size="sm" />
                {config.text}
            </CBadge>
        );
    };

    const calculateUsagePercentage = (used, total) => {
        if (total === 0) return 0;
        return Math.round((used / total) * 100);
    };

    const getProgressColor = (percentage) => {
        if (percentage >= 80) return 'danger';
        if (percentage >= 60) return 'warning';
        return 'success';
    };

    // Show loading state
    if (isLoading) {
        return <LoadingSpinner text="Loading your leave balance..." />;
    }

    // Show error state
    if (error) {
        return (
            <ErrorDisplay 
                error={error}
                onRetry={() => dispatch(fetchLeaveBalances())}
                title="Failed to load leave balance"
            />
        );
    }

    // Show no data state
    if (!leaveBalances || leaveBalances.length === 0) {
        return (
            <div className="text-center py-5">
                <div className="mb-4">
                    <CIcon icon={cilCalendar} size="4xl" className="text-muted" />
                </div>
                <h4 className="text-muted mb-3">No Leave Balance Found</h4>
                <p className="text-muted mb-4">
                    Your leave balance information will appear here once it's configured.
                </p>
            </div>
        );
    }

    // Get current employee's leave balance (in real app, this would be filtered by API)
    const currentBalance = leaveBalances[0]; // Placeholder - should filter by employee ID

    return (
        <div className="leave-balance-container">
            {/* Header Section */}
            <div className="mb-4">
                <h2 className="mb-3">
                    <CIcon icon={cilCalendar} className="me-2 text-primary" />
                    My Leave Balance
                </h2>
                <p className="text-muted mb-0">
                    Track your available leave days and usage statistics
                </p>
            </div>

            {/* Summary Cards */}
            <CRow className="mb-4">
                <CCol xs={12} md={3}>
                    <CCard className="summary-card h-100 border-0 shadow-sm">
                        <CCardBody className="text-center p-4">
                            <div className="mb-3">
                                <CIcon icon={cilCheck} size="2xl" className="text-success" />
                            </div>
                            <h4 className="mb-2">{currentBalance?.annual_leave_balance || 0}</h4>
                            <p className="text-muted mb-0">Annual Leave</p>
                        </CCardBody>
                    </CCard>
                </CCol>
                
                <CCol xs={12} md={3}>
                    <CCard className="summary-card h-100 border-0 shadow-sm">
                        <CCardBody className="text-center p-4">
                            <div className="mb-3">
                                <CIcon icon={cilClock} size="2xl" className="text-info" />
                            </div>
                            <h4 className="mb-2">{currentBalance?.sick_leave_balance || 0}</h4>
                            <p className="text-muted mb-0">Sick Leave</p>
                        </CCardBody>
                    </CCard>
                </CCol>
                
                <CCol xs={12} md={3}>
                    <CCard className="summary-card h-100 border-0 shadow-sm">
                        <CCardBody className="text-center p-4">
                            <div className="mb-3">
                                <CIcon icon={cilClock} size="2xl" className="text-warning" />
                            </div>
                            <h4 className="mb-2">{currentBalance?.emergency_leave_balance || 0}</h4>
                            <p className="text-muted mb-0">Emergency Leave</p>
                        </CCardBody>
                    </CCard>
                </CCol>
                
                <CCol xs={12} md={3}>
                    <CCard className="summary-card h-100 border-0 shadow-sm">
                        <CCardBody className="text-center p-4">
                            <div className="mb-3">
                                <CIcon icon={cilInfo} size="2xl" className="text-primary" />
                            </div>
                            <h4 className="mb-2">{currentBalance?.other_leave_balance || 0}</h4>
                            <p className="text-muted mb-0">Other Leave</p>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>

            {/* Detailed Leave Balance Table */}
            <CCard className="border-0 shadow-sm">
                <CCardHeader className="bg-white border-bottom">
                    <h5 className="mb-0">
                        <CIcon icon={cilInfo} className="me-2" />
                        Leave Balance Details
                    </h5>
                </CCardHeader>
                <CCardBody className="p-0">
                    <div className="table-responsive">
                        <CTable hover className="mb-0">
                            <CTableHead className="bg-light">
                                <CTableRow>
                                    <CTableHeaderCell className="border-0">Leave Type</CTableHeaderCell>
                                    <CTableHeaderCell className="border-0">Total Days</CTableHeaderCell>
                                    <CTableHeaderCell className="border-0">Used Days</CTableHeaderCell>
                                    <CTableHeaderCell className="border-0">Available Days</CTableHeaderCell>
                                    <CTableHeaderCell className="border-0">Usage</CTableHeaderCell>
                                    <CTableHeaderCell className="border-0">Status</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {[
                                    {
                                        type: 'Annual Leave',
                                        total: currentBalance?.annual_leave_balance || 0,
                                        used: currentBalance?.annual_leave_used || 0,
                                        available: (currentBalance?.annual_leave_balance || 0) - (currentBalance?.annual_leave_used || 0)
                                    },
                                    {
                                        type: 'Sick Leave',
                                        total: currentBalance?.sick_leave_balance || 0,
                                        used: currentBalance?.sick_leave_used || 0,
                                        available: (currentBalance?.sick_leave_balance || 0) - (currentBalance?.sick_leave_used || 0)
                                    },
                                    {
                                        type: 'Emergency Leave',
                                        total: currentBalance?.emergency_leave_balance || 0,
                                        used: currentBalance?.emergency_leave_used || 0,
                                        available: (currentBalance?.emergency_leave_balance || 0) - (currentBalance?.emergency_leave_used || 0)
                                    },
                                    {
                                        type: 'Other Leave',
                                        total: currentBalance?.other_leave_balance || 0,
                                        used: currentBalance?.other_leave_used || 0,
                                        available: (currentBalance?.other_leave_balance || 0) - (currentBalance?.other_leave_used || 0)
                                    }
                                ].map((leaveType, index) => {
                                    const usagePercentage = calculateUsagePercentage(leaveType.used, leaveType.total);
                                    const progressColor = getProgressColor(usagePercentage);
                                    
                                    return (
                                        <CTableRow key={index} className="align-middle">
                                            <CTableDataCell>
                                                <div className="fw-semibold">{leaveType.type}</div>
                                            </CTableDataCell>
                                            
                                            <CTableDataCell>
                                                <div className="text-primary fw-bold">{leaveType.total}</div>
                                            </CTableDataCell>
                                            
                                            <CTableDataCell>
                                                <div className="text-info">{leaveType.used}</div>
                                            </CTableDataCell>
                                            
                                            <CTableDataCell>
                                                <div className="text-success fw-bold">{leaveType.available}</div>
                                            </CTableDataCell>
                                            
                                            <CTableDataCell>
                                                <div className="d-flex align-items-center">
                                                    <CProgress 
                                                        value={usagePercentage} 
                                                        color={progressColor}
                                                        className="me-2"
                                                        style={{ width: '80px', height: '8px' }}
                                                    />
                                                    <small className="text-muted">{usagePercentage}%</small>
                                                </div>
                                            </CTableDataCell>
                                            
                                            <CTableDataCell>
                                                {getStatusBadge(leaveType.available > 0 ? 'available' : 'exhausted')}
                                            </CTableDataCell>
                                        </CTableRow>
                                    );
                                })}
                            </CTableBody>
                        </CTable>
                    </div>
                </CCardBody>
            </CCard>

            {/* Additional Information */}
            <div className="mt-4">
                <CCard className="border-0 bg-light">
                    <CCardBody className="p-4">
                        <div className="d-flex align-items-start">
                            <CIcon icon={cilInfo} size="lg" className="text-info me-3 mt-1" />
                            <div>
                                <h6 className="mb-2">Leave Balance Information</h6>
                                <ul className="mb-0 text-muted">
                                    <li>Leave balances are calculated annually and reset on your employment anniversary</li>
                                    <li>Unused leave days may be carried forward to the next year (subject to company policy)</li>
                                    <li>Emergency leave is available for urgent personal matters</li>
                                    <li>Contact HR for any questions about your leave balance</li>
                                </ul>
                            </div>
                        </div>
                    </CCardBody>
                </CCard>
            </div>
        </div>
    );
};

export default EmployeeOwnLeaveBalance;

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CCard,
  CCardHeader,
  CCardBody,
  CAlert,
  CRow,
  CCol,
  CFormSelect,
  CFormInput,
  CModalTitle,
  CModalFooter,
  CForm,
  CBadge,
  CSpinner,
  CProgress
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { 
  cilMoney, 
  cilPlus, 
  cilPencil, 
  cilTrash, 
  cilEye,
  cilCalculator,
  cilUser,
  cilCalendar,
  cilBank,
  cilCheckCircle,
  cilXCircle,
  cilClock
} from '@coreui/icons';
import { fetchEmployees } from '../../store/slices/employeeSlice';
import { selectEmployees, selectEmployeesLoading, selectEmployeesError } from '../../store/slices/employeeSlice';
import { selectIsAuthenticated } from '../../store/slices/authSlice';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorDisplay from '../../components/common/ErrorDisplay';
import { useReduxOperations, useFormState } from '../../hooks/useReduxOperations';

const Payroll = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { checkAuth, handleApiError } = useReduxOperations();
  
  // Redux state
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const employees = useSelector(selectEmployees);
  const isLoading = useSelector(selectEmployeesLoading);
  const error = useSelector(selectEmployeesError);
  
  // Local state
  const [payrollRecords, setPayrollRecords] = useState([]);
  const [alertVisible, setAlertVisible] = useState(false);
  const [successAlertVisible, setSuccessAlertVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [editingRecord, setEditingRecord] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Form state using custom hook
  const {
    formData,
    errors,
    updateField,
    updateFields,
    setFieldError,
    clearErrors,
    resetForm
  } = useFormState({
    employee: '',
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
    basicSalary: '',
    housingAllowance: '',
    transportAllowance: '',
    otherAllowance: '',
    overtimeHours: '',
    overtimeRate: '',
    deductions: '',
    netSalary: ''
  });

  useEffect(() => {
    if (!checkAuth()) return;
    
    dispatch(fetchEmployees());
    fetchPayrollData();
  }, [dispatch, checkAuth]);

  // Timer for alerts
  useEffect(() => {
    let timer;
    if (alertVisible || successAlertVisible) {
      timer = setTimeout(() => {
        setAlertVisible(false);
        setSuccessAlertVisible(false);
      }, 10000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [alertVisible, successAlertVisible]);

  const fetchPayrollData = async () => {
    try {
      // This would be replaced with actual Redux action
      // For now, using mock data
      const mockPayroll = [
        {
          id: 1,
          employee: 'John Doe',
          month: 1,
          year: 2024,
          basicSalary: 5000,
          housingAllowance: 800,
          transportAllowance: 500,
          otherAllowance: 200,
          overtimeHours: 10,
          overtimeRate: 25,
          overtimePay: 250,
          deductions: 300,
          grossSalary: 6750,
          netSalary: 6450,
          status: 'paid',
          paymentDate: '2024-02-01',
          bankAccount: '1234567890'
        },
        {
          id: 2,
          employee: 'Jane Smith',
          month: 1,
          year: 2024,
          basicSalary: 5500,
          housingAllowance: 900,
          transportAllowance: 600,
          otherAllowance: 250,
          overtimeHours: 5,
          overtimeRate: 30,
          overtimePay: 150,
          deductions: 400,
          grossSalary: 7400,
          netSalary: 7000,
          status: 'paid',
          paymentDate: '2024-02-01',
          bankAccount: '0987654321'
        },
        {
          id: 3,
          employee: 'Mike Johnson',
          month: 1,
          year: 2024,
          basicSalary: 4800,
          housingAllowance: 750,
          transportAllowance: 450,
          otherAllowance: 180,
          overtimeHours: 15,
          overtimeRate: 22,
          overtimePay: 330,
          deductions: 280,
          grossSalary: 6510,
          netSalary: 6230,
          status: 'pending',
          paymentDate: null,
          bankAccount: '1122334455'
        }
      ];
      setPayrollRecords(mockPayroll);
    } catch (error) {
      setErrorMessage('Failed to fetch payroll data');
      setAlertVisible(true);
    }
  };

  const calculateNetSalary = () => {
    const basic = parseFloat(formData.basicSalary) || 0;
    const housing = parseFloat(formData.housingAllowance) || 0;
    const transport = parseFloat(formData.transportAllowance) || 0;
    const other = parseFloat(formData.otherAllowance) || 0;
    const overtime = (parseFloat(formData.overtimeHours) || 0) * (parseFloat(formData.overtimeRate) || 0);
    const deductions = parseFloat(formData.deductions) || 0;
    
    return basic + housing + transport + other + overtime - deductions;
  };

  const handleCreatePayroll = async () => {
    clearErrors();
    
    // Validation
    if (!formData.employee) {
      setFieldError('employee', 'Employee is required');
      return;
    }
    if (!formData.basicSalary) {
      setFieldError('basicSalary', 'Basic salary is required');
      return;
    }
    if (!formData.month && formData.month !== 0) {
      setFieldError('month', 'Month is required');
      return;
    }
    if (!formData.year) {
      setFieldError('year', 'Year is required');
      return;
    }

    try {
      // This would be replaced with actual Redux action
      const newPayroll = {
        id: Date.now(),
        employee: formData.employee,
        month: parseInt(formData.month),
        year: parseInt(formData.year),
        basicSalary: parseFloat(formData.basicSalary),
        housingAllowance: parseFloat(formData.housingAllowance) || 0,
        transportAllowance: parseFloat(formData.transportAllowance) || 0,
        otherAllowance: parseFloat(formData.otherAllowance) || 0,
        overtimeHours: parseFloat(formData.overtimeHours) || 0,
        overtimeRate: parseFloat(formData.overtimeRate) || 0,
        overtimePay: (parseFloat(formData.overtimeHours) || 0) * (parseFloat(formData.overtimeRate) || 0),
        deductions: parseFloat(formData.deductions) || 0,
        grossSalary: parseFloat(formData.basicSalary) + (parseFloat(formData.housingAllowance) || 0) + (parseFloat(formData.transportAllowance) || 0) + (parseFloat(formData.otherAllowance) || 0) + ((parseFloat(formData.overtimeHours) || 0) * (parseFloat(formData.overtimeRate) || 0)),
        netSalary: calculateNetSalary(),
        status: 'pending',
        paymentDate: null,
        bankAccount: 'N/A'
      };
      
      setPayrollRecords(prev => [...prev, newPayroll]);
      setSuccessMessage('Payroll record created successfully');
      setSuccessAlertVisible(true);
      setCreateModalVisible(false);
      resetForm();
    } catch (error) {
      setErrorMessage(handleApiError(error, 'Failed to create payroll record'));
      setAlertVisible(true);
    }
  };

  const handleEditPayroll = async () => {
    clearErrors();
    
    if (!formData.basicSalary) {
      setFieldError('basicSalary', 'Basic salary is required');
      return;
    }

    try {
      // This would be replaced with actual Redux action
      const updatedPayroll = {
        ...editingRecord,
        basicSalary: parseFloat(formData.basicSalary),
        housingAllowance: parseFloat(formData.housingAllowance) || 0,
        transportAllowance: parseFloat(formData.transportAllowance) || 0,
        otherAllowance: parseFloat(formData.otherAllowance) || 0,
        overtimeHours: parseFloat(formData.overtimeHours) || 0,
        overtimeRate: parseFloat(formData.overtimeRate) || 0,
        overtimePay: (parseFloat(formData.overtimeHours) || 0) * (parseFloat(formData.overtimeRate) || 0),
        deductions: parseFloat(formData.deductions) || 0,
        grossSalary: parseFloat(formData.basicSalary) + (parseFloat(formData.housingAllowance) || 0) + (parseFloat(formData.transportAllowance) || 0) + (parseFloat(formData.otherAllowance) || 0) + ((parseFloat(formData.overtimeHours) || 0) * (parseFloat(formData.overtimeRate) || 0)),
        netSalary: calculateNetSalary()
      };
      
      setPayrollRecords(prev => prev.map(r => r.id === editingRecord.id ? updatedPayroll : r));
      setSuccessMessage('Payroll record updated successfully');
      setSuccessAlertVisible(true);
      setEditModalVisible(false);
      setEditingRecord(null);
      resetForm();
    } catch (error) {
      setErrorMessage(handleApiError(error, 'Failed to update payroll record'));
      setAlertVisible(true);
    }
  };

  const handleDeletePayroll = async (payrollId) => {
    if (window.confirm('Are you sure you want to delete this payroll record?')) {
      try {
        // This would be replaced with actual Redux action
        setPayrollRecords(prev => prev.filter(r => r.id !== payrollId));
        setSuccessMessage('Payroll record deleted successfully');
        setSuccessAlertVisible(true);
      } catch (error) {
        setErrorMessage(handleApiError(error, 'Failed to delete payroll record'));
        setAlertVisible(true);
      }
    }
  };

  const handleStatusChange = async (payrollId, newStatus) => {
    try {
      // This would be replaced with actual Redux action
      setPayrollRecords(prev => prev.map(r => 
        r.id === payrollId 
          ? { ...r, status: newStatus, paymentDate: newStatus === 'paid' ? new Date().toISOString().split('T')[0] : null }
          : r
      ));
      setSuccessMessage(`Payroll status updated to ${newStatus}`);
      setSuccessAlertVisible(true);
    } catch (error) {
      setErrorMessage(handleApiError(error, 'Failed to update payroll status'));
      setAlertVisible(true);
    }
  };

  const openEditModal = (record) => {
    setEditingRecord(record);
    updateFields({
      employee: record.employee,
      month: record.month,
      year: record.year,
      basicSalary: record.basicSalary.toString(),
      housingAllowance: record.housingAllowance.toString(),
      transportAllowance: record.transportAllowance.toString(),
      otherAllowance: record.otherAllowance.toString(),
      overtimeHours: record.overtimeHours.toString(),
      overtimeRate: record.overtimeRate.toString(),
      deductions: record.deductions.toString()
    });
    setEditModalVisible(true);
  };

  const openViewModal = (record) => {
    setSelectedRecord(record);
    setViewModalVisible(true);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not paid yet';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getMonthName = (month) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month];
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'paid': { color: 'success', icon: cilCheckCircle, text: 'Paid' },
      'pending': { color: 'warning', icon: cilClock, text: 'Pending' },
      'failed': { color: 'danger', icon: cilXCircle, text: 'Failed' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <CBadge color={config.color} className="d-flex align-items-center gap-1">
        <CIcon icon={config.icon} size="sm" />
        {config.text}
      </CBadge>
    );
  };

  const getStatusColor = (status) => {
    const colors = {
      'paid': 'success',
      'pending': 'warning',
      'failed': 'danger'
    };
    return colors[status] || 'secondary';
  };

  const filteredPayroll = payrollRecords.filter(record => 
    record.month === selectedMonth && record.year === selectedYear
  );

  const totalPayroll = filteredPayroll.reduce((sum, record) => sum + record.netSalary, 0);
  const totalEmployees = filteredPayroll.length;
  const paidCount = filteredPayroll.filter(record => record.status === 'paid').length;
  const pendingCount = filteredPayroll.filter(record => record.status === 'pending').length;

  // Show loading state
  if (isLoading) {
    return <LoadingSpinner text="Loading payroll data..." />;
  }

  // Show error state
  if (error) {
    return (
      <ErrorDisplay 
        error={error}
        onRetry={() => dispatch(fetchEmployees())}
        title="Failed to load payroll data"
      />
    );
  }

  return (
    <div className="payroll-management-container">
      {/* Header Section */}
      <div className="mb-4">
        <h2 className="mb-3">
          <CIcon icon={cilMoney} className="me-2 text-primary" />
          Payroll Management
        </h2>
        <p className="text-muted mb-0">
          Manage employee payroll, process payments, and track salary disbursements
        </p>
      </div>

      {/* Month/Year Selector */}
      <CRow className="mb-4">
        <CCol md={6}>
          <div className="d-flex gap-3 align-items-center">
            <div>
              <label className="form-label">Month</label>
              <CFormSelect
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i} value={i}>{getMonthName(i)}</option>
                ))}
              </CFormSelect>
            </div>
            <div>
              <label className="form-label">Year</label>
              <CFormSelect
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              >
                {Array.from({ length: 5 }, (_, i) => {
                  const year = new Date().getFullYear() - 2 + i;
                  return <option key={year} value={year}>{year}</option>;
                })}
              </CFormSelect>
            </div>
          </div>
        </CCol>
      </CRow>

      {/* Summary Cards */}
      <CRow className="mb-4">
        <CCol xs={12} md={3}>
          <CCard className="summary-card h-100 border-0 shadow-sm">
            <CCardBody className="text-center p-4">
              <div className="mb-3">
                <CIcon icon={cilUser} size="2xl" className="text-primary" />
              </div>
              <h4 className="mb-2">{totalEmployees}</h4>
              <p className="text-muted mb-0">Total Employees</p>
            </CCardBody>
          </CCard>
        </CCol>
        
        <CCol xs={12} md={3}>
          <CCard className="summary-card h-100 border-0 shadow-sm">
            <CCardBody className="text-center p-4">
              <div className="mb-3">
                <CIcon icon={cilCalculator} size="2xl" className="text-success" />
              </div>
              <h4 className="mb-2">{formatCurrency(totalPayroll)}</h4>
              <p className="text-muted mb-0">Total Payroll</p>
            </CCardBody>
          </CCard>
        </CCol>
        
        <CCol xs={12} md={3}>
          <CCard className="summary-card h-100 border-0 shadow-sm">
            <CCardBody className="text-center p-4">
              <div className="mb-3">
                <CIcon icon={cilCheckCircle} size="2xl" className="text-success" />
              </div>
              <h4 className="mb-2">{paidCount}</h4>
              <p className="text-muted mb-0">Paid</p>
            </CCardBody>
          </CCard>
        </CCol>
        
        <CCol xs={12} md={3}>
          <CCard className="summary-card h-100 border-0 shadow-sm">
            <CCardBody className="text-center p-4">
              <div className="mb-3">
                <CIcon icon={cilClock} size="2xl" className="text-warning" />
              </div>
              <h4 className="mb-2">{pendingCount}</h4>
              <p className="text-muted mb-0">Pending</p>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Progress Bar */}
      {totalEmployees > 0 && (
        <CRow className="mb-4">
          <CCol xs={12}>
            <CCard className="border-0 shadow-sm">
              <CCardBody>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="mb-0">Payment Progress</h6>
                  <span className="text-muted">{paidCount} of {totalEmployees} completed</span>
                </div>
                <CProgress 
                  value={(paidCount / totalEmployees) * 100} 
                  color="success" 
                  className="mb-2"
                />
                <div className="d-flex justify-content-between">
                  <small className="text-muted">0%</small>
                  <small className="text-muted">100%</small>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      )}

      {/* Action Buttons */}
      <div className="mb-4">
        <CButton 
          color="primary" 
          onClick={() => setCreateModalVisible(true)}
          className="me-2"
        >
          <CIcon icon={cilPlus} className="me-2" />
          Create Payroll Record
        </CButton>
      </div>

      {/* Alerts */}
      {alertVisible && errorMessage && (
        <CAlert color="danger" dismissible onClose={() => setAlertVisible(false)}>
          {errorMessage}
        </CAlert>
      )}
      
      {successAlertVisible && successMessage && (
        <CAlert color="success" dismissible onClose={() => setSuccessAlertVisible(false)}>
          {successMessage}
        </CAlert>
      )}

      {/* Payroll Table */}
      <CCard className="border-0 shadow-sm">
        <CCardHeader className="bg-white border-bottom">
          <h5 className="mb-0">
            <CIcon icon={cilMoney} className="me-2" />
            Payroll Records - {getMonthName(selectedMonth)} {selectedYear}
          </h5>
        </CCardHeader>
        <CCardBody className="p-0">
          <div className="table-responsive">
            <CTable hover className="mb-0">
              <CTableHead className="bg-light">
                <CTableRow>
                  <CTableHeaderCell className="border-0">Employee</CTableHeaderCell>
                  <CTableHeaderCell className="border-0">Basic Salary</CTableHeaderCell>
                  <CTableHeaderCell className="border-0">Allowances</CTableHeaderCell>
                  <CTableHeaderCell className="border-0">Overtime</CTableHeaderCell>
                  <CTableHeaderCell className="border-0">Deductions</CTableHeaderCell>
                  <CTableHeaderCell className="border-0">Net Salary</CTableHeaderCell>
                  <CTableHeaderCell className="border-0">Status</CTableHeaderCell>
                  <CTableHeaderCell className="border-0">Payment Date</CTableHeaderCell>
                  <CTableHeaderCell className="border-0 text-center">Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredPayroll.length === 0 ? (
                  <CTableRow>
                    <CTableDataCell colSpan="9" className="text-center py-4">
                      <div className="text-muted">
                        <CIcon icon={cilMoney} size="2xl" className="mb-2" />
                        <p>No payroll records found for {getMonthName(selectedMonth)} {selectedYear}</p>
                      </div>
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  filteredPayroll.map((record) => (
                    <CTableRow key={record.id} className="align-middle">
                      <CTableDataCell>
                        <div className="fw-semibold">{record.employee}</div>
                      </CTableDataCell>
                      
                      <CTableDataCell>
                        <div className="text-primary fw-bold">
                          {formatCurrency(record.basicSalary)}
                        </div>
                      </CTableDataCell>
                      
                      <CTableDataCell>
                        <div className="text-success">
                          +{formatCurrency(record.housingAllowance + record.transportAllowance + record.otherAllowance)}
                        </div>
                      </CTableDataCell>
                      
                      <CTableDataCell>
                        <div className="text-info">
                          {record.overtimeHours}h × {formatCurrency(record.overtimeRate)} = {formatCurrency(record.overtimePay)}
                        </div>
                      </CTableDataCell>
                      
                      <CTableDataCell>
                        <div className="text-danger">
                          -{formatCurrency(record.deductions)}
                        </div>
                      </CTableDataCell>
                      
                      <CTableDataCell>
                        <div className="fw-bold text-dark">
                          {formatCurrency(record.netSalary)}
                        </div>
                      </CTableDataCell>
                      
                      <CTableDataCell>
                        {getStatusBadge(record.status)}
                      </CTableDataCell>
                      
                      <CTableDataCell>
                        <div className="small">
                          {formatDate(record.paymentDate)}
                        </div>
                      </CTableDataCell>
                      
                      <CTableDataCell className="text-center">
                        <div className="d-flex gap-2 justify-content-center">
                          <CButton
                            color="outline-info"
                            size="sm"
                            onClick={() => openViewModal(record)}
                            className="action-btn"
                          >
                            <CIcon icon={cilEye} className="me-1" />
                            View
                          </CButton>
                          
                          <CButton
                            color="outline-warning"
                            size="sm"
                            onClick={() => openEditModal(record)}
                            className="action-btn"
                          >
                            <CIcon icon={cilPencil} className="me-1" />
                            Edit
                          </CButton>
                          
                          <CDropdown>
                            <CDropdownToggle color="outline-secondary" size="sm">
                              <CIcon icon={cilBank} className="me-1" />
                              Status
                            </CDropdownToggle>
                            <CDropdownMenu>
                              <CDropdownItem onClick={() => handleStatusChange(record.id, 'paid')}>
                                Mark as Paid
                              </CDropdownItem>
                              <CDropdownItem onClick={() => handleStatusChange(record.id, 'pending')}>
                                Mark as Pending
                              </CDropdownItem>
                              <CDropdownItem onClick={() => handleStatusChange(record.id, 'failed')}>
                                Mark as Failed
                              </CDropdownItem>
                            </CDropdownMenu>
                          </CDropdown>
                          
                          <CButton
                            color="outline-danger"
                            size="sm"
                            onClick={() => handleDeletePayroll(record.id)}
                            className="action-btn"
                          >
                            <CIcon icon={cilTrash} className="me-1" />
                            Delete
                          </CButton>
                        </div>
                      </CTableDataCell>
                    </CTableRow>
                  ))
                )}
              </CTableBody>
            </CTable>
          </div>
        </CCardBody>
      </CCard>

      {/* Create Payroll Modal */}
      <CModal 
        visible={createModalVisible} 
        onClose={() => setCreateModalVisible(false)}
        size="lg"
      >
        <CModalHeader closeButton>
          <CModalTitle>
            <CIcon icon={cilPlus} className="me-2" />
            Create New Payroll Record
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <CCol md={6}>
              <div className="mb-3">
                <label className="form-label">Employee</label>
                <CFormSelect
                  value={formData.employee}
                  onChange={(e) => updateField('employee', e.target.value)}
                  className={errors.employee ? 'is-invalid' : ''}
                >
                  <option value="">Select Employee</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.first_name} {emp.last_name}
                    </option>
                  ))}
                </CFormSelect>
                {errors.employee && <div className="invalid-feedback">{errors.employee}</div>}
              </div>
            </CCol>
            
            <CCol md={3}>
              <div className="mb-3">
                <label className="form-label">Month</label>
                <CFormSelect
                  value={formData.month}
                  onChange={(e) => updateField('month', parseInt(e.target.value))}
                  className={errors.month ? 'is-invalid' : ''}
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i} value={i}>{getMonthName(i)}</option>
                  ))}
                </CFormSelect>
                {errors.month && <div className="invalid-feedback">{errors.month}</div>}
              </div>
            </CCol>
            
            <CCol md={3}>
              <div className="mb-3">
                <label className="form-label">Year</label>
                <CFormInput
                  type="number"
                  value={formData.year}
                  onChange={(e) => updateField('year', parseInt(e.target.value))}
                  className={errors.year ? 'is-invalid' : ''}
                  min="2020"
                  max="2030"
                />
                {errors.year && <div className="invalid-feedback">{errors.year}</div>}
              </div>
            </CCol>
          </CRow>
          
          <CRow>
            <CCol md={6}>
              <div className="mb-3">
                <label className="form-label">Basic Salary</label>
                <CFormInput
                  type="number"
                  value={formData.basicSalary}
                  onChange={(e) => updateField('basicSalary', e.target.value)}
                  className={errors.basicSalary ? 'is-invalid' : ''}
                  placeholder="Enter basic salary"
                />
                {errors.basicSalary && <div className="invalid-feedback">{errors.basicSalary}</div>}
              </div>
            </CCol>
            
            <CCol md={6}>
              <div className="mb-3">
                <label className="form-label">Deductions</label>
                <CFormInput
                  type="number"
                  value={formData.deductions}
                  onChange={(e) => updateField('deductions', e.target.value)}
                  placeholder="Enter deductions"
                />
              </div>
            </CCol>
          </CRow>
          
          <CRow>
            <CCol md={4}>
              <div className="mb-3">
                <label className="form-label">Housing Allowance</label>
                <CFormInput
                  type="number"
                  value={formData.housingAllowance}
                  onChange={(e) => updateField('housingAllowance', e.target.value)}
                  placeholder="Enter housing allowance"
                />
              </div>
            </CCol>
            
            <CCol md={4}>
              <div className="mb-3">
                <label className="form-label">Transport Allowance</label>
                <CFormInput
                  type="number"
                  value={formData.transportAllowance}
                  onChange={(e) => updateField('transportAllowance', e.target.value)}
                  placeholder="Enter transport allowance"
                />
              </div>
            </CCol>
            
            <CCol md={4}>
              <div className="mb-3">
                <label className="form-label">Other Allowance</label>
                <CFormInput
                  type="number"
                  value={formData.otherAllowance}
                  onChange={(e) => updateField('otherAllowance', e.target.value)}
                  placeholder="Enter other allowance"
                />
              </div>
            </CCol>
          </CRow>
          
          <CRow>
            <CCol md={6}>
              <div className="mb-3">
                <label className="form-label">Overtime Hours</label>
                <CFormInput
                  type="number"
                  value={formData.overtimeHours}
                  onChange={(e) => updateField('overtimeHours', e.target.value)}
                  placeholder="Enter overtime hours"
                  step="0.5"
                />
              </div>
            </CCol>
            
            <CCol md={6}>
              <div className="mb-3">
                <label className="form-label">Overtime Rate</label>
                <CFormInput
                  type="number"
                  value={formData.overtimeRate}
                  onChange={(e) => updateField('overtimeRate', e.target.value)}
                  placeholder="Enter overtime rate per hour"
                />
              </div>
            </CCol>
          </CRow>
          
          <div className="text-center p-3 bg-light rounded">
            <h6 className="mb-2">Calculated Net Salary</h6>
            <h4 className="text-success mb-0">{formatCurrency(calculateNetSalary())}</h4>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setCreateModalVisible(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleCreatePayroll}>
            Create Payroll
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Edit Payroll Modal */}
      <CModal 
        visible={editModalVisible} 
        onClose={() => setEditModalVisible(false)}
        size="lg"
      >
        <CModalHeader closeButton>
          <CModalTitle>
            <CIcon icon={cilPencil} className="me-2" />
            Edit Payroll Record
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <CCol md={6}>
              <div className="mb-3">
                <label className="form-label">Employee</label>
                <CFormInput
                  value={editingRecord?.employee || ''}
                  disabled
                  className="bg-light"
                />
              </div>
            </CCol>
            
            <CCol md={3}>
              <div className="mb-3">
                <label className="form-label">Month</label>
                <CFormSelect
                  value={formData.month}
                  onChange={(e) => updateField('month', parseInt(e.target.value))}
                  className={errors.month ? 'is-invalid' : ''}
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i} value={i}>{getMonthName(i)}</option>
                  ))}
                </CFormSelect>
                {errors.month && <div className="invalid-feedback">{errors.month}</div>}
              </div>
            </CCol>
            
            <CCol md={3}>
              <div className="mb-3">
                <label className="form-label">Year</label>
                <CFormInput
                  type="number"
                  value={formData.year}
                  onChange={(e) => updateField('year', parseInt(e.target.value))}
                  className={errors.year ? 'is-invalid' : ''}
                  min="2020"
                  max="2030"
                />
                {errors.year && <div className="invalid-feedback">{errors.year}</div>}
              </div>
            </CCol>
          </CRow>
          
          <CRow>
            <CCol md={6}>
              <div className="mb-3">
                <label className="form-label">Basic Salary</label>
                <CFormInput
                  type="number"
                  value={formData.basicSalary}
                  onChange={(e) => updateField('basicSalary', e.target.value)}
                  className={errors.basicSalary ? 'is-invalid' : ''}
                  placeholder="Enter basic salary"
                />
                {errors.basicSalary && <div className="invalid-feedback">{errors.basicSalary}</div>}
              </div>
            </CCol>
            
            <CCol md={6}>
              <div className="mb-3">
                <label className="form-label">Deductions</label>
                <CFormInput
                  type="number"
                  value={formData.deductions}
                  onChange={(e) => updateField('deductions', e.target.value)}
                  placeholder="Enter deductions"
                />
              </div>
            </CCol>
          </CRow>
          
          <CRow>
            <CCol md={4}>
              <div className="mb-3">
                <label className="form-label">Housing Allowance</label>
                <CFormInput
                  type="number"
                  value={formData.housingAllowance}
                  onChange={(e) => updateField('housingAllowance', e.target.value)}
                  placeholder="Enter housing allowance"
                />
              </div>
            </CCol>
            
            <CCol md={4}>
              <div className="mb-3">
                <label className="form-label">Transport Allowance</label>
                <CFormInput
                  type="number"
                  value={formData.transportAllowance}
                  onChange={(e) => updateField('transportAllowance', e.target.value)}
                  placeholder="Enter transport allowance"
                />
              </div>
            </CCol>
            
            <CCol md={4}>
              <div className="mb-3">
                <label className="form-label">Other Allowance</label>
                <CFormInput
                  type="number"
                  value={formData.otherAllowance}
                  onChange={(e) => updateField('otherAllowance', e.target.value)}
                  placeholder="Enter other allowance"
                />
              </div>
            </CCol>
          </CRow>
          
          <CRow>
            <CCol md={6}>
              <div className="mb-3">
                <label className="form-label">Overtime Hours</label>
                <CFormInput
                  type="number"
                  value={formData.overtimeHours}
                  onChange={(e) => updateField('overtimeHours', e.target.value)}
                  placeholder="Enter overtime hours"
                  step="0.5"
                />
              </div>
            </CCol>
            
            <CCol md={6}>
              <div className="mb-3">
                <label className="form-label">Overtime Rate</label>
                <CFormInput
                  type="number"
                  value={formData.overtimeRate}
                  onChange={(e) => updateField('overtimeRate', e.target.value)}
                  placeholder="Enter overtime rate per hour"
                />
              </div>
            </CCol>
          </CRow>
          
          <div className="text-center p-3 bg-light rounded">
            <h6 className="mb-2">Calculated Net Salary</h6>
            <h4 className="text-success mb-0">{formatCurrency(calculateNetSalary())}</h4>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setEditModalVisible(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleEditPayroll}>
            Update Payroll
          </CButton>
        </CModalFooter>
      </CModal>

      {/* View Payroll Modal */}
      <CModal 
        visible={viewModalVisible} 
        onClose={() => setViewModalVisible(false)}
        size="lg"
      >
        <CModalHeader closeButton>
          <CModalTitle>
            <CIcon icon={cilEye} className="me-2" />
            Payroll Details
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedRecord && (
            <CRow>
              <CCol md={6}>
                <h6>Employee Information</h6>
                <p><strong>Name:</strong> {selectedRecord.employee}</p>
                <p><strong>Period:</strong> {getMonthName(selectedRecord.month)} {selectedRecord.year}</p>
                <p><strong>Status:</strong> {getStatusBadge(selectedRecord.status)}</p>
                <p><strong>Payment Date:</strong> {formatDate(selectedRecord.paymentDate)}</p>
              </CCol>
              
              <CCol md={6}>
                <h6>Bank Details</h6>
                <p><strong>Account:</strong> {selectedRecord.bankAccount}</p>
              </CCol>
              
              <CCol md={12}>
                <h6>Salary Breakdown</h6>
                <div className="table-responsive">
                  <CTable bordered size="sm">
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>Component</CTableHeaderCell>
                        <CTableHeaderCell>Amount</CTableHeaderCell>
                        <CTableHeaderCell>Type</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      <CTableRow>
                        <CTableDataCell>Basic Salary</CTableDataCell>
                        <CTableDataCell>{formatCurrency(selectedRecord.basicSalary)}</CTableDataCell>
                        <CTableDataCell><CBadge color="primary">Base</CBadge></CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableDataCell>Housing Allowance</CTableDataCell>
                        <CTableDataCell>{formatCurrency(selectedRecord.housingAllowance)}</CTableDataCell>
                        <CTableDataCell><CBadge color="success">Allowance</CBadge></CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableDataCell>Transport Allowance</CTableDataCell>
                        <CTableDataCell>{formatCurrency(selectedRecord.transportAllowance)}</CTableDataCell>
                        <CTableDataCell><CBadge color="success">Allowance</CBadge></CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableDataCell>Other Allowance</CTableDataCell>
                        <CTableDataCell>{formatCurrency(selectedRecord.otherAllowance)}</CTableDataCell>
                        <CTableDataCell><CBadge color="success">Allowance</CBadge></CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableDataCell>Overtime Pay</CTableDataCell>
                        <CTableDataCell>{formatCurrency(selectedRecord.overtimePay)}</CTableDataCell>
                        <CTableDataCell><CBadge color="info">Overtime</CBadge></CTableDataCell>
                      </CTableRow>
                      <CTableRow className="table-danger">
                        <CTableDataCell>Deductions</CTableDataCell>
                        <CTableDataCell>-{formatCurrency(selectedRecord.deductions)}</CTableDataCell>
                        <CTableDataCell><CBadge color="danger">Deduction</CBadge></CTableDataCell>
                      </CTableRow>
                      <CTableRow className="table-success fw-bold">
                        <CTableDataCell>Net Salary</CTableDataCell>
                        <CTableDataCell>{formatCurrency(selectedRecord.netSalary)}</CTableDataCell>
                        <CTableDataCell><CBadge color="success">Final</CBadge></CTableDataCell>
                      </CTableRow>
                    </CTableBody>
                  </CTable>
                </div>
              </CCol>
            </CRow>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setViewModalVisible(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default Payroll;

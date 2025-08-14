import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  CTable,
  CTableBody,
  CTableRow,
  CTableDataCell,
  CTableHeaderCell,
  CTableHead,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CModalFooter,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CCol,
  CFormInput,
  CFormSelect,
  CAlert,
  CBadge,
  CSpinner
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { 
  cilMoney, 
  cilPlus, 
  cilPencil, 
  cilTrash, 
  cilSearch,
  cilBank,
  cilCalculator,
  cilUser,
  cilSettings,
  cilCheck
} from '@coreui/icons';
import { fetchEmployees } from '../../store/slices/employeeSlice';
import { selectEmployees, selectEmployeesLoading, selectEmployeesError } from '../../store/slices/employeeSlice';
import { selectIsAuthenticated } from '../../store/slices/authSlice';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorDisplay from '../../components/common/ErrorDisplay';
import { useReduxOperations, useFormState } from '../../hooks/useReduxOperations';

const Salary = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { checkAuth, handleApiError } = useReduxOperations();
  
  // Redux state
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const employees = useSelector(selectEmployees);
  const isLoading = useSelector(selectEmployeesLoading);
  const error = useSelector(selectEmployeesError);
  
  // Local state
  const [salary, setSalary] = useState([]);
  const [selectedEmployeeSalary, setSelectedEmployeeSalary] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [successAlertVisible, setSuccessAlertVisible] = useState(false);
  const [editAlertVisible, setEditAlertVisible] = useState(false);
  const [editSuccessAlertVisible, setEditSuccessAlertVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [editErrorMessage, setEditErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [editSuccessMessage, setEditSuccessMessage] = useState(null);

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
    basicSalary: '',
    housingAllowance: '',
    transportAllowance: '',
    otherAllowance: '',
    bankName: '',
    accountNo: '',
    iban: '',
    swiftCode: ''
  });

  useEffect(() => {
    if (!checkAuth()) return;
    
    dispatch(fetchEmployees());
    fetchSalaries();
  }, [dispatch, checkAuth]);

  // Timer for alerts
  useEffect(() => {
    let timer;
    if (editAlertVisible || editSuccessAlertVisible || alertVisible || successAlertVisible) {
      timer = setTimeout(() => {
        setEditAlertVisible(false);
        setEditSuccessAlertVisible(false);
        setAlertVisible(false);
        setSuccessAlertVisible(false);
      }, 10000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [editAlertVisible, editSuccessAlertVisible, alertVisible, successAlertVisible]);

  const fetchSalaries = async () => {
    try {
      // This would be replaced with actual Redux action
      // For now, using mock data
      const mockSalaries = [
        {
          id: 1,
          employee: 'John Doe',
          basicSalary: 5000,
          housingAllowance: 800,
          transportAllowance: 500,
          otherAllowance: 200,
          grossSalary: 6500,
          bankName: 'Chase Bank',
          accountNo: '1234567890',
          status: 'active'
        },
        {
          id: 2,
          employee: 'Jane Smith',
          basicSalary: 5500,
          housingAllowance: 900,
          transportAllowance: 600,
          otherAllowance: 250,
          grossSalary: 7250,
          bankName: 'Wells Fargo',
          accountNo: '0987654321',
          status: 'active'
        }
      ];
      setSalary(mockSalaries);
    } catch (error) {
      setErrorMessage('Failed to fetch salaries');
    }
  };

  const calculateGrossSalary = () => {
    const basic = parseFloat(formData.basicSalary) || 0;
    const housing = parseFloat(formData.housingAllowance) || 0;
    const transport = parseFloat(formData.transportAllowance) || 0;
    const other = parseFloat(formData.otherAllowance) || 0;
    return basic + housing + transport + other;
  };

  const handleCreateSalary = async () => {
    clearErrors();
    
    // Validation
    if (!formData.basicSalary) {
      setFieldError('basicSalary', 'Basic salary is required');
      return;
    }
    if (!selectedEmployee) {
      setErrorMessage('Please select an employee');
      return;
    }

    try {
      // This would be replaced with actual Redux action
      const newSalary = {
        id: Date.now(),
        employee: selectedEmployee,
        basicSalary: parseFloat(formData.basicSalary),
        housingAllowance: parseFloat(formData.housingAllowance) || 0,
        transportAllowance: parseFloat(formData.transportAllowance) || 0,
        otherAllowance: parseFloat(formData.otherAllowance) || 0,
        grossSalary: calculateGrossSalary(),
        bankName: formData.bankName,
        accountNo: formData.accountNo,
        iban: formData.iban,
        swiftCode: formData.swiftCode,
        status: 'active'
      };
      
      setSalary(prev => [...prev, newSalary]);
      setSuccessMessage('Salary created successfully');
      setSuccessAlertVisible(true);
      setCreateModalVisible(false);
      resetForm();
      setSelectedEmployee('');
    } catch (error) {
      setErrorMessage(handleApiError(error, 'Failed to create salary'));
      setAlertVisible(true);
    }
  };

  const handleEditSalary = async () => {
    clearErrors();
    
    if (!formData.basicSalary) {
      setFieldError('basicSalary', 'Basic salary is required');
      return;
    }

    try {
      // This would be replaced with actual Redux action
      const updatedSalary = {
        ...selectedRecord,
        basicSalary: parseFloat(formData.basicSalary),
        housingAllowance: parseFloat(formData.housingAllowance) || 0,
        transportAllowance: parseFloat(formData.transportAllowance) || 0,
        otherAllowance: parseFloat(formData.otherAllowance) || 0,
        grossSalary: calculateGrossSalary(),
        bankName: formData.bankName,
        accountNo: formData.accountNo,
        iban: formData.iban,
        swiftCode: formData.swiftCode
      };
      
      setSalary(prev => prev.map(s => s.id === selectedRecord.id ? updatedSalary : s));
      setEditSuccessMessage('Salary updated successfully');
      setEditSuccessAlertVisible(true);
      setEditModalVisible(false);
      setSelectedRecord(null);
      resetForm();
    } catch (error) {
      setEditErrorMessage(handleApiError(error, 'Failed to update salary'));
      setEditAlertVisible(true);
    }
  };

  const handleDeleteSalary = async (salaryId) => {
    if (window.confirm('Are you sure you want to delete this salary record?')) {
      try {
        // This would be replaced with actual Redux action
        setSalary(prev => prev.filter(s => s.id !== salaryId));
        setSuccessMessage('Salary deleted successfully');
        setSuccessAlertVisible(true);
      } catch (error) {
        setErrorMessage(handleApiError(error, 'Failed to delete salary'));
        setAlertVisible(true);
      }
    }
  };

  const openEditModal = (record) => {
    setSelectedRecord(record);
    updateFields({
      basicSalary: record.basicSalary.toString(),
      housingAllowance: record.housingAllowance.toString(),
      transportAllowance: record.transportAllowance.toString(),
      otherAllowance: record.otherAllowance.toString(),
      bankName: record.bankName || '',
      accountNo: record.accountNo || '',
      iban: record.iban || '',
      swiftCode: record.swiftCode || ''
    });
    setEditModalVisible(true);
  };

  const openViewModal = (record) => {
    setSelectedEmployeeSalary(record);
    setModalVisible(true);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  const getStatusBadge = (status) => {
    return (
      <CBadge color="success" className="d-flex align-items-center gap-1">
        <CIcon icon={cilCheck} size="sm" />
        Active
      </CBadge>
    );
  };

  // Show loading state
  if (isLoading) {
    return <LoadingSpinner text="Loading salary data..." />;
  }

  // Show error state
  if (error) {
    return (
      <ErrorDisplay 
        error={error}
        onRetry={() => dispatch(fetchEmployees())}
        title="Failed to load salary data"
      />
    );
  }

  return (
    <div className="salary-management-container">
      {/* Header Section */}
      <div className="mb-4">
        <h2 className="mb-3">
          <CIcon icon={cilMoney} className="me-2 text-primary" />
          Salary Management
        </h2>
        <p className="text-muted mb-0">
          Manage employee salaries, allowances, and banking information
        </p>
      </div>

      {/* Summary Cards */}
      <CRow className="mb-4">
        <CCol xs={12} md={3}>
          <CCard className="summary-card h-100 border-0 shadow-sm">
            <CCardBody className="text-center p-4">
              <div className="mb-3">
                <CIcon icon={cilUser} size="2xl" className="text-primary" />
              </div>
              <h4 className="mb-2">{salary.length}</h4>
              <p className="text-muted mb-0">Total Salaries</p>
            </CCardBody>
          </CCard>
        </CCol>
        
        <CCol xs={12} md={3}>
          <CCard className="summary-card h-100 border-0 shadow-sm">
            <CCardBody className="text-center p-4">
              <div className="mb-3">
                <CIcon icon={cilCalculator} size="2xl" className="text-success" />
              </div>
              <h4 className="mb-2">
                {formatCurrency(salary.reduce((sum, s) => sum + s.grossSalary, 0))}
              </h4>
              <p className="text-muted mb-0">Total Payroll</p>
            </CCardBody>
          </CCard>
        </CCol>
        
        <CCol xs={12} md={3}>
          <CCard className="summary-card h-100 border-0 shadow-sm">
            <CCardBody className="text-center p-4">
              <div className="mb-3">
                <CIcon icon={cilMoney} size="2xl" className="text-info" />
              </div>
              <h4 className="mb-2">
                {formatCurrency(salary.reduce((sum, s) => sum + s.basicSalary, 0))}
              </h4>
              <p className="text-muted mb-0">Total Basic Salary</p>
            </CCardBody>
          </CCard>
        </CCol>
        
        <CCol xs={12} md={3}>
          <CCard className="summary-card h-100 border-0 shadow-sm">
            <CCardBody className="text-center p-4">
              <div className="mb-3">
                <CIcon icon={cilBank} size="2xl" className="text-warning" />
              </div>
              <h4 className="mb-2">
                {formatCurrency(salary.reduce((sum, s) => sum + (s.housingAllowance + s.transportAllowance + s.otherAllowance), 0))}
              </h4>
              <p className="text-muted mb-0">Total Allowances</p>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Action Buttons */}
      <div className="mb-4">
        <CButton 
          color="primary" 
          onClick={() => setCreateModalVisible(true)}
          className="me-2"
        >
          <CIcon icon={cilPlus} className="me-2" />
          Create New Salary
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
      
      {editAlertVisible && editErrorMessage && (
        <CAlert color="danger" dismissible onClose={() => setEditAlertVisible(false)}>
          {editErrorMessage}
        </CAlert>
      )}
      
      {editSuccessAlertVisible && editSuccessMessage && (
        <CAlert color="success" dismissible onClose={() => setEditSuccessAlertVisible(false)}>
          {editSuccessMessage}
        </CAlert>
      )}

      {/* Salary Table */}
      <CCard className="border-0 shadow-sm">
        <CCardHeader className="bg-white border-bottom">
          <h5 className="mb-0">
            <CIcon icon={cilMoney} className="me-2" />
            Salary Records
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
                  <CTableHeaderCell className="border-0">Gross Salary</CTableHeaderCell>
                  <CTableHeaderCell className="border-0">Bank Details</CTableHeaderCell>
                  <CTableHeaderCell className="border-0">Status</CTableHeaderCell>
                  <CTableHeaderCell className="border-0 text-center">Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {salary.map((record) => (
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
                      <div className="fw-bold text-dark">
                        {formatCurrency(record.grossSalary)}
                      </div>
                    </CTableDataCell>
                    
                    <CTableDataCell>
                      <div className="small text-muted">
                        {record.bankName}<br />
                        <small>Acc: {record.accountNo}</small>
                      </div>
                    </CTableDataCell>
                    
                    <CTableDataCell>
                      {getStatusBadge(record.status)}
                    </CTableDataCell>
                    
                    <CTableDataCell className="text-center">
                      <div className="d-flex gap-2 justify-content-center">
                        <CButton
                          color="outline-info"
                          size="sm"
                          onClick={() => openViewModal(record)}
                          className="action-btn"
                        >
                          <CIcon icon={cilSearch} className="me-1" />
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
                        
                        <CButton
                          color="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteSalary(record.id)}
                          className="action-btn"
                        >
                          <CIcon icon={cilTrash} className="me-1" />
                          Delete
                        </CButton>
                      </div>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </div>
        </CCardBody>
      </CCard>

      {/* Create Salary Modal */}
      <CModal 
        visible={createModalVisible} 
        onClose={() => setCreateModalVisible(false)}
        size="lg"
      >
        <CModalHeader closeButton>
          <CModalTitle>
            <CIcon icon={cilPlus} className="me-2" />
            Create New Salary Record
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <CCol md={6}>
              <div className="mb-3">
                <label className="form-label">Employee</label>
                <CFormSelect
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
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
                <label className="form-label">Bank Name</label>
                <CFormInput
                  value={formData.bankName}
                  onChange={(e) => updateField('bankName', e.target.value)}
                  placeholder="Enter bank name"
                />
              </div>
            </CCol>
            
            <CCol md={6}>
              <div className="mb-3">
                <label className="form-label">Account Number</label>
                <CFormInput
                  value={formData.accountNo}
                  onChange={(e) => updateField('accountNo', e.target.value)}
                  placeholder="Enter account number"
                />
              </div>
            </CCol>
          </CRow>
          
          <CRow>
            <CCol md={6}>
              <div className="mb-3">
                <label className="form-label">IBAN</label>
                <CFormInput
                  value={formData.iban}
                  onChange={(e) => updateField('iban', e.target.value)}
                  placeholder="Enter IBAN"
                />
              </div>
            </CCol>
            
            <CCol md={6}>
              <div className="mb-3">
                <label className="form-label">SWIFT Code</label>
                <CFormInput
                  value={formData.swiftCode}
                  onChange={(e) => updateField('swiftCode', e.target.value)}
                  placeholder="Enter SWIFT code"
                />
              </div>
            </CCol>
          </CRow>
          
          <div className="text-center p-3 bg-light rounded">
            <h6 className="mb-2">Calculated Gross Salary</h6>
            <h4 className="text-success mb-0">{formatCurrency(calculateGrossSalary())}</h4>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setCreateModalVisible(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleCreateSalary}>
            Create Salary
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Edit Salary Modal */}
      <CModal 
        visible={editModalVisible} 
        onClose={() => setEditModalVisible(false)}
        size="lg"
      >
        <CModalHeader closeButton>
          <CModalTitle>
            <CIcon icon={cilPencil} className="me-2" />
            Edit Salary Record
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <CCol md={6}>
              <div className="mb-3">
                <label className="form-label">Employee</label>
                <CFormInput
                  value={selectedRecord?.employee || ''}
                  disabled
                  className="bg-light"
                />
              </div>
            </CCol>
            
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
                <label className="form-label">Bank Name</label>
                <CFormInput
                  value={formData.bankName}
                  onChange={(e) => updateField('bankName', e.target.value)}
                  placeholder="Enter bank name"
                />
              </div>
            </CCol>
            
            <CCol md={6}>
              <div className="mb-3">
                <label className="form-label">Account Number</label>
                <CFormInput
                  value={formData.accountNo}
                  onChange={(e) => updateField('accountNo', e.target.value)}
                  placeholder="Enter account number"
                />
              </div>
            </CCol>
          </CRow>
          
          <CRow>
            <CCol md={6}>
              <div className="mb-3">
                <label className="form-label">IBAN</label>
                <CFormInput
                  value={formData.iban}
                  onChange={(e) => updateField('iban', e.target.value)}
                  placeholder="Enter IBAN"
                />
              </div>
            </CCol>
            
            <CCol md={6}>
              <div className="mb-3">
                <label className="form-label">SWIFT Code</label>
                <CFormInput
                  value={formData.swiftCode}
                  onChange={(e) => updateField('swiftCode', e.target.value)}
                  placeholder="Enter SWIFT code"
                />
              </div>
            </CCol>
          </CRow>
          
          <div className="text-center p-3 bg-light rounded">
            <h6 className="mb-2">Calculated Gross Salary</h6>
            <h4 className="text-success mb-0">{formatCurrency(calculateGrossSalary())}</h4>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setEditModalVisible(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleEditSalary}>
            Update Salary
          </CButton>
        </CModalFooter>
      </CModal>

      {/* View Salary Modal */}
      <CModal 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)}
        size="lg"
      >
        <CModalHeader closeButton>
          <CModalTitle>
            <CIcon icon={cilSearch} className="me-2" />
            Salary Details
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedEmployeeSalary && (
            <CRow>
              <CCol md={6}>
                <h6>Employee Information</h6>
                <p><strong>Name:</strong> {selectedEmployeeSalary.employee}</p>
                <p><strong>Status:</strong> {getStatusBadge(selectedEmployeeSalary.status)}</p>
              </CCol>
              
              <CCol md={6}>
                <h6>Salary Breakdown</h6>
                <p><strong>Basic Salary:</strong> {formatCurrency(selectedEmployeeSalary.basicSalary)}</p>
                <p><strong>Housing Allowance:</strong> {formatCurrency(selectedEmployeeSalary.housingAllowance)}</p>
                <p><strong>Transport Allowance:</strong> {formatCurrency(selectedEmployeeSalary.transportAllowance)}</p>
                <p><strong>Other Allowance:</strong> {formatCurrency(selectedEmployeeSalary.otherAllowance)}</p>
                <p><strong>Gross Salary:</strong> {formatCurrency(selectedEmployeeSalary.grossSalary)}</p>
              </CCol>
              
              <CCol md={12}>
                <h6>Banking Information</h6>
                <p><strong>Bank:</strong> {selectedEmployeeSalary.bankName}</p>
                <p><strong>Account Number:</strong> {selectedEmployeeSalary.accountNo}</p>
                {selectedEmployeeSalary.iban && <p><strong>IBAN:</strong> {selectedEmployeeSalary.iban}</p>}
                {selectedEmployeeSalary.swiftCode && <p><strong>SWIFT Code:</strong> {selectedEmployeeSalary.swiftCode}</p>}
              </CCol>
            </CRow>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalVisible(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default Salary;

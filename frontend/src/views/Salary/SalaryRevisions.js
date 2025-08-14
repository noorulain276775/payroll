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
  CSpinner
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {
  cilMoney,
  cilPlus,
  cilPencil,
  cilTrash,
  cilSearch,
  cilCalculator,
  cilUser,
  cilHistory,
  cilCheck
} from '@coreui/icons';
import { fetchEmployees } from '../../store/slices/employeeSlice';
import { selectEmployees, selectEmployeesLoading, selectEmployeesError } from '../../store/slices/employeeSlice';
import { selectIsAuthenticated } from '../../store/slices/authSlice';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorDisplay from '../../components/common/ErrorDisplay';
import { useReduxOperations, useFormState } from '../../hooks/useReduxOperations';

const SalaryRevisions = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { checkAuth, handleApiError } = useReduxOperations();
  
  // Redux state
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const employees = useSelector(selectEmployees);
  const isLoading = useSelector(selectEmployeesLoading);
  const error = useSelector(selectEmployeesError);
  
  // Local state
  const [salaryRevisions, setSalaryRevisions] = useState([]);
  const [alertVisible, setAlertVisible] = useState(false);
  const [successAlertVisible, setSuccessAlertVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedRevision, setSelectedRevision] = useState(null);
  const [editingRevision, setEditingRevision] = useState(null);

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
    basicSalary: '',
    housingAllowance: '',
    transportAllowance: '',
    otherAllowance: '',
    reason: '',
    effectiveOn: ''
  });

  useEffect(() => {
    if (!checkAuth()) return;
    
    dispatch(fetchEmployees());
    fetchData();
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

  const fetchData = async () => {
    try {
      // This would be replaced with actual Redux action
      // For now, using mock data
      const mockRevisions = [
        {
          id: 1,
          employee: 'John Doe',
          previousBasicSalary: 5000,
          newBasicSalary: 5500,
          previousHousingAllowance: 800,
          newHousingAllowance: 900,
          previousTransportAllowance: 500,
          newTransportAllowance: 600,
          previousOtherAllowance: 200,
          newOtherAllowance: 250,
          previousGrossSalary: 6500,
          newGrossSalary: 7250,
          reason: 'Annual Performance Review - Promotion',
          effectiveOn: '2024-02-01',
          status: 'active',
          revisionDate: '2024-01-15'
        },
        {
          id: 2,
          employee: 'Jane Smith',
          previousBasicSalary: 4500,
          newBasicSalary: 5000,
          previousHousingAllowance: 700,
          newHousingAllowance: 800,
          previousTransportAllowance: 400,
          newTransportAllowance: 500,
          previousOtherAllowance: 150,
          newOtherAllowance: 200,
          previousGrossSalary: 5750,
          newGrossSalary: 6500,
          reason: 'Mid-year Salary Adjustment',
          effectiveOn: '2023-08-01',
          status: 'active',
          revisionDate: '2023-07-01'
        }
      ];
      setSalaryRevisions(mockRevisions);
    } catch (error) {
      setErrorMessage('Failed to fetch salary revisions');
      setAlertVisible(true);
    }
  };

  const calculateGrossSalary = () => {
    const basic = parseFloat(formData.basicSalary) || 0;
    const housing = parseFloat(formData.housingAllowance) || 0;
    const transport = parseFloat(formData.transportAllowance) || 0;
    const other = parseFloat(formData.otherAllowance) || 0;
    return basic + housing + transport + other;
  };

  const handleCreateRevision = async () => {
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
    if (!formData.reason) {
      setFieldError('reason', 'Reason is required');
      return;
    }
    if (!formData.effectiveOn) {
      setFieldError('effectiveOn', 'Effective date is required');
      return;
    }

    try {
      // This would be replaced with actual Redux action
      const newRevision = {
        id: Date.now(),
        employee: formData.employee,
        previousBasicSalary: 0, // Would get from current salary
        newBasicSalary: parseFloat(formData.basicSalary),
        previousHousingAllowance: 0,
        newHousingAllowance: parseFloat(formData.housingAllowance) || 0,
        previousTransportAllowance: 0,
        newTransportAllowance: parseFloat(formData.transportAllowance) || 0,
        previousOtherAllowance: 0,
        newOtherAllowance: parseFloat(formData.otherAllowance) || 0,
        previousGrossSalary: 0,
        newGrossSalary: calculateGrossSalary(),
        reason: formData.reason,
        effectiveOn: formData.effectiveOn,
        status: 'active',
        revisionDate: new Date().toISOString().split('T')[0]
      };
      
      setSalaryRevisions(prev => [...prev, newRevision]);
      setSuccessMessage('Salary revision created successfully');
      setSuccessAlertVisible(true);
      setCreateModalVisible(false);
      resetForm();
    } catch (error) {
      setErrorMessage(handleApiError(error, 'Failed to create salary revision'));
      setAlertVisible(true);
    }
  };

  const handleEditRevision = async () => {
    clearErrors();
    
    if (!formData.basicSalary) {
      setFieldError('basicSalary', 'Basic salary is required');
      return;
    }
    if (!formData.reason) {
      setFieldError('reason', 'Reason is required');
      return;
    }

    try {
      // This would be replaced with actual Redux action
      const updatedRevision = {
        ...editingRevision,
        newBasicSalary: parseFloat(formData.basicSalary),
        newHousingAllowance: parseFloat(formData.housingAllowance) || 0,
        newTransportAllowance: parseFloat(formData.transportAllowance) || 0,
        newOtherAllowance: parseFloat(formData.otherAllowance) || 0,
        newGrossSalary: calculateGrossSalary(),
        reason: formData.reason,
        effectiveOn: formData.effectiveOn
      };
      
      setSalaryRevisions(prev => prev.map(r => r.id === editingRevision.id ? updatedRevision : r));
      setSuccessMessage('Salary revision updated successfully');
      setSuccessAlertVisible(true);
      setEditModalVisible(false);
      setEditingRevision(null);
      resetForm();
    } catch (error) {
      setErrorMessage(handleApiError(error, 'Failed to update salary revision'));
      setAlertVisible(true);
    }
  };

  const handleDeleteRevision = async (revisionId) => {
    if (window.confirm('Are you sure you want to delete this salary revision?')) {
      try {
        // This would be replaced with actual Redux action
        setSalaryRevisions(prev => prev.filter(r => r.id !== revisionId));
        setSuccessMessage('Salary revision deleted successfully');
        setSuccessAlertVisible(true);
      } catch (error) {
        setErrorMessage(handleApiError(error, 'Failed to delete salary revision'));
        setAlertVisible(true);
      }
    }
  };

  const openEditModal = (revision) => {
    setEditingRevision(revision);
    updateFields({
      employee: revision.employee,
      basicSalary: revision.newBasicSalary.toString(),
      housingAllowance: revision.newHousingAllowance.toString(),
      transportAllowance: revision.newTransportAllowance.toString(),
      otherAllowance: revision.newOtherAllowance.toString(),
      reason: revision.reason,
      effectiveOn: revision.effectiveOn
    });
    setEditModalVisible(true);
  };

  const openViewModal = (revision) => {
    setSelectedRevision(revision);
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
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    return (
      <CBadge color="success" className="d-flex align-items-center gap-1">
        <CIcon icon={cilCheck} size="sm" />
        Active
      </CBadge>
    );
  };

  const calculateChange = (oldValue, newValue) => {
    const change = newValue - oldValue;
    const percentage = oldValue > 0 ? ((change / oldValue) * 100) : 0;
    return { change, percentage };
  };

  const getChangeIndicator = (oldValue, newValue) => {
    const { change, percentage } = calculateChange(oldValue, newValue);
    const isPositive = change >= 0;
    
    return (
      <div className="d-flex align-items-center">
        <CIcon 
                        icon={cilPlus} 
          className={`me-1 ${isPositive ? 'text-success' : 'text-danger'}`}
        />
        <span className={`small ${isPositive ? 'text-success' : 'text-danger'}`}>
          {isPositive ? '+' : ''}{formatCurrency(change)} ({isPositive ? '+' : ''}{percentage.toFixed(1)}%)
        </span>
      </div>
    );
  };

  // Show loading state
  if (isLoading) {
    return <LoadingSpinner text="Loading salary revision data..." />;
  }

  // Show error state
  if (error) {
    return (
      <ErrorDisplay 
        error={error}
        onRetry={() => dispatch(fetchEmployees())}
        title="Failed to load salary revision data"
      />
    );
  }

  return (
    <div className="salary-revisions-container">
      {/* Header Section */}
      <div className="mb-4">
        <h2 className="mb-3">
                          <CIcon icon={cilPlus} className="me-2" />
          Salary Revision Management
        </h2>
        <p className="text-muted mb-0">
          Manage employee salary revisions, track changes, and maintain salary history
        </p>
      </div>

      {/* Summary Cards */}
      <CRow className="mb-4">
        <CCol xs={12} md={3}>
          <CCard className="summary-card h-100 border-0 shadow-sm">
            <CCardBody className="text-center p-4">
              <div className="mb-3">
                <CIcon icon={cilHistory} size="2xl" className="text-primary" />
              </div>
              <h4 className="mb-2">{salaryRevisions.length}</h4>
              <p className="text-muted mb-0">Total Revisions</p>
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
                {formatCurrency(salaryRevisions.reduce((sum, r) => sum + (r.newGrossSalary - r.previousGrossSalary), 0))}
              </h4>
              <p className="text-muted mb-0">Total Increase</p>
            </CCardBody>
          </CCard>
        </CCol>
        
        <CCol xs={12} md={3}>
          <CCard className="summary-card h-100 border-0 shadow-sm">
            <CCardBody className="text-center p-4">
              <div className="mb-3">
                <CIcon icon={cilUser} size="2xl" className="text-info" />
              </div>
              <h4 className="mb-2">
                {new Set(salaryRevisions.map(r => r.employee)).size}
              </h4>
              <p className="text-muted mb-0">Employees Affected</p>
            </CCardBody>
          </CCard>
        </CCol>
        
        <CCol xs={12} md={3}>
          <CCard className="summary-card h-100 border-0 shadow-sm">
            <CCardBody className="text-center p-4">
              <div className="mb-3">
                <CIcon icon={cilMoney} size="2xl" className="text-warning" />
              </div>
              <h4 className="mb-2">
                {formatCurrency(salaryRevisions.reduce((sum, r) => sum + r.newGrossSalary, 0))}
              </h4>
              <p className="text-muted mb-0">Total New Payroll</p>
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
          Create New Revision
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

      {/* Salary Revisions Table */}
      <CCard className="border-0 shadow-sm">
        <CCardHeader className="bg-white border-bottom">
          <h5 className="mb-0">
            <CIcon icon={cilHistory} className="me-2" />
            Revision History
          </h5>
        </CCardHeader>
        <CCardBody className="p-0">
          <div className="table-responsive">
            <CTable hover className="mb-0">
              <CTableHead className="bg-light">
                <CTableRow>
                  <CTableHeaderCell className="border-0">Employee</CTableHeaderCell>
                  <CTableHeaderCell className="border-0">Previous Salary</CTableHeaderCell>
                  <CTableHeaderCell className="border-0">New Salary</CTableHeaderCell>
                  <CTableHeaderCell className="border-0">Change</CTableHeaderCell>
                  <CTableHeaderCell className="border-0">Reason</CTableHeaderCell>
                  <CTableHeaderCell className="border-0">Effective From</CTableHeaderCell>
                  <CTableHeaderCell className="border-0">Status</CTableHeaderCell>
                  <CTableHeaderCell className="border-0 text-center">Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {salaryRevisions.map((revision) => (
                  <CTableRow key={revision.id} className="align-middle">
                    <CTableDataCell>
                      <div className="fw-semibold">{revision.employee}</div>
                    </CTableDataCell>
                    
                    <CTableDataCell>
                      <div className="text-muted">
                        {formatCurrency(revision.previousGrossSalary)}
                      </div>
                    </CTableDataCell>
                    
                    <CTableDataCell>
                      <div className="text-primary fw-bold">
                        {formatCurrency(revision.newGrossSalary)}
                      </div>
                    </CTableDataCell>
                    
                    <CTableDataCell>
                      {getChangeIndicator(revision.previousGrossSalary, revision.newGrossSalary)}
                    </CTableDataCell>
                    
                    <CTableDataCell>
                      <div className="text-truncate" style={{ maxWidth: '200px' }} title={revision.reason}>
                        {revision.reason}
                      </div>
                    </CTableDataCell>
                    
                    <CTableDataCell>
                      <div className="fw-semibold">
                        {formatDate(revision.effectiveOn)}
                      </div>
                    </CTableDataCell>
                    
                    <CTableDataCell>
                      {getStatusBadge(revision.status)}
                    </CTableDataCell>
                    
                    <CTableDataCell className="text-center">
                      <div className="d-flex gap-2 justify-content-center">
                        <CButton
                          color="outline-info"
                          size="sm"
                          onClick={() => openViewModal(revision)}
                          className="action-btn"
                        >
                          <CIcon icon={cilSearch} className="me-1" />
                          View
                        </CButton>
                        
                        <CButton
                          color="outline-warning"
                          size="sm"
                          onClick={() => openEditModal(revision)}
                          className="action-btn"
                        >
                          <CIcon icon={cilPencil} className="me-1" />
                          Edit
                        </CButton>
                        
                        <CButton
                          color="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteRevision(revision.id)}
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

      {/* Create Revision Modal */}
      <CModal 
        visible={createModalVisible} 
        onClose={() => setCreateModalVisible(false)}
        size="lg"
      >
        <CModalHeader closeButton>
          <CModalTitle>
            <CIcon icon={cilPlus} className="me-2" />
            Create New Salary Revision
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
            
            <CCol md={6}>
              <div className="mb-3">
                <label className="form-label">Effective From</label>
                <CFormInput
                  type="date"
                  value={formData.effectiveOn}
                  onChange={(e) => updateField('effectiveOn', e.target.value)}
                  className={errors.effectiveOn ? 'is-invalid' : ''}
                />
                {errors.effectiveOn && <div className="invalid-feedback">{errors.effectiveOn}</div>}
              </div>
            </CCol>
          </CRow>
          
          <CRow>
            <CCol md={6}>
              <div className="mb-3">
                <label className="form-label">New Basic Salary</label>
                <CFormInput
                  type="number"
                  value={formData.basicSalary}
                  onChange={(e) => updateField('basicSalary', e.target.value)}
                  className={errors.basicSalary ? 'is-invalid' : ''}
                  placeholder="Enter new basic salary"
                />
                {errors.basicSalary && <div className="invalid-feedback">{errors.basicSalary}</div>}
              </div>
            </CCol>
            
            <CCol md={6}>
              <div className="mb-3">
                <label className="form-label">Reason for Revision</label>
                <CFormInput
                  value={formData.reason}
                  onChange={(e) => updateField('reason', e.target.value)}
                  className={errors.reason ? 'is-invalid' : ''}
                  placeholder="Enter reason for revision"
                />
                {errors.reason && <div className="invalid-feedback">{errors.reason}</div>}
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
          
          <div className="text-center p-3 bg-light rounded">
            <h6 className="mb-2">Calculated New Gross Salary</h6>
            <h4 className="text-success mb-0">{formatCurrency(calculateGrossSalary())}</h4>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setCreateModalVisible(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleCreateRevision}>
            Create Revision
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Edit Revision Modal */}
      <CModal 
        visible={editModalVisible} 
        onClose={() => setEditModalVisible(false)}
        size="lg"
      >
        <CModalHeader closeButton>
          <CModalTitle>
            <CIcon icon={cilPencil} className="me-2" />
            Edit Salary Revision
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <CCol md={6}>
              <div className="mb-3">
                <label className="form-label">Employee</label>
                <CFormInput
                  value={editingRevision?.employee || ''}
                  disabled
                  className="bg-light"
                />
              </div>
            </CCol>
            
            <CCol md={6}>
              <div className="mb-3">
                <label className="form-label">Effective From</label>
                <CFormInput
                  type="date"
                  value={formData.effectiveOn}
                  onChange={(e) => updateField('effectiveOn', e.target.value)}
                  className={errors.effectiveOn ? 'is-invalid' : ''}
                />
                {errors.effectiveOn && <div className="invalid-feedback">{errors.effectiveOn}</div>}
              </div>
            </CCol>
          </CRow>
          
          <CRow>
            <CCol md={6}>
              <div className="mb-3">
                <label className="form-label">New Basic Salary</label>
                <CFormInput
                  type="number"
                  value={formData.basicSalary}
                  onChange={(e) => updateField('basicSalary', e.target.value)}
                  className={errors.basicSalary ? 'is-invalid' : ''}
                  placeholder="Enter new basic salary"
                />
                {errors.basicSalary && <div className="invalid-feedback">{errors.basicSalary}</div>}
              </div>
            </CCol>
            
            <CCol md={6}>
              <div className="mb-3">
                <label className="form-label">Reason for Revision</label>
                <CFormInput
                  value={formData.reason}
                  onChange={(e) => updateField('reason', e.target.value)}
                  className={errors.reason ? 'is-invalid' : ''}
                  placeholder="Enter reason for revision"
                />
                {errors.reason && <div className="invalid-feedback">{errors.reason}</div>}
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
          
          <div className="text-center p-3 bg-light rounded">
            <h6 className="mb-2">Calculated New Gross Salary</h6>
            <h4 className="text-success mb-0">{formatCurrency(calculateGrossSalary())}</h4>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setEditModalVisible(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleEditRevision}>
            Update Revision
          </CButton>
        </CModalFooter>
      </CModal>

      {/* View Revision Modal */}
      <CModal 
        visible={viewModalVisible} 
        onClose={() => setViewModalVisible(false)}
        size="lg"
      >
        <CModalHeader closeButton>
          <CModalTitle>
            <CIcon icon={cilSearch} className="me-2" />
            Salary Revision Details
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedRevision && (
            <CRow>
              <CCol md={6}>
                <h6>Employee Information</h6>
                <p><strong>Name:</strong> {selectedRevision.employee}</p>
                <p><strong>Status:</strong> {getStatusBadge(selectedRevision.status)}</p>
                <p><strong>Revision Date:</strong> {formatDate(selectedRevision.revisionDate)}</p>
                <p><strong>Effective From:</strong> {formatDate(selectedRevision.effectiveOn)}</p>
              </CCol>
              
              <CCol md={6}>
                <h6>Reason for Revision</h6>
                <p><strong>Reason:</strong> {selectedRevision.reason}</p>
              </CCol>
              
              <CCol md={12}>
                <h6>Salary Comparison</h6>
                <div className="table-responsive">
                  <CTable bordered size="sm">
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>Component</CTableHeaderCell>
                        <CTableHeaderCell>Previous Amount</CTableHeaderCell>
                        <CTableHeaderCell>New Amount</CTableHeaderCell>
                        <CTableHeaderCell>Change</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      <CTableRow>
                        <CTableDataCell>Basic Salary</CTableDataCell>
                        <CTableDataCell>{formatCurrency(selectedRevision.previousBasicSalary)}</CTableDataCell>
                        <CTableDataCell>{formatCurrency(selectedRevision.newBasicSalary)}</CTableDataCell>
                        <CTableDataCell>{getChangeIndicator(selectedRevision.previousBasicSalary, selectedRevision.newBasicSalary)}</CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableDataCell>Housing Allowance</CTableDataCell>
                        <CTableDataCell>{formatCurrency(selectedRevision.previousHousingAllowance)}</CTableDataCell>
                        <CTableDataCell>{formatCurrency(selectedRevision.newHousingAllowance)}</CTableDataCell>
                        <CTableDataCell>{getChangeIndicator(selectedRevision.previousHousingAllowance, selectedRevision.newHousingAllowance)}</CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableDataCell>Transport Allowance</CTableDataCell>
                        <CTableDataCell>{formatCurrency(selectedRevision.previousTransportAllowance)}</CTableDataCell>
                        <CTableDataCell>{formatCurrency(selectedRevision.newTransportAllowance)}</CTableDataCell>
                        <CTableDataCell>{getChangeIndicator(selectedRevision.previousTransportAllowance, selectedRevision.newTransportAllowance)}</CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableDataCell>Other Allowance</CTableDataCell>
                        <CTableDataCell>{formatCurrency(selectedRevision.previousOtherAllowance)}</CTableDataCell>
                        <CTableDataCell>{formatCurrency(selectedRevision.newOtherAllowance)}</CTableDataCell>
                        <CTableDataCell>{getChangeIndicator(selectedRevision.previousOtherAllowance, selectedRevision.newOtherAllowance)}</CTableDataCell>
                      </CTableRow>
                      <CTableRow className="table-success fw-bold">
                        <CTableDataCell>Total Gross Salary</CTableDataCell>
                        <CTableDataCell>{formatCurrency(selectedRevision.previousGrossSalary)}</CTableDataCell>
                        <CTableDataCell>{formatCurrency(selectedRevision.newGrossSalary)}</CTableDataCell>
                        <CTableDataCell>{getChangeIndicator(selectedRevision.previousGrossSalary, selectedRevision.newGrossSalary)}</CTableDataCell>
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

export default SalaryRevisions;

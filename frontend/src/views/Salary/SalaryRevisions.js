import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../../config';

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
    CForm
} from '@coreui/react';

const SalaryRevisions = () => {
    const [salaryRevisions, setSalaryRevisions] = useState([]);
    const [salaryRevisionsEmployee, setSalaryRevisionsEmployee] = useState([]);
    const [alertVisible, setAlertVisible] = useState(false);
    const [successAlertVisible, setSuccessAlertVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [ViewModalVisible, setViewModalVisible] = useState(false);
    const [EditModalVisible, setEditModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [basicSalary, setBasicSalary] = useState('');
    const [housingAllowance, setHousingAllowance] = useState('');
    const [transportAllowance, setTransportAllowance] = useState('');
    const [otherAllowance, setOtherAllowance] = useState(0);
    const [calculatedGrossSalary, setCalculatedGrossSalary] = useState('');
    const [employeeSalaryDetails, setEmployeeSalaryDetails] = useState({});
    const [selectedEmployeeData, setSelectedEmployeeData] = useState({});
    const [reason, setReason] = useState('');
    const [effectiveOn, setEffectiveOn] = useState('');
    const token = localStorage.getItem('authToken');
    const [selectedRevision, setSelectedRevision] = useState(null);
    const [editingRevision, setEditingRevision] = useState(null);


    // Timer for alerts
    useEffect(() => {
        let timer;
        if (alertVisible || successAlertVisible) {
            timer = setTimeout(() => {
                setAlertVisible(false);
                setSuccessAlertVisible(false);
            }, 10000); // 10 seconds
        }
        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, [alertVisible, successAlertVisible]);
    const fetchData = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/salary-revision/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setSalaryRevisions(response.data);
            setLoading(false);
        } catch (error) {
            setError("There was an error fetching the data.");
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchData();
        calculateGrossSalary();
    }, [basicSalary, housingAllowance, transportAllowance, otherAllowance]);

    const fetchEmployees = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/employees/salaries/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setEmployees(response.data);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('authToken');
                window.location.href = '/'
            }
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleEmployeeChange = (e) => {
        const employeeId = e.target.value;
        setSelectedEmployee(employeeId);
        const selectedEmployeeData = employees.find((emp) => emp.id === parseInt(employeeId));
        if (selectedEmployeeData) {
            setSelectedEmployeeData(selectedEmployeeData);
            setEmployeeSalaryDetails(selectedEmployeeData.salary_details);
        } else {
            setEmployeeSalaryDetails(null);
        }
    };

    const handleInputChange = (e, setter) => {
        setter(e.target.value);
    };

    const calculateGrossSalary = () => {
        const grossSalary =
            (parseFloat(basicSalary) || 0) +
            (parseFloat(housingAllowance) || 0) +
            (parseFloat(transportAllowance) || 0) +
            (parseFloat(otherAllowance) || 0);

        setCalculatedGrossSalary(grossSalary.toFixed(2));
    };

    const fetchSalaryRevisions = async (id) => {
        try {
            const response = await axios.get(`${BASE_URL}/get-salary-revisions/${id}/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setSalaryRevisionsEmployee(response.data);
        } catch (error) {
            console.error("Error fetching salary revisions:", error);
        }
    };
    const handleView = (revision) => {
        fetchSalaryRevisions(revision.employee.id);
        setViewModalVisible(true);
    }
    const handleEdit = (revision) => {
        setEditingRevision(revision);
        setEditModalVisible(true);
    };

    const handleCreateRecord = async () => {
        const revisedGrossSalary =
            (parseFloat(basicSalary) || 0) +
            (parseFloat(housingAllowance) || 0) +
            (parseFloat(transportAllowance) || 0) +
            (parseFloat(otherAllowance) || 0);

        const data = {
            employee: selectedEmployeeData.id,
            revised_basic_salary: basicSalary,
            revised_housing_allowance: housingAllowance,
            revised_transport_allowance: transportAllowance,
            revised_other_allowance: otherAllowance || 0,
            revision_reason: reason || 'Performance based compensation',
            previous_basic_salary: employeeSalaryDetails.basic_salary,
            previous_housing_allowance: employeeSalaryDetails.housing_allowance,
            previous_transport_allowance: employeeSalaryDetails.transport_allowance,
            previous_gross_salary: employeeSalaryDetails.gross_salary,
            previous_other_allowance: employeeSalaryDetails.other_allowance,
            revision_date: new Date().toISOString(),
            revised_gross_salary: revisedGrossSalary,
            revised_salary_effective_from: effectiveOn
        };

        try {
            const response = await axios.post(
                `${BASE_URL}/create-salary-revision/${selectedEmployee}/`,
                data,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            fetchData();
            setSuccessMessage('Salary revision created successfully!');
            setSuccessAlertVisible(true);
            setCreateModalVisible(false);
            setBasicSalary('');
            setHousingAllowance('');
            setTransportAllowance('');
            setOtherAllowance(0);
            setReason('');
            setEffectiveOn('');
            setSelectedEmployeeData(null);
        } catch (error) {
            const msg = error?.response?.data?.detail || "Failed to create salary revision.";
            setErrorMessage(msg);
            setAlertVisible(true);
        }
    };

    const handleUpdateRevision = async (revisionId) => {
        const revisedGrossSalary =
            (parseFloat(editingRevision.revised_basic_salary) || 0) +
            (parseFloat(editingRevision.revised_housing_allowance) || 0) +
            (parseFloat(editingRevision.revised_transport_allowance) || 0) +
            (parseFloat(editingRevision.revised_other_allowance) || 0);
        const payload = {
            employee: editingRevision.employee.id,
            previous_basic_salary: editingRevision.previous_basic_salary,
            previous_housing_allowance: editingRevision.previous_housing_allowance,
            previous_transport_allowance: editingRevision.previous_transport_allowance,
            previous_other_allowance: editingRevision.previous_other_allowance,
            previous_gross_salary: editingRevision.previous_gross_salary,
            revised_salary_effective_from: editingRevision.revised_salary_effective_from,
            revised_basic_salary: editingRevision.revised_basic_salary,
            revised_housing_allowance: editingRevision.revised_housing_allowance,
            revised_transport_allowance: editingRevision.revised_transport_allowance,
            revised_other_allowance: editingRevision.revised_other_allowance,
            revision_reason: editingRevision.revision_reason,
            revised_gross_salary: revisedGrossSalary,
            revision_date: new Date().toISOString(),
        };

        try {
            const response = await axios.put(
                `${BASE_URL}/salary-revision/edit/${revisionId}/`,
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            fetchData();
            fetchSalaryRevisions();
            setSuccessMessage('Salary revision updated successfully!');
            setSuccessAlertVisible(true);
            setEditModalVisible(false);
            setEditingRevision(null);
        } catch (error) {
            const msg = error?.response?.data?.detail || "Failed to update salary revision.";
            setErrorMessage(msg);
            setAlertVisible(true);
            console.error(error);
        }
    };



    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <CCard>
            <div>
                <CCardHeader>
                    <div className='d-flex justify-content-between align-items-end mt-2 mb-2'>
                        <h4>Latest Salary Revision</h4>
                        <CButton color="primary" onClick={() => setCreateModalVisible(true)}>
                            <i className="cui-plus"></i> Add New
                        </CButton>
                    </div>
                </CCardHeader>
                <CCardBody>
                    <CTable bordered>
                        <CTableHead>
                            <CTableRow>
                                <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>Employee Name</CTableHeaderCell>
                                <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>Designation</CTableHeaderCell>
                                <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>Department</CTableHeaderCell>
                                <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>Previous Gross Salary</CTableHeaderCell>
                                <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>Revised Gross Salary</CTableHeaderCell>
                                <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>Effective On</CTableHeaderCell>
                                <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>Action</CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            {salaryRevisions.length === 0 ? (
                                <CTableRow>
                                    <CTableDataCell colSpan="7" style={{ textAlign: 'center' }}>
                                        No data available
                                    </CTableDataCell>
                                </CTableRow>
                            ) : (
                                salaryRevisions.map((revision) => (
                                    <CTableRow key={revision.id}>
                                        <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                            {revision.employee.first_name} {revision.employee.last_name}
                                        </CTableDataCell>
                                        <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                            {revision.employee.designation}
                                        </CTableDataCell>
                                        <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                            {revision.employee.department}
                                        </CTableDataCell>
                                        <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                            {revision.previous_gross_salary}
                                        </CTableDataCell>
                                        <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                            {revision.revised_gross_salary}
                                        </CTableDataCell>
                                        <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                            {revision.revised_salary_effective_from}
                                        </CTableDataCell>
                                        <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                            <CDropdown>
                                                <CDropdownToggle color="secondary">Actions</CDropdownToggle>
                                                <CDropdownMenu>
                                                    <CDropdownItem onClick={() => handleView(revision)}>View</CDropdownItem>
                                                    <CDropdownItem onClick={() => handleEdit(revision)}>Edit</CDropdownItem>
                                                </CDropdownMenu>
                                            </CDropdown>
                                        </CTableDataCell>
                                    </CTableRow>
                                ))
                            )}
                        </CTableBody>
                    </CTable>
                </CCardBody>

                <CModal visible={createModalVisible} onClose={() => setCreateModalVisible(false)} size="lg" centered={true}>
                    <CModalHeader>
                        <CModalTitle>Create Salary Revision</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        <CCard>
                            <CCardHeader className="bg-light text-black">
                                <strong>Salary Details</strong>
                            </CCardHeader>
                            <CCardBody>
                                {alertVisible && (
                                    <CAlert color="danger" onClose={() => setAlertVisible(false)} dismissible>
                                        {errorMessage}
                                    </CAlert>
                                )}
                                {successAlertVisible && (
                                    <CAlert color="success" onClose={() => setSuccessAlertVisible(false)} dismissible>
                                        {successMessage}
                                    </CAlert>
                                )}

                                <CRow className="mb-4">
                                    <CCol md={6} className="mb-3">
                                        <label>Employee Name <span style={{ color: 'red' }}>*</span></label>
                                        <CFormSelect value={selectedEmployee} onChange={handleEmployeeChange}>
                                            <option value="">Select Employee</option>
                                            {employees.map((employee) => (
                                                <option key={employee.id} value={employee.id}>
                                                    {employee.first_name} {employee.last_name}
                                                </option>
                                            ))}
                                        </CFormSelect>
                                    </CCol>

                                    {/* Render salary details of the selected employee */}
                                    {selectedEmployee && employeeSalaryDetails && (
                                        <div>
                                            <CRow className="mb-4">
                                                <CCol md={6} className="mb-3">
                                                    <label>Previous Basic Salary</label>
                                                    <CFormInput
                                                        type="number"
                                                        value={employeeSalaryDetails?.basic_salary || 0}
                                                        disabled
                                                    />
                                                </CCol>
                                                <CCol md={6} className="mb-3">
                                                    <label>Previous Housing Allowance</label>
                                                    <CFormInput
                                                        type="number"
                                                        value={employeeSalaryDetails?.housing_allowance || 0}
                                                        disabled
                                                    />
                                                </CCol>
                                                <CCol md={6} className="mb-3">
                                                    <label>Previous Transport Allowance</label>
                                                    <CFormInput
                                                        type="number"
                                                        value={employeeSalaryDetails?.transport_allowance || 0}
                                                        disabled
                                                    />
                                                </CCol>
                                                <CCol md={6} className="mb-3">
                                                    <label>Previous Gross Salary</label>
                                                    <CFormInput
                                                        type="number"
                                                        value={employeeSalaryDetails?.gross_salary || 0}
                                                        disabled
                                                    />
                                                </CCol>
                                                <CCol md={6} className="mb-3">
                                                    <label>Previous Salary Updated At</label>
                                                    <CFormInput
                                                        type="text"
                                                        value={employeeSalaryDetails?.updated_at || ''}
                                                        disabled
                                                    />
                                                </CCol>
                                            </CRow>
                                        </div>
                                    )}

                                    {/* Add input fields for revised salary details */}
                                    <CCol md={6} className="mb-3">
                                        <label>Revised Basic Salary <span style={{ color: 'red' }}>*</span></label>
                                        <CFormInput
                                            type="number"
                                            name="basicSalary"
                                            value={basicSalary}
                                            onChange={(e) => handleInputChange(e, setBasicSalary)}
                                        />
                                    </CCol>

                                    <CCol md={6} className="mb-3">
                                        <label>Revised Housing Allowance <span style={{ color: 'red' }}>*</span></label>
                                        <CFormInput
                                            type="number"
                                            value={housingAllowance}
                                            onChange={(e) => handleInputChange(e, setHousingAllowance)}
                                        />
                                    </CCol>

                                    <CCol md={6} className="mb-3">
                                        <label>Revised Transport Allowance <span style={{ color: 'red' }}>*</span></label>
                                        <CFormInput
                                            type="number"
                                            value={transportAllowance}
                                            onChange={(e) => handleInputChange(e, setTransportAllowance)}
                                        />
                                    </CCol>

                                    <CCol md={6} className="mb-3">
                                        <label>Revised Other Allowance</label>
                                        <CFormInput
                                            type="number"
                                            value={otherAllowance}
                                            onChange={(e) => handleInputChange(e, setOtherAllowance)}
                                        />
                                    </CCol>
                                    <CCol md={6} className="mb-3">
                                        <label>Effective on <span style={{ color: 'red' }}>*</span></label>
                                        <CFormInput
                                            type="date"
                                            value={effectiveOn}
                                            onChange={(e) => handleInputChange(e, setEffectiveOn)}
                                        />
                                    </CCol>
                                    <CCol md={6} className="mb-3">
                                        <label>Reason for Salary Revision</label>
                                        <CFormInput
                                            type="text"
                                            name="reason"
                                            value={reason}
                                            onChange={(e) => handleInputChange(e, setReason)}
                                        />
                                    </CCol>

                                    <CCol md={12} className="text-start">
                                        <p><strong>New Gross Salary: </strong>{calculatedGrossSalary}</p>
                                    </CCol>
                                </CRow>

                                <CRow className="mt-3">
                                    <CCol className="d-flex justify-content-start">
                                        <CButton color="primary" onClick={handleCreateRecord} disabled={!selectedEmployee}>Create Salary Revision</CButton>
                                    </CCol>
                                </CRow>

                            </CCardBody>
                        </CCard>
                    </CModalBody>


                </CModal>

                <CModal visible={ViewModalVisible} onClose={() => setViewModalVisible(false)} size="lg" centered>
                    <CModalHeader className="bg-primary text-white">
                        <CModalTitle>Salary Revision Timeline</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        <CCard className="shadow-sm">
                            <CCardHeader className="bg-light text-dark">
                                <strong>Salary History</strong>
                            </CCardHeader>
                            <CCardBody>
                                {salaryRevisionsEmployee.length > 0 ? (
                                    <div style={{
                                        position: 'relative',
                                        padding: '20px',
                                        borderLeft: '4px solid #007bff',
                                        marginLeft: '15px'
                                    }}>
                                        {salaryRevisionsEmployee.map((revision, index) => (
                                            <React.Fragment key={revision.id}>
                                                {/* First Salary Card (Separate from the first revision) */}
                                                {index === 0 && (
                                                    <div style={{
                                                        marginBottom: '25px',
                                                        paddingLeft: '25px',
                                                        position: 'relative'
                                                    }}>
                                                        {/* Timeline Dot */}
                                                        <div style={{
                                                            position: 'absolute',
                                                            left: '-14px',
                                                            top: '8px',
                                                            width: '14px',
                                                            height: '14px',
                                                            background: '#007bff',
                                                            borderRadius: '50%',
                                                            border: '3px solid white',
                                                            boxShadow: '0 0 5px rgba(0,0,0,0.2)'
                                                        }}></div>

                                                        {/* First Salary Card */}
                                                        <div style={{
                                                            background: '#f8f9fa',
                                                            padding: '15px',
                                                            borderRadius: '10px',
                                                            boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                                                        }}>
                                                            <h6 style={{ fontWeight: 'bold', color: '#007bff' }}>
                                                                First Salary
                                                            </h6>
                                                            <p><strong>Basic Salary:</strong> {revision.previous_basic_salary}</p>
                                                            <p><strong>Housing Allowance:</strong> {revision.previous_housing_allowance}</p>
                                                            <p><strong>Transport Allowance:</strong> {revision.previous_transport_allowance}</p>
                                                            <p><strong>Other Allowance:</strong> {revision.previous_other_allowance}</p>
                                                            <p><strong>Gross Salary:</strong> {revision.previous_gross_salary}</p>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Salary Revision Cards */}
                                                <div style={{
                                                    marginBottom: '25px',
                                                    paddingLeft: '25px',
                                                    position: 'relative'
                                                }}>
                                                    {/* Timeline Dot */}
                                                    <div style={{
                                                        position: 'absolute',
                                                        left: '-14px',
                                                        top: '8px',
                                                        width: '14px',
                                                        height: '14px',
                                                        background: '#007bff',
                                                        borderRadius: '50%',
                                                        border: '3px solid white',
                                                        boxShadow: '0 0 5px rgba(0,0,0,0.2)'
                                                    }}></div>

                                                    {/* Salary Revision Card */}
                                                    <div style={{
                                                        background: '#f8f9fa',
                                                        padding: '15px',
                                                        borderRadius: '10px',
                                                        boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                                                    }}>
                                                        <h6 style={{ fontWeight: 'bold', color: '#007bff' }}>
                                                            {index === 0 ? "Revision 1" : `Revision ${index + 1}`}
                                                        </h6>
                                                        <p><strong>Basic Salary:</strong> {revision.revised_basic_salary}</p>
                                                        <p><strong>Housing Allowance:</strong> {revision.revised_housing_allowance}</p>
                                                        <p><strong>Transport Allowance:</strong> {revision.revised_transport_allowance}</p>
                                                        <p><strong>Other Allowance:</strong> {revision.revised_other_allowance}</p>
                                                        <p><strong>Gross Salary:</strong> {revision.revised_gross_salary}</p>
                                                        <p><strong>Reason:</strong> {revision.revision_reason}</p>
                                                        <p><strong>Revised On:</strong> {revision.revision_date}</p>
                                                        <p><strong>Effective From:</strong> {revision.revised_salary_effective_from}</p>
                                                    </div>
                                                </div>
                                            </React.Fragment>
                                        ))}
                                    </div>
                                ) : (
                                    <p style={{ textAlign: 'center', color: 'gray', fontSize: '16px' }}>
                                        No salary revisions available.
                                    </p>
                                )}
                            </CCardBody>
                        </CCard>
                    </CModalBody>
                    <CModalFooter>
                        <CButton color="secondary" onClick={() => setViewModalVisible(false)}>Close</CButton>
                    </CModalFooter>
                </CModal>

                <CModal visible={!!editingRevision} onClose={() => setEditingRevision(null)} size="lg" centered>
                    <CModalHeader className="bg-primary text-white">
                        <CModalTitle>Edit Salary Revision</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        {editingRevision && (
                            <CForm
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleUpdateRevision(editingRevision.id);
                                }}
                            >
                                <CRow className="mb-4">
                                    <CCol md={6} className="mb-3">
                                        <label>Current Basic Salary</label>
                                        <CFormInput
                                            className="mt-2"
                                            type="number"
                                            value={editingRevision.revised_basic_salary}
                                            onChange={(e) =>
                                                setEditingRevision({
                                                    ...editingRevision,
                                                    revised_basic_salary: e.target.value,
                                                })
                                            }
                                            placeholder="Basic Salary"
                                            required
                                        />
                                    </CCol>

                                    <CCol md={6} className="mb-3">
                                        <label>Current Housing Allowance</label>
                                        <CFormInput
                                            className="mt-2"
                                            type="number"
                                            value={editingRevision.revised_housing_allowance}
                                            onChange={(e) =>
                                                setEditingRevision({
                                                    ...editingRevision,
                                                    revised_housing_allowance: e.target.value,
                                                })
                                            }
                                            placeholder="Housing Allowance"
                                            required
                                        />
                                    </CCol>

                                    <CCol md={6} className="mb-3">
                                        <label>Current Transport Allowance</label>
                                        <CFormInput
                                            className="mt-2"
                                            type="number"
                                            value={editingRevision.revised_transport_allowance}
                                            onChange={(e) =>
                                                setEditingRevision({
                                                    ...editingRevision,
                                                    revised_transport_allowance: e.target.value,
                                                })
                                            }
                                            placeholder="Transport Allowance"
                                            required
                                        />
                                    </CCol>

                                    <CCol md={6} className="mb-3">
                                        <label>Current Other Allowance</label>
                                        <CFormInput
                                            className="mt-2"
                                            type="number"
                                            value={editingRevision.revised_other_allowance}
                                            onChange={(e) =>
                                                setEditingRevision({
                                                    ...editingRevision,
                                                    revised_other_allowance: e.target.value,
                                                })
                                            }
                                            placeholder="Other Allowance"
                                            required
                                        />
                                    </CCol>

                                    <CCol md={6} className="mb-3">
                                        <label>Revision Reason</label>
                                        <CFormInput
                                            className="mt-2"
                                            value={editingRevision.revision_reason}
                                            onChange={(e) =>
                                                setEditingRevision({
                                                    ...editingRevision,
                                                    revision_reason: e.target.value,
                                                })
                                            }
                                            placeholder="Revision Reason"
                                        />
                                    </CCol>
                                </CRow>

                                <div className="d-flex justify-content-end gap-2">
                                    <CButton type="submit" color="primary">
                                        Save
                                    </CButton>
                                    <CButton type="button" color="secondary" onClick={() => setEditingRevision(null)}>
                                        Cancel
                                    </CButton>
                                </div>
                            </CForm>
                        )}
                    </CModalBody>
                </CModal>




            </div>
        </CCard>
    );
};

export default SalaryRevisions;

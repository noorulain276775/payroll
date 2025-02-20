import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../../config';
import { CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem, CButton, CModal, CModalHeader, CModalBody, CCard, CCardHeader, CCardBody, CAlert, CRow, CCol, CFormSelect, CFormInput, CModalTitle } from '@coreui/react'; // assuming CoreUI is installed

const SalaryRevisions = () => {
    const [salaryRevisions, setSalaryRevisions] = useState([]);
    const [alertVisible, setAlertVisible] = useState(false);
    const [successAlertVisible, setSuccessAlertVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [basicSalary, setBasicSalary] = useState('');
    const [housingAllowance, setHousingAllowance] = useState('');
    const [transportAllowance, setTransportAllowance] = useState('');
    const [otherAllowance, setOtherAllowance] = useState('');
    const [calculatedGrossSalary, setCalculatedGrossSalary] = useState('');
    const [newState, setNewState] = useState([]);



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

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const fetchData = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/salary-revision/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setSalaryRevisions(response.data);
                console.log(response.data);
                setLoading(false);
            } catch (error) {
                setError("There was an error fetching the data.");
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const fetchEmployees = async () => {
        const token = localStorage.getItem('authToken');
        try {
            const response = await axios.get(`${BASE_URL}/view_all_employees/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setEmployees(response.data);
            console.log("employeee details", response.data);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('authToken');
                window.location.reload();
                navigate('/');
            }
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleEmployeeChange = (e) => {
        setSelectedEmployee(e.target.value);
    };

    const handleInputChange = (e, setter) => {
        setter(e.target.value);
    };

    const calculateGrossSalary = () => {
        const grossSalary = parseFloat(basicSalary) + parseFloat(housingAllowance) + parseFloat(transportAllowance) + parseFloat(otherAllowance);
        setCalculatedGrossSalary(grossSalary.toFixed(2));
    };

    const handleCreateRecord = () => {
        // Logic for saving salary revision
        setSuccessMessage('Salary revision created successfully!');
        setSuccessAlertVisible(true);
        setCreateModalVisible(false);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <div className='d-flex justify-content-between align-items-end mb-4'>
                <h4>Salary Revision</h4>
                <CButton color="primary" onClick={() => setCreateModalVisible(true)} className="mt-4">
                    <i className="cui-plus"></i> Add New
                </CButton>
            </div>
            <CTable bordered>
                <CTableHead>
                    <CTableRow>
                        <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>Employee Name</CTableHeaderCell>
                        <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>Designation</CTableHeaderCell>
                        <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>Department</CTableHeaderCell>
                        <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>Previous Gross Salary</CTableHeaderCell>
                        <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>Revised Gross Salary</CTableHeaderCell>
                        <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>Revision Date</CTableHeaderCell>
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
                                    {revision.revision_date}
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

            <CModal visible={createModalVisible} onClose={() => setCreateModalVisible(false)} size="lg" centered>
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
                                    <CFormSelect
                                        value={selectedEmployee}
                                        onChange={handleEmployeeChange}
                                    >
                                        <option value="">Select Employee</option>
                                        {employees.map((employee) => (
                                            <option key={employee.id} value={employee.id}>
                                                {employee.first_name} {employee.last_name}
                                            </option>
                                        ))}
                                    </CFormSelect>
                                </CCol>

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

                                <CCol md={12} className="text-start">
                                    <CButton color="light" onClick={calculateGrossSalary} className="mt-2 mb-3" block>
                                        Click to Calculate Gross Salary
                                    </CButton>
                                    <p><strong>Gross Salary: </strong>{calculatedGrossSalary}</p>

                                </CCol>
                            </CRow>
                            {salaryRevisions.map((s) => (
                                <CRow key={s.id}>
                                    <CCol md={6} className="mb-3">
                                        <label>Previous Basic Salary</label>
                                        <CFormInput
                                            type="number"
                                            value={s.employee.salary_details?.basic_salary || 0}
                                            disabled
                                        />
                                    </CCol>
                                    <CCol md={6} className="mb-3">
                                        <label>Previous Housing Allowance Salary</label>
                                        <CFormInput
                                            type="number"
                                            value={s.employee.salary_details?.housing_allowance || 0}
                                            disabled
                                        />
                                    </CCol>
                                    <CCol md={6} className="mb-3">
                                        <label>Previous Transport Allowance Salary</label>
                                        <CFormInput
                                            type="number"
                                            value={s.employee.salary_details?.transport_allowance || 0}
                                            disabled
                                        />
                                    </CCol>
                                    <CCol md={6} className="mb-3">
                                        <label>Previous Gross Salary</label>
                                        <CFormInput
                                            type="number"
                                            value={s.employee.salary_details?.gross_salary || 0}
                                            disabled
                                        />
                                    </CCol>
                                    <CCol md={6} className="mb-3">
                                        <label>Previous salary updated at</label>
                                        <CFormInput
                                            type="text"
                                            value={s.employee.salary_details?.updated_at || ''}
                                            disabled
                                        />
                                    </CCol>
                                </CRow>
                            ))}
                            <CRow className="mt-3">
                                <CCol className="d-flex justify-content-start">
                                    <CButton color="primary" onClick={handleCreateRecord}>Create Salary Revision</CButton>
                                </CCol>
                            </CRow>

                        </CCardBody>
                    </CCard>

                </CModalBody>
            </CModal>
        </div>
    );
};

export default SalaryRevisions;

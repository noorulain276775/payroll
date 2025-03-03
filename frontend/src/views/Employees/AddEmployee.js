import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Make sure axios is imported
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CContainer,
    CForm,
    CFormInput,
    CFormLabel,
    CFormSelect,
    CRow,
    CAlert
} from '@coreui/react';
import { useNavigate } from 'react-router-dom';

const AddEmployee = () => {
    const [users, setUsers] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [personalEmail, setPersonalEmail] = useState('');
    const [companyEmail, setCompanyEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [nationality, setNationality] = useState('');
    const [designation, setDesignation] = useState('');
    const [department, setDepartment] = useState('');
    const [address, setAddress] = useState('');
    const [dob, setDob] = useState('');
    const [placeOfBirth, setPlaceOfBirth] = useState('');
    const [SpouseName, setSpouseName] = useState('');
    const [children, setChildren] = useState(0);
    const [fatherName, setFatherName] = useState('');
    const [motherName, setMotherName] = useState('');
    const [maritalStatus, setMaritalStatus] = useState('');
    const [gender, setGender] = useState('');
    const [homeTownNumber, setHomeTownNumber] = useState('');
    const [qualification, setQualification] = useState('');
    const [passportNumber, setPassportNumber] = useState('');
    const [emergencyContactName, setEmergencyContactName] = useState('');
    const [emergencyContactNumber, setEmergencyContactNumber] = useState('');
    const [emergencyContactRelation, setEmergencyContactRelation] = useState('');
    const [previousEmployer, setPreviousEmployer] = useState('');
    const [previousCompanyDesignation, setPreviousCompanyDesignation] = useState('');
    const [companyPhoneNumber, setCompanyPhoneNumber] = useState('');
    const [joiningDate, setJoiningDate] = useState('');
    const [emiratesId, setEmiratesId] = useState('');
    const [visaNumber, setVisaNumber] = useState('');
    const [visaExpiryDate, setVisaExpiryDate] = useState('');
    const [emiratesIdExpiryDate, setEmiratesIdExpiryDate] = useState('');
    const [insuranceExpiryDate, setInsuranceExpiryDate] = useState('');
    const [emiartesIDDocument, setEmiratesIDDocument] = useState('');
    const [visaDocument, setVisaDocument] = useState('');
    const [insuranceDocument, setInsuranceDocument] = useState('');
    const [DegreeDocument, setDegreeDocument] = useState('');
    const [photo, setPhoto] = useState('');
    const [passportDocument, setPassportDocument] = useState('');
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertColor, setAlertColor] = useState('success');

    const navigate = useNavigate();
    const token = localStorage.getItem('authToken');

    const handleEmployeeChange = (e) => {
        setSelectedEmployee(e.target.value);
    };

    const handleInputChange = (e, setter) => {
        setter(e.target.value);
    };

    const handleFileChange = (e, setter, allowedExtensions, fieldName) => {
        const file = e.target.files[0];
        if (file) {
            if (!allowedExtensions.test(file.name)) {
                setAlertMessage(`${fieldName} must be a valid file format (PDF) with front and back on same PDF.`);
                setAlertColor("danger");
                setAlertVisible(true);
                e.target.value = "";
                window.scrollTo({ top: 0, behavior: "smooth" });
            } else {
                setter(file);
                setAlertVisible(false);
            }
        }
    };

    const handlePhotoChange = (e, setter, allowedExtensions, fieldName) => {
        const file = e.target.files[0];
        if (file) {
            if (!allowedExtensions.test(file.name)) {
                setAlertMessage(`${fieldName} must be a valid file format (JPG, JPEG, or PNG).`);
                setAlertColor("danger");
                setAlertVisible(true);
                e.target.value = "";
                window.scrollTo({ top: 0, behavior: "smooth" });
            } else {
                setter(file);
                setAlertVisible(false);
            }
        }
    };
    const validateForm = () => {
        if (!selectedEmployee) {
            setAlertMessage("User is required.");
            setAlertColor("danger");
            setAlertVisible(true);
            return false;
        }
        if (!firstName) {
            setAlertMessage("First Name is required.");
            setAlertColor("danger");
            setAlertVisible(true);
            return false;
        }
        if (!lastName) {
            setAlertMessage("Last Name is required.");
            setAlertColor("danger");
            setAlertVisible(true);
            return false;
        }
        if (!personalEmail) {
            setAlertMessage("Personal Email address is required.");
            setAlertColor("danger");
            setAlertVisible(true);
            return false;
        }
        if (!dob) {
            setAlertMessage("Date of Birth is required.");
            setAlertColor("danger");
            setAlertVisible(true);
            return false;
        }
        if (!placeOfBirth) {
            setAlertMessage("Place of Birth is required.");
            setAlertColor("danger");
            setAlertVisible(true);
            return false;
        }
        if (!nationality) {
            setAlertMessage("Nationality is required.");
            setAlertColor("danger");
            setAlertVisible(true);
            return false;
        }
        if (!companyEmail) {
            setAlertMessage("Company Email is required.");
            setAlertColor("danger");
            setAlertVisible(true);
            return false;
        }
        if (!gender) {
            setAlertMessage("Gender is required");
            setAlertColor("danger");
            setAlertVisible(true);
            return false;
        }
        if (!maritalStatus) {
            setAlertMessage("Marital Status is required.");
            setAlertColor("danger");
            setAlertVisible(true);
            return false;
        }
        if (!address) {
            setAlertMessage("Address is required.");
            setAlertColor("danger");
            setAlertVisible(true);
            return false;
        }
        if (!designation) {
            setAlertMessage("Designation is required.");
            setAlertColor("danger");
            setAlertVisible(true);
            return false;
        }

        if (!department) {
            setAlertMessage("Department is required.");
            setAlertColor("danger");
            setAlertVisible(true);
            return false;
        }

        if (!joiningDate) {
            setAlertMessage("Joining Date is required.");
            setAlertColor("danger");
            setAlertVisible(true);
            return false;
        }
        if (!phoneNumber) {
            setAlertMessage("Phone Number is required.");
            setAlertColor("danger");
            setAlertVisible(true);
            return false;
        }

        if (!motherName) {
            setAlertMessage("Mother Name is required.");
            setAlertColor("danger");
            setAlertVisible(true);
            return false;
        }

        if (!fatherName) {
            setAlertMessage("Father Name is required.");
            setAlertColor("danger");
            setAlertVisible(true);
            return false;
        }

        if (!qualification) {
            setAlertMessage("Qualification is required.");
            setAlertColor("danger");
            setAlertVisible(true);
            return false;
        }

        if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(personalEmail)) {
            setAlertMessage("Invalid email format.");
            setAlertColor("danger");
            setAlertVisible(true);
            return false;
        }
        if (photo && !/\.(jpg|jpeg|png)$/i.test(photo.name)) {
            setAlertMessage("Photo must be a JPG, JPEG, or PNG.");
            setAlertColor("danger");
            setAlertVisible(true);
            return false;
        }
        if (passportDocument && !/\.(pdf)$/i.test(passportDocument.name)) {
            setAlertMessage("Passport Document must be a PDF.");
            setAlertColor("danger");
            setAlertVisible(true);
            return false;
        }

        if (visaDocument && !/\.(pdf)$/i.test(visaDocument.name)) {
            setAlertMessage("Visa Document must be a PDF.");
            setAlertColor("danger");
            setAlertVisible(true);
            return false;
        }
        if (emiartesIDDocument && !/\.(pdf)$/i.test(emiartesIDDocument.name)) {
            setAlertMessage("Emirates ID must be a PDF.");
            setAlertColor("danger");
            setAlertVisible(true);
            return false;
        }
        if (insuranceDocument && !/\.(pdf)$/i.test(insuranceDocument.name)) {
            setAlertMessage("Emirates ID must be a PDF.");
            setAlertColor("danger");
            setAlertVisible(true);
            return false;
        }
        if (DegreeDocument && !/\.(pdf)$/i.test(DegreeDocument.name)) {
            setAlertMessage("Emirates ID must be a PDF.");
            setAlertColor("danger");
            setAlertVisible(true);
            return false;
        }
        return true;
    };

    useEffect(() => {
        if (!token) {
            navigate('/');
            return;
        }
        axios
            .get('http://127.0.0.1:8000/users/list/', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                setUsers(response.data);
                window.scrollTo({ top: 0, behavior: "smooth" });
            })
            .catch((error) => {
                if (error.response && error.response.status === 401) {
                    localStorage.removeItem('authToken');
                    window.location.reload();
                    navigate('/');
                }
            });
    }, [navigate, token]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) {
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        const formData = new FormData();
        formData.append('user', selectedEmployee);
        formData.append('first_name', firstName);
        formData.append('last_name', lastName);
        formData.append('personal_email', personalEmail);
        formData.append('email', companyEmail);
        formData.append('phone_number', phoneNumber);
        formData.append('designation', designation);
        formData.append('department', department);
        formData.append('address', address);
        formData.append('date_of_birth', dob);
        formData.append('nationality', nationality);
        formData.append('place_of_birth', placeOfBirth);
        formData.append('spouse_name', SpouseName);
        formData.append('children', children);
        formData.append('father_name', fatherName);
        formData.append('mother_name', motherName);
        formData.append('marital_status', maritalStatus);
        formData.append('gender', gender);
        formData.append('home_town_number', homeTownNumber);
        formData.append('qualification', qualification);
        formData.append('passport_no', passportNumber);
        formData.append('emergency_contact_name', emergencyContactName);
        formData.append('emergency_contact_number', emergencyContactNumber);
        formData.append('emergency_contact_relation', emergencyContactRelation);
        formData.append('previous_company_name', previousEmployer);
        formData.append('previous_company_designation', previousCompanyDesignation);
        formData.append('company_phone_number', companyPhoneNumber);
        formData.append('joining_date', joiningDate);
        formData.append('emirates_id', emiratesId);
        formData.append('visa_no', visaNumber);
        formData.append('visa_expiry_date', visaExpiryDate);
        formData.append('emirates_id_expiry', emiratesIdExpiryDate);
        formData.append('insurance_expiry_date', insuranceExpiryDate);

        if (emiartesIDDocument) formData.append('emirates_id_image', emiartesIDDocument);
        if (visaDocument) formData.append('visa_image', visaDocument);
        if (insuranceDocument) formData.append('insurance_card', insuranceDocument);
        if (DegreeDocument) formData.append('highest_degree_certificate', DegreeDocument);
        if (photo) formData.append('photo', photo);
        if (passportDocument) formData.append('passport_image', passportDocument);

        axios
            .post('http://127.0.0.1:8000/create_employee/', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then((response) => {
                setAlertMessage('Employee added successfully!');
                setAlertColor('success');
                resetForm();
                setAlertVisible(true);
                window.scrollTo({ top: 0, behavior: "smooth" });
            })
            .catch((error) => {
                setAlertMessage(`Error: ${error.response.data.error}`);
                setAlertColor('danger');
                setAlertVisible(true);
            });
    };

    const resetForm = () => {
        selectedEmployee(null);
        setFirstName('');
        setLastName('');
        setCompanyEmail('');
        setPersonalEmail('');
        setPhoneNumber('');
        setNationality('');
        setDesignation('');
        setDepartment('');
        setAddress('');
        setDob('');
        setPlaceOfBirth('');
        setSpouseName('');
        setChildren(0);
        setFatherName('');
        setMotherName('');
        setMaritalStatus('');
        setGender('');
        setHomeTownNumber('');
        setQualification('');
        setPassportNumber('');
        setEmergencyContactName('');
        setEmergencyContactNumber('');
        setEmergencyContactRelation('');
        setPreviousEmployer('');
        setPreviousCompanyDesignation('');
        setCompanyPhoneNumber('');
        setJoiningDate('');
        setEmiratesId('');
        setVisaNumber('');
        setVisaExpiryDate('');
        setEmiratesIdExpiryDate('');
        setInsuranceExpiryDate('');
        setEmiratesIDDocument(null);
        setVisaDocument(null);
        setInsuranceDocument(null);
        setDegreeDocument(null);
        setPhoto(null);
        setPassportDocument(null);
        setSelectedEmployee(null);
    };


    return (
        <div className="bg-light min-vh-100">
            <CContainer className="py-4">
                <CCard className="shadow-sm">
                    <CCardHeader className="text-center bg-light text-black">
                        <h2>Add New Employee</h2>
                    </CCardHeader>
                    <CCardBody>
                        {alertVisible && (
                            <CAlert color={alertColor} onClose={() => setAlertVisible(false)} dismissible>
                                {alertMessage}
                            </CAlert>
                        )}
                        <CForm onSubmit={handleSubmit}>
                            <CRow className="gy-4">
                                <CCol xs={12}>
                                    <h5>Basic Information</h5>
                                </CCol>
                                <CCol md={6}>
                                    <label>Select User <span style={{ color: 'red' }}>*</span></label>
                                    <CFormSelect
                                        value={selectedEmployee}
                                        onChange={handleEmployeeChange}
                                    >
                                        <option value="">Select User</option>
                                        {users.map((user) => (
                                            <option key={user.id} value={user.id}>
                                                {user.username}
                                            </option>
                                        ))}
                                    </CFormSelect>
                                </CCol>
                                <CCol md={6}>
                                    <label>First Name <span style={{ color: 'red' }}>*</span></label>
                                    <CFormInput
                                        value={firstName}
                                        onChange={(e) => handleInputChange(e, setFirstName)}
                                    />
                                </CCol>
                                <CCol md={6}>
                                    <label>Last Name <span style={{ color: 'red' }}>*</span></label>
                                    <CFormInput
                                        value={lastName}
                                        onChange={(e) => handleInputChange(e, setLastName)}
                                    />
                                </CCol>
                                <CCol md={6}>
                                    <label>Personal Email <span style={{ color: 'red' }}>*</span></label>
                                    <CFormInput
                                        value={personalEmail}
                                        onChange={(e) => handleInputChange(e, setPersonalEmail)}
                                    />
                                </CCol>
                                <CCol md={6}>
                                    <label>Phone Number <span style={{ color: 'red' }}>*</span></label>
                                    <CFormInput
                                        value={phoneNumber}
                                        onChange={(e) => handleInputChange(e, setPhoneNumber)}
                                    />
                                </CCol>
                                <CCol md={6}>
                                    <label>Nationality <span style={{ color: 'red' }}>*</span></label>
                                    <CFormInput
                                        value={nationality}
                                        onChange={(e) => handleInputChange(e, setNationality)}
                                    />
                                </CCol>
                                <CCol md={6}>
                                    <label>Date of Birth <span style={{ color: 'red' }}>*</span></label>
                                    <CFormInput
                                        type="date"
                                        value={dob}
                                        onChange={(e) => handleInputChange(e, setDob)}
                                    />
                                </CCol>
                                <CCol md={6}>
                                    <label>Place of birth <span style={{ color: 'red' }}>*</span></label>
                                    <CFormInput
                                        value={placeOfBirth}
                                        onChange={(e) => handleInputChange(e, setPlaceOfBirth)}
                                    />
                                </CCol>
                                <CCol md={6}>
                                    <label>Gender <span style={{ color: 'red' }}>*</span></label>
                                    <select
                                        className="form-select"
                                        value={gender}
                                        onChange={(e) => handleInputChange(e, setGender)}
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </CCol>
                                <CCol md={6}>
                                    <label>Marital Status <span style={{ color: 'red' }}>*</span></label>
                                    <select
                                        className="form-select"
                                        value={maritalStatus}
                                        onChange={(e) => handleInputChange(e, setMaritalStatus)}
                                    >
                                        <option value="">Select Marital Status</option>
                                        <option value="Married">Married</option>
                                        <option value="Unmarried">Unmarried</option>
                                    </select>
                                </CCol>

                                <CCol md={6}>
                                    <label>Spouse Name</label>
                                    <CFormInput
                                        value={SpouseName}
                                        onChange={(e) => handleInputChange(e, setSpouseName)}
                                    />
                                </CCol>
                                <CCol md={6}>
                                    <label>Children</label>
                                    <CFormInput
                                        type='number'
                                        defaultValue={0}
                                        value={children}
                                        onChange={(e) => handleInputChange(e, setChildren)}
                                    />
                                </CCol>
                                <CCol md={6}>
                                    <label>Father Name <span style={{ color: 'red' }}>*</span></label>
                                    <CFormInput
                                        value={fatherName}
                                        onChange={(e) => handleInputChange(e, setFatherName)}
                                    />
                                </CCol>
                                <CCol md={6}>
                                    <label>Mother Name <span style={{ color: 'red' }}>*</span></label>
                                    <CFormInput
                                        value={motherName}
                                        onChange={(e) => handleInputChange(e, setMotherName)}
                                    />
                                </CCol>
                                <CCol md={6}>
                                    <label>Home town number</label>
                                    <CFormInput
                                        value={homeTownNumber}
                                        onChange={(e) => handleInputChange(e, setHomeTownNumber)}
                                    />
                                </CCol>
                                <CCol md={6}>
                                    <label>Current Address <span style={{ color: 'red' }}>*</span></label>
                                    <CFormInput
                                        value={address}
                                        onChange={(e) => handleInputChange(e, setAddress)}
                                    />
                                </CCol>
                                <CCol md={6}>
                                    <label>Highest Qualification <span style={{ color: 'red' }}>*</span></label>
                                    <CFormInput
                                        value={qualification}
                                        onChange={(e) => handleInputChange(e, setQualification)}
                                    />
                                </CCol>
                                <CCol md={6}>
                                    <label>Passport No</label>
                                    <CFormInput
                                        value={passportNumber}
                                        onChange={(e) => handleInputChange(e, setPassportNumber)}
                                    />
                                </CCol>
                                <CCol xs={12}>
                                    <h5>Work Information</h5>
                                </CCol>
                                <CCol md={6}>
                                    <label>Department <span style={{ color: 'red' }}>*</span></label>
                                    <select
                                        className="form-select"
                                        value={department}
                                        onChange={(e) => handleInputChange(e, setDepartment)}
                                    >
                                        <option value="">Select Department</option>
                                        <option value="Accounts">Accounts</option>
                                        <option value="Operations">Operations</option>
                                        <option value="IT">IT</option>
                                    </select>
                                </CCol>
                                <CCol md={6}>
                                    <label>Designation <span style={{ color: 'red' }}>*</span></label>
                                    <CFormInput
                                        value={designation}
                                        onChange={(e) => handleInputChange(e, setDesignation)}
                                    />
                                </CCol>
                                <CCol md={6}>
                                    <label>Company Phone Number</label>
                                    <CFormInput
                                        value={companyPhoneNumber}
                                        onChange={(e) => handleInputChange(e, setCompanyPhoneNumber)}
                                    />
                                </CCol>
                                <CCol md={6}>
                                    <label>Company Email<span style={{ color: 'red' }}>*</span></label>
                                    <CFormInput
                                        value={companyEmail}
                                        onChange={(e) => handleInputChange(e, setCompanyEmail)}
                                    />
                                </CCol>

                                <CCol md={6}>
                                    <label>Previous Company Name</label>
                                    <CFormInput
                                        value={previousEmployer}
                                        onChange={(e) => handleInputChange(e, setPreviousEmployer)}
                                    />
                                </CCol>
                                <CCol md={6}>
                                    <label>Previous Company Designation</label>
                                    <CFormInput
                                        value={previousCompanyDesignation}
                                        onChange={(e) => handleInputChange(e, setPreviousCompanyDesignation)}
                                    />
                                </CCol>
                                <CCol md={6}>
                                    <label>Date of Joining <span style={{ color: 'red' }}>*</span></label>
                                    <CFormInput
                                        type="date"
                                        value={joiningDate}
                                        onChange={(e) => handleInputChange(e, setJoiningDate)}
                                    />
                                </CCol>
                                <CCol md={6}>
                                    <label>Emirates ID no:</label>
                                    <CFormInput
                                        value={emiratesId}
                                        onChange={(e) => handleInputChange(e, setEmiratesId)}
                                    />
                                </CCol>
                                <CCol md={6}>
                                    <label>Emirates Id Expiry Date</label>
                                    <CFormInput
                                        type="date"
                                        value={emiratesIdExpiryDate}
                                        onChange={(e) => handleInputChange(e, setEmiratesIdExpiryDate)}
                                    />
                                </CCol>
                                <CCol md={6}>
                                    <label>Visa no:</label>
                                    <CFormInput
                                        value={visaNumber}
                                        onChange={(e) => handleInputChange(e, setVisaNumber)}
                                    />
                                </CCol>
                                <CCol md={6}>
                                    <label>Visa Expiry Date</label>
                                    <CFormInput
                                        type="date"
                                        value={visaExpiryDate}
                                        onChange={(e) => handleInputChange(e, setVisaExpiryDate)}
                                    />
                                </CCol>
                                <CCol md={6}>
                                    <label>Health Insurance Expiry</label>
                                    <CFormInput
                                        type="date"
                                        value={insuranceExpiryDate}
                                        onChange={(e) => handleInputChange(e, setInsuranceExpiryDate)}
                                    />
                                </CCol>
                                <CCol xs={12} className="mt-4">
                                    <h5>Emergency Contact</h5>
                                </CCol>
                                <CCol md={6}>
                                    <label>Emergency Contact Name</label>
                                    <CFormInput
                                        value={emergencyContactName}
                                        onChange={(e) => handleInputChange(e, setEmergencyContactName)}
                                    />
                                </CCol>
                                <CCol md={6}>
                                    <label>Emergency Contact Number</label>
                                    <CFormInput
                                        value={emergencyContactNumber}
                                        onChange={(e) => handleInputChange(e, setEmergencyContactNumber)}
                                    />
                                </CCol>
                                <CCol md={6}>
                                    <label>Emergency Contact Relationship</label>
                                    <CFormInput
                                        value={emergencyContactRelation}
                                        onChange={(e) => handleInputChange(e, setEmergencyContactRelation)}
                                    />
                                </CCol>
                                {/* Uploads Section */}
                                <CCol xs={12} className="mt-4">
                                    <h5>Attachments</h5>
                                </CCol>
                                <CCol md={6}>
                                    <label>
                                        Photo{" "}
                                        <span style={{ fontSize: "0.85rem", color: "#6c757d", fontStyle: "italic" }}>
                                            (Please upload in JPG, JPEG, or PNG format)
                                        </span>
                                    </label>
                                    <CFormInput
                                        type="file"
                                        onChange={(e) =>
                                            handlePhotoChange(e, setPhoto, /\.(jpg|jpeg|png)$/i, "Photo")
                                        }
                                    />
                                </CCol>

                                <CCol md={6}>
                                    <label>
                                        Passport Attachment{" "}
                                        <span style={{ fontSize: "0.85rem", color: "#6c757d", fontStyle: "italic" }}>
                                            (Please upload in PDF format)
                                        </span>
                                    </label>
                                    <CFormInput
                                        type="file"
                                        onChange={(e) =>
                                            handleFileChange(e, setPassportDocument, /\.pdf$/i, "Passport Attachment")
                                        }
                                    />
                                </CCol>

                                <CCol md={6}>
                                    <label>
                                        Highest Degree Certificate{" "}
                                        <span style={{ fontSize: "0.85rem", color: "#6c757d", fontStyle: "italic" }}>
                                            (Please upload in PDF format)
                                        </span>
                                    </label>
                                    <CFormInput
                                        type="file"
                                        onChange={(e) =>
                                            handleFileChange(e, setDegreeDocument, /\.(pdf)$/i, "Highest Degree Certificate")
                                        }
                                    />
                                </CCol>

                                <CCol md={6}>
                                    <label>
                                        Emirates ID Attachment{" "}
                                        <span style={{ fontSize: "0.85rem", color: "#6c757d", fontStyle: "italic" }}>
                                            (Please upload in PDF format)
                                        </span>
                                    </label>
                                    <CFormInput
                                        type="file"
                                        onChange={(e) =>
                                            handleFileChange(e, setEmiratesIDDocument, /\.(pdf)$/i, "Emirates ID Attachment")
                                        }
                                    />
                                </CCol>

                                <CCol md={6}>
                                    <label>
                                        Visa Attachment{" "}
                                        <span style={{ fontSize: "0.85rem", color: "#6c757d", fontStyle: "italic" }}>
                                            (Please upload in PDF format)
                                        </span>
                                    </label>
                                    <CFormInput
                                        type="file"
                                        onChange={(e) =>
                                            handleFileChange(e, setVisaDocument, /\.(pdf)$/i, "Visa Attachment")
                                        }
                                    />
                                </CCol>

                                <CCol md={6}>
                                    <label>
                                        Insurance Card Attachment{" "}
                                        <span style={{ fontSize: "0.85rem", color: "#6c757d", fontStyle: "italic" }}>
                                            (Please upload in PDF format)
                                        </span>
                                    </label>
                                    <CFormInput
                                        type="file"
                                        onChange={(e) =>
                                            handleFileChange(e, setInsuranceDocument, /\.(pdf)$/i, "Insurance Card Attachment")
                                        }
                                    />
                                </CCol>

                            </CRow>
                            <CButton color="primary" onClick={handleSubmit} className="mt-4">
                                Save Changes
                            </CButton>
                        </CForm>
                    </CCardBody>
                </CCard>
            </CContainer>
        </div>
    );
};

export default AddEmployee;


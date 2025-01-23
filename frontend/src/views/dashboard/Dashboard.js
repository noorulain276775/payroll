import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CAvatar,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPeople } from '@coreui/icons';

import avatar1 from 'src/assets/images/avatars/1.jpg';
import avatar2 from 'src/assets/images/avatars/2.jpg';
import avatar3 from 'src/assets/images/avatars/3.jpg';
import MainChart from './MainChart';
import { DashboardWidgets } from '../../components/DashboardWidgets';

const Dashboard = () => {
  const navigate = useNavigate();

  // Authentication check
  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      navigate('/'); // Redirect to login if no token
    }
  }, [navigate]);

  const monthlyPayrollData = [20000, 22000, 25000, 24000, 21000, 23000];
  const employeeData = [
    { avatar: avatar1, name: 'Noor ul ain Ibrahim', designation: 'Software Engineer', department: 'IT' },
    { avatar: avatar2, name: 'Ghazia', designation: 'Assistant Accounts', department: 'Accounts' },
    { avatar: avatar3, name: 'Wasim Bhai', designation: 'Manager Operations', department: 'Operations' },
  ];

  return (
    <>
      <DashboardWidgets />
      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={12}>
              <h4 id="payroll" className="card-title mb-0">
                Total Payroll and Overtime Each Month
              </h4>
              <div className="small text-body-secondary">Data for the last 6 months</div>
            </CCol>
          </CRow>
          <MainChart data={monthlyPayrollData} />
        </CCardBody>
      </CCard>

      {/* Employees Table */}
      <CCard>
        <CCardHeader>Newly Added Employees</CCardHeader>
        <CCardBody>
          <CTable align="middle" className="mb-0 border" hover responsive>
            <CTableHead className="text-nowrap">
              <CTableRow>
                <CTableHeaderCell className="bg-body-tertiary text-center">
                  <CIcon icon={cilPeople} />
                </CTableHeaderCell>
                <CTableHeaderCell className="bg-body-tertiary">Employee Name</CTableHeaderCell>
                <CTableHeaderCell className="bg-body-tertiary">Designation</CTableHeaderCell>
                <CTableHeaderCell className="bg-body-tertiary">Department</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {employeeData.map((item, index) => (
                <CTableRow key={index}>
                  <CTableDataCell className="text-center">
                    <CAvatar size="md" src={item.avatar} />
                  </CTableDataCell>
                  <CTableDataCell>{item.name}</CTableDataCell>
                  <CTableDataCell>{item.designation}</CTableDataCell>
                  <CTableDataCell>{item.department}</CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
    </>
  );
};

export default Dashboard;

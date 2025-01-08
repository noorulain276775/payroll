import React, { useState } from 'react';

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
  const monthlyPayrollData = [20000, 22000, 25000, 24000, 21000, 23000];
  const employeeData = [
    { avatar: avatar1, name: 'Noor ul ain Ibrahim', designation: 'Software Engineer', department: 'IT' },
    { avatar: avatar2, name: 'Ghazia', designation: 'Assistant Accounts', department: "Accounts" },
    { avatar: avatar3, name: 'Wasim Bhai', designation: 'Manager Operations', department: 'Operations' },
  ];

  return (
    <>
      {/* <div className='mb-4'>
        <CRow>
          <CCol sm={4}>
            <CCard
              className="text-white bg-danger"
              style={{
                height: '200px',
                borderRadius: '15px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              }}
            >
              <CCardBody
                className="d-flex justify-content-center align-items-center text-center"
                style={{
                  position: 'relative',
                  height: '100%',
                  padding: 0,  
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 100 100"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '200px',
                    opacity: 0.3,
                    zIndex: 1,
                  }}
                >
                  <circle cx="50" cy="50" r="40" fill="white" />
                  <circle cx="25" cy="25" r="10" fill="#ffdd57" />
                  <circle cx="75" cy="25" r="10" fill="#ffdd57" />
                  <circle cx="75" cy="75" r="10" fill="#ffdd57" />
                  <circle cx="25" cy="75" r="10" fill="#ffdd57" />
                </svg>
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <div className="fs-5">Total Employees</div>
                  <div className="fw-semibold" style={{ fontSize: '2rem' }}>
                    {totalEmployees.toLocaleString()}
                  </div>
                </div>
              </CCardBody>
            </CCard>
          </CCol>

          <CCol sm={4}>
            <CCard
              className="text-white bg-success"
              style={{
                height: '200px',
                borderRadius: '15px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              }}
            >
              <CCardBody
                className="d-flex justify-content-center align-items-center text-center"
                style={{
                  position: 'relative',
                  height: '100%',
                  padding: 0,
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 100 100"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '200px',
                    opacity: 0.3,
                    zIndex: 1,
                  }}
                >
                  <circle cx="50" cy="50" r="40" fill="white" />
                  <circle cx="25" cy="25" r="10" fill="#ffdd57" />
                  <circle cx="75" cy="25" r="10" fill="#ffdd57" />
                  <circle cx="75" cy="75" r="10" fill="#ffdd57" />
                  <circle cx="25" cy="75" r="10" fill="#ffdd57" />
                </svg>
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <div className="fs-5">Previous Payroll</div>
                  <div className="fw-semibold" style={{ fontSize: '2rem' }}>
                    ${previousPayroll.toLocaleString()}
                  </div>
                </div>
              </CCardBody>
            </CCard>
          </CCol>

          <CCol sm={4}>
            <CCard
              className="text-white bg-warning"
              style={{
                height: '200px',
                borderRadius: '15px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              }}
            >
              <CCardBody
                className="d-flex justify-content-center align-items-center text-center"
                style={{
                  position: 'relative',
                  height: '100%',
                  padding: 0,
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 100 100"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '200px',
                    opacity: 0.3,
                    zIndex: 1,
                  }}
                >
                  <circle cx="50" cy="50" r="40" fill="white" />
                  <circle cx="25" cy="25" r="10" fill="#ffdd57" />
                  <circle cx="75" cy="25" r="10" fill="#ffdd57" />
                  <circle cx="75" cy="75" r="10" fill="#ffdd57" />
                  <circle cx="25" cy="75" r="10" fill="#ffdd57" />
                </svg>
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <div className="fs-5">Average Salary</div>
                  <div className="fw-semibold" style={{ fontSize: '2rem' }}>
                    ${averageSalary.toLocaleString()}
                  </div>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </div> */}
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
                  <CTableDataCell>${item.department}</CTableDataCell>
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

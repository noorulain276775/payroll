import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CAvatar, CCard, CCardBody, CCardHeader, CCol, CRow, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPeople } from '@coreui/icons';
import MainChart from './MainChart';
import { DashboardWidgets } from '../../components/DashboardWidgets';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../../config';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [newEmployees, setNewEmployees] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      navigate('/');
    }
  }, [navigate]);

  // Fetch dashboard summary and new employees
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/dashboard-summary/`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
        });
        setDashboardData(response.data);
              } catch (error) {
          if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            localStorage.removeItem('authToken');
            navigate('/');
          } else {
            console.error('Error fetching dashboard data:', error);
          }
        }
    };

    const fetchNewEmployees = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/new_employees/`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
        });
        setNewEmployees(response.data);
              } catch (error) {
          if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            localStorage.removeItem('authToken');
            navigate('/');
          } else {
            console.error('Error fetching new employees:', error);
          }
        }
    };

    fetchDashboardData();
    fetchNewEmployees();
  }, [navigate]);


  if (!dashboardData) {
    return <div>Loading...</div>; // Show a loading state if data is not yet loaded
  }

  return (
    <>
      <DashboardWidgets
        totalSalaryForMonth={dashboardData.total_salary_for_month}
        totalOvertimeForMonth={dashboardData.total_overtime_for_month}
        previousMonthSalary={dashboardData.previous_month_salary}
        previousMonthOvertime={dashboardData.previous_month_overtime}
        totalEmployees={dashboardData.total_employees}
        averageSalaryForMonth={dashboardData.average_salary_for_month}
      />

      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={12}>
              <h4 id="payroll" className="card-title mb-0">
                Total Payroll Each Month this year
              </h4>
              <div className="small text-body-secondary">This is 12 months data for current year</div>
            </CCol>
          </CRow>
          <MainChart monthlyData={dashboardData.monthly_data} />
        </CCardBody>
      </CCard>

      {/* Newly Added Employees Table */}
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
              {newEmployees.map((item, index) => (
                <CTableRow key={index}>
                  <CTableDataCell className="text-center">
                    <img height={50} width={50} style={{ borderRadius: '50px' }} size="md" src={`${BASE_URL}${item.photo}`} />
                  </CTableDataCell>
                  <CTableDataCell>{item.first_name} {item.last_name}</CTableDataCell>
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

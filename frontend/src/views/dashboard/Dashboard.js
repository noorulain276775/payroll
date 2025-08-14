import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CAvatar, CCard, CCardBody, CCardHeader, CCol, CRow, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilUser } from '@coreui/icons';
import MainChart from './MainChart';
import { DashboardWidgets } from '../../components/DashboardWidgets';
import { useNavigate } from 'react-router-dom';
import { selectIsAuthenticated } from '../../store/slices/authSlice';
import { fetchEmployees } from '../../store/slices/employeeSlice';
import { selectEmployees, selectEmployeesLoading } from '../../store/slices/employeeSlice';

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const hasFetchedRef = useRef(false);
  
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const employees = useSelector(selectEmployees);
  const isLoading = useSelector(selectEmployeesLoading);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    // Fetch employees for dashboard - only once when component mounts
    if (!hasFetchedRef.current) {
      dispatch(fetchEmployees());
      hasFetchedRef.current = true;
    }
  }, [isAuthenticated, navigate, dispatch]);

  // Mock dashboard data (replace with actual API call)
  const dashboardData = {
    total_salary_for_month: 150000,
    total_overtime_for_month: 5000,
    previous_month_salary: 145000,
    previous_month_overtime: 4500,
    total_employees: employees.length || 0,
    average_salary_for_month: employees.length > 0 ? 150000 / employees.length : 0,
    monthly_data: [
      { month: 'Jan', salary: 140000, overtime: 4000 },
      { month: 'Feb', salary: 142000, overtime: 4200 },
      { month: 'Mar', salary: 145000, overtime: 4500 },
      { month: 'Apr', salary: 148000, overtime: 4800 },
      { month: 'May', salary: 150000, overtime: 5000 },
      { month: 'Jun', salary: 152000, overtime: 5200 },
    ]
  };

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return <div>Loading dashboard...</div>;
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
                  <CIcon icon={cilUser} />
                </CTableHeaderCell>
                <CTableHeaderCell className="bg-body-tertiary">Employee</CTableHeaderCell>
                <CTableHeaderCell className="bg-body-tertiary">Department</CTableHeaderCell>
                <CTableHeaderCell className="bg-body-tertiary">Designation</CTableHeaderCell>
                <CTableHeaderCell className="bg-body-tertiary">Joining Date</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {employees.slice(0, 5).map((employee) => (
                <CTableRow key={employee.id}>
                  <CTableDataCell className="text-center">
                    <CAvatar size="md" src={employee.profile_picture} />
                  </CTableDataCell>
                  <CTableDataCell>
                    <div>{employee.first_name} {employee.last_name}</div>
                    <div className="small text-body-secondary">{employee.personal_email}</div>
                  </CTableDataCell>
                  <CTableDataCell>{employee.department}</CTableDataCell>
                  <CTableDataCell>{employee.designation}</CTableDataCell>
                  <CTableDataCell>{employee.joining_date}</CTableDataCell>
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

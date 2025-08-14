import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
  CSpinner,
  CAlert
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilUser } from '@coreui/icons';
import { fetchEmployees } from '../../store/slices/employeeSlice';
import { selectEmployees, selectEmployeesLoading, selectEmployeesError } from '../../store/slices/employeeSlice';
import { selectIsAuthenticated } from '../../store/slices/authSlice';

const EmployeeDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Redux state
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const employees = useSelector(selectEmployees);
  const isLoading = useSelector(selectEmployeesLoading);
  const error = useSelector(selectEmployeesError);

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    // Fetch employees data
    dispatch(fetchEmployees());
  }, [dispatch, isAuthenticated, navigate]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <CSpinner color="primary" size="lg" />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <CAlert color="danger" className="mb-4">
        <strong>Error:</strong> {error}
      </CAlert>
    );
  }

  // Get recent employees (last 10)
  const recentEmployees = employees.slice(0, 10);

  return (
    <>
      {/* Recent Employees Table */}
      <CCard>
        <CCardHeader>
          <h4 className="mb-0">
            <CIcon icon={cilUser} className="me-2" />
            Recent Colleagues
          </h4>
        </CCardHeader>
        <CCardBody>
          {recentEmployees.length === 0 ? (
            <div className="text-center text-muted py-4">
              <CIcon icon={cilUser} size="3xl" className="mb-3" />
              <p>No employees found</p>
            </div>
          ) : (
            <CTable align="middle" className="mb-0 border" hover responsive>
              <CTableHead className="text-nowrap">
                <CTableRow>
                  <CTableHeaderCell className="bg-body-tertiary text-center">
                    <CIcon icon={cilUser} />
                  </CTableHeaderCell>
                  <CTableHeaderCell className="bg-body-tertiary">Employee Name</CTableHeaderCell>
                  <CTableHeaderCell className="bg-body-tertiary">Designation</CTableHeaderCell>
                  <CTableHeaderCell className="bg-body-tertiary">Department</CTableHeaderCell>
                  <CTableHeaderCell className="bg-body-tertiary">Joining Date</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {recentEmployees.map((employee, index) => (
                  <CTableRow key={employee.id || index}>
                    <CTableDataCell className="text-center">
                      {employee.photo ? (
                        <img 
                          height={50} 
                          width={50} 
                          style={{ borderRadius: '50px', objectFit: 'cover' }} 
                          src={employee.photo.startsWith('http') ? employee.photo : `${process.env.REACT_APP_API_URL || ''}${employee.photo}`}
                          alt={`${employee.first_name} ${employee.last_name}`}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                          }}
                        />
                      ) : (
                        <CAvatar 
                          size="md" 
                          color="primary"
                          className="d-flex align-items-center justify-content-center"
                        >
                          {employee.first_name?.charAt(0)}{employee.last_name?.charAt(0)}
                        </CAvatar>
                      )}
                    </CTableDataCell>
                    <CTableDataCell>
                      <strong>{employee.first_name} {employee.last_name}</strong>
                      {employee.email && (
                        <div className="small text-muted">{employee.email}</div>
                      )}
                    </CTableDataCell>
                    <CTableDataCell>{employee.designation || 'N/A'}</CTableDataCell>
                    <CTableDataCell>{employee.department || 'N/A'}</CTableDataCell>
                    <CTableDataCell>
                      {employee.joining_date ? new Date(employee.joining_date).toLocaleDateString() : 'N/A'}
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          )}
        </CCardBody>
      </CCard>
    </>
  );
};

export default EmployeeDashboard;


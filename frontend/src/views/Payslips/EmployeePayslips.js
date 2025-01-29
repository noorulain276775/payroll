import React, { useEffect } from 'react';

const EmployeePayslips = () => {
  useEffect(() => {
    try {
      console.log("Employee Payslip Loaded");
    } catch (error) {
      console.error("Error in EmployeeDashboard:", error);
    }
  }, []);

  return <div>Welcome to Employee Payslips</div>;
};

export default EmployeePayslips;

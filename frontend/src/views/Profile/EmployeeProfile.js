import React, { useEffect } from 'react';

const EmployeeProfile = () => {
  useEffect(() => {
    try {
      console.log("EmployeeDashboard Loaded");
      // Any API calls or state changes should go here
    } catch (error) {
      console.error("Error in EmployeeDashboard:", error);
    }
  }, []);

  return <div>Welcome to Employee Profile</div>;
};

export default EmployeeProfile;

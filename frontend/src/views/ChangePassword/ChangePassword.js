import React, { useEffect } from 'react';

const ChangePassword = () => {
  useEffect(() => {
    try {
      console.log("Change Password loaded");
    } catch (error) {
      console.error("Error in Change Password:", error);
    }
  }, []);

  return <div>You can change the password here</div>;
};

export default ChangePassword;
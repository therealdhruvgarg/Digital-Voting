// utils/otp.js
export const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
  };
  
  export const verifyOTP = (enteredOTP, actualOTP) => {
    return enteredOTP === actualOTP;
  };
  
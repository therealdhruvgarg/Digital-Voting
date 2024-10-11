import React, { useState } from "react";
import { mockDatabase } from "../mockData/mockDatabase";
import { generateOTP, verifyOTP } from "../utils/otp";
import VotingComponent from "./VotingComponent";

const Login = () => {
  const [aadhaar, setAadhaar] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [error, setError] = useState("");

  const handleAadhaarSubmit = () => {
    // Check if Aadhaar exists in mock database
    if (mockDatabase[aadhaar]) {
      setMobile(mockDatabase[aadhaar]);
      const otp = generateOTP();
      setGeneratedOtp(otp);
      setOtpSent(true);
      alert(`OTP sent to mobile number: ${mockDatabase[aadhaar]}. OTP: ${otp}`); // For simplicity, display OTP
    } else {
      setError("Aadhaar number not found");
    }
  };

  const handleOtpSubmit = () => {
    if (verifyOTP(otp, generatedOtp)) {
      setOtpVerified(true);
      alert("OTP verified! You can now vote.");
    } else {
      setError("Invalid OTP");
    }
  };

  if (otpVerified) {
    return <VotingComponent />; // Render the voting component after successful OTP verification
  }

  return (
    <div>
      <h2>Login to Vote</h2>
      {!otpSent ? (
        <>
          <input
            type="text"
            placeholder="Enter 12-digit Aadhaar number"
            value={aadhaar}
            onChange={(e) => setAadhaar(e.target.value)}
          />
          <button onClick={handleAadhaarSubmit}>Submit Aadhaar</button>
          {error && <p>{error}</p>}
        </>
      ) : (
        <>
          <p>OTP sent to mobile: {mobile}</p>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={handleOtpSubmit}>Submit OTP</button>
          {error && <p>{error}</p>}
        </>
      )}
    </div>
  );
};

export default Login;

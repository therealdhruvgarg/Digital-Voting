import React, { useState } from "react";
import { mockDatabase } from "../mockData/mockDatabase";
import { generateOTP, verifyOTP } from "../utils/otp";
import VotingComponent from "./VotingComponent";
import '../index.css'

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
      <h2 className="text-2xl font-semibold  w-fit mt-3">Login to Vote</h2>
      {!otpSent ? (
        <div className="my-2">
          <input
            type="text"
            placeholder="Enter 12-digit Aadhaar number"
            value={aadhaar}
            onChange={(e) => setAadhaar(e.target.value)}
            className="mr-5 border rounded-xl px-2 py-1 text-lg"
          />
          <button className="rounded-2xl py-1 px-3 uppercase font-semibold cursor-pointer tracking-wider text-gray-400 border-gray-400 md:border-2 ml-2 hover:bg-gray-400 hover:text-white transition ease-out duration-500" onClick={handleAadhaarSubmit}>Submit Aadhaar</button>
          {error && <p className="text-red-400 text-lg">{error}</p>}
        </div>
      ) : (
        <div>
          <p className="text-lg py-2 text-gray-600">OTP sent to mobile: {mobile}</p>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="mr-5 border rounded-2xl py-1 px-3"
          />
          <button className="rounded-2xl py-1 px-3 uppercase font-semibold cursor-pointer tracking-wider text-gray-400 border-gray-400 md:border-2 ml-2 hover:bg-gray-400 hover:text-white transition ease-out duration-500" onClick={handleOtpSubmit}>Submit OTP</button>
          {error && <p className="text-lg text-red-400 py-2">{error}</p>}
        </div>
      )}
    </div>
  );
};

export default Login;

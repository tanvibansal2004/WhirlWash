// /**
//  * Calculate time remaining from an expiry timestamp
//  * @param {string} expiryTimeStr - ISO string of expiry time
//  * @param {number} pausedTime - Additional time in milliseconds to add (for paused machines)
//  * @returns {number} Seconds remaining
//  */
// export const getTimeRemaining = (expiryTimeStr, pausedTime = 0) => {
//   if (!expiryTimeStr) return 0;

//   const expiryTime = new Date(expiryTimeStr);
//   const now = new Date();
//   const diffMs = expiryTime - now + pausedTime;

//   return Math.max(0, Math.floor(diffMs / 1000)); // Return seconds remaining
// };

// /**
//  * Format seconds into a readable time format
//  * @param {number} seconds - Seconds to format
//  * @returns {string} Formatted time string
//  */
// export const formatTime = (seconds) => {
//   if (seconds <= 0) return 'Time expired';
  
//   if (seconds < 60) {
//     return `${seconds}s remaining`;
//   }
  
//   const minutes = Math.floor(seconds / 60);
//   const remainingSeconds = seconds % 60;
  
//   return `${minutes}m ${remainingSeconds}s remaining`;
// };

// /**
//  * Create a cooldown time (30 seconds from now)
//  * @returns {string} ISO string of cooldown time
//  */
// export const createCooldownTime = () => {
//   const cooldownTime = new Date();
//   cooldownTime.setSeconds(cooldownTime.getSeconds() + 30);
//   return cooldownTime.toISOString();
// };

// /**
//  * Create a penalty time (1 minute from now)
//  * @returns {string} ISO string of penalty time
//  */
// export const createPenaltyTime = () => {
//   const penaltyTime = new Date();
//   penaltyTime.setMinutes(penaltyTime.getMinutes() + 1);
//   return penaltyTime.toISOString();
// };

// /**
//  * Create a booking expiry time (45 seconds from now)
//  * @returns {string} ISO string of expiry time
//  */
// export const createExpiryTime = () => {
//   const expiryTime = new Date();
//   expiryTime.setSeconds(expiryTime.getSeconds() + 45);
//   return expiryTime.toISOString();
// };

// /**
//  * Create an OTP verification expiry time (60 seconds from now)
//  * @returns {string} ISO string of OTP verification expiry time
//  */
// export const createOTPVerifyExpiryTime = () => {
//   const otpVerifyExpiryTime = new Date();
//   otpVerifyExpiryTime.setSeconds(otpVerifyExpiryTime.getSeconds() + 60);
//   return otpVerifyExpiryTime.toISOString();
// };

// /**
//  * Generate a 6-digit OTP
//  * @returns {string} 6-digit OTP
//  */
// export const generateOTP = () => {
//   return Math.floor(100000 + Math.random() * 900000).toString();
// };

// /**
//  * Check if a time has expired
//  * @param {string} timeStr - ISO string of time to check
//  * @returns {boolean} True if time has expired
//  */
// export const hasTimeExpired = (timeStr) => {
//   if (!timeStr) return true;
  
//   const time = new Date(timeStr);
//   const now = new Date();
  
//   return time <= now;
// };

// /**
//  * Calculate time remaining from an expiry timestamp
//  * @param {string} expiryTimeStr - ISO string of expiry time
//  * @param {number} pausedTime - Additional time in milliseconds to add (for paused machines)
//  * @returns {number} Seconds remaining
//  */
// export const getTimeRemaining = (expiryTimeStr, pausedTime = 0) => {
//     if (!expiryTimeStr) return 0;
  
//     const expiryTime = new Date(expiryTimeStr);
//     const now = new Date();
//     const diffMs = expiryTime - now + pausedTime;
  
//     return Math.max(0, Math.floor(diffMs / 1000)); // Return seconds remaining
//   };
  
//   /**
//    * Format seconds into a readable time format
//    * @param {number} seconds - Seconds to format
//    * @returns {string} Formatted time string
//    */
//   export const formatTime = (seconds) => {
//     if (seconds <= 0) return 'Time expired';
    
//     if (seconds < 60) {
//       return `${seconds}s remaining`;
//     }
    
//     const minutes = Math.floor(seconds / 60);
//     const remainingSeconds = seconds % 60;
    
//     return `${minutes}m ${remainingSeconds}s remaining`;
//   };
  
//   /**
//    * Create a cooldown time (30 seconds from now)
//    * @returns {string} ISO string of cooldown time
//    */
//   export const createCooldownTime = () => {
//     const cooldownTime = new Date();
//     cooldownTime.setSeconds(cooldownTime.getSeconds() + 30);
//     return cooldownTime.toISOString();
//   };
  
//   /**
//    * Create a penalty time (1 minute from now)
//    * @returns {string} ISO string of penalty time
//    */
//   export const createPenaltyTime = () => {
//     const penaltyTime = new Date();
//     penaltyTime.setMinutes(penaltyTime.getMinutes() + 1);
//     return penaltyTime.toISOString();
//   };
  
//   /**
//    * Create a booking expiry time (45 seconds from now)
//    * @returns {string} ISO string of expiry time
//    */
//   export const createExpiryTime = () => {
//     const expiryTime = new Date();
//     expiryTime.setSeconds(expiryTime.getSeconds() + 45);
//     return expiryTime.toISOString();
//   };
  
//   /**
//    * Check if a time has expired
//    * @param {string} timeStr - ISO string of time to check
//    * @returns {boolean} True if time has expired
//    */
//   export const hasTimeExpired = (timeStr) => {
//     if (!timeStr) return true;
    
//     const time = new Date(timeStr);
//     const now = new Date();
    
//     return time <= now;
//   };

/**
 * Calculate time remaining from an expiry timestamp
 * @param {string} expiryTimeStr - ISO string of expiry time
 * @param {number} pausedTime - Additional time in milliseconds to add (for paused machines)
 * @returns {number} Seconds remaining
 */
export const getTimeRemaining = (expiryTimeStr, pausedTime = 0) => {
  if (!expiryTimeStr) return 0;

  const expiryTime = new Date(expiryTimeStr);
  const now = new Date();
  const diffMs = expiryTime - now + pausedTime;

  return Math.max(0, Math.floor(diffMs / 1000)); // Return seconds remaining
};

/**
 * Format seconds into a readable time format
 * @param {number} seconds - Seconds to format
 * @returns {string} Formatted time string
 */
export const formatTime = (seconds) => {
  if (seconds <= 0) return 'Time expired';
  
  if (seconds < 60) {
    return `${seconds}s remaining`;
  }
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  return `${minutes}m ${remainingSeconds}s remaining`;
};

/**
 * Create a cooldown time (30 seconds from now)
 * @returns {string} ISO string of cooldown time
 */
export const createCooldownTime = () => {
  const cooldownTime = new Date();
  cooldownTime.setSeconds(cooldownTime.getSeconds() + 30);
  return cooldownTime.toISOString();
};

/**
 * Create a penalty time (1 minute from now)
 * @returns {string} ISO string of penalty time
 */
export const createPenaltyTime = () => {
  const penaltyTime = new Date();
  penaltyTime.setMinutes(penaltyTime.getMinutes() + 1);
  return penaltyTime.toISOString();
};

/**
 * Create a booking expiry time (45 seconds from now)
 * @returns {string} ISO string of expiry time
 */
export const createExpiryTime = () => {
  const expiryTime = new Date();
  expiryTime.setSeconds(expiryTime.getSeconds() + 45);
  return expiryTime.toISOString();
};

/**
 * Create an OTP verification expiry time (60 seconds from now)
 * @returns {string} ISO string of OTP verification expiry time
 */
export const createOTPVerifyExpiryTime = () => {
  const otpVerifyExpiryTime = new Date();
  otpVerifyExpiryTime.setSeconds(otpVerifyExpiryTime.getSeconds() + 60);
  return otpVerifyExpiryTime.toISOString();
};

/**
 * Generate a 6-digit OTP
 * @returns {string} 6-digit OTP
 */
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Check if a time has expired
 * @param {string} timeStr - ISO string of time to check
 * @returns {boolean} True if time has expired
 */
export const hasTimeExpired = (timeStr) => {
  if (!timeStr) return true;
  
  const time = new Date(timeStr);
  const now = new Date();
  
  return time <= now;
};
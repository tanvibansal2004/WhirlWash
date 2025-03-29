import { useState, useEffect } from 'react';
import electricityService from '../services/electricityService';

/**
 * Custom hook to manage electricity shortage status
 * @returns {Object} Electricity status information
 */
const useElectricityStatus = () => {
  const [electricityShortage, setElectricityShortage] = useState(false);
  const [electricityShortageStartTime, setElectricityShortageStartTime] = useState(null);

  useEffect(() => {
    // Set up listener for electricity shortage status
    const unsubscribe = electricityService.subscribeToElectricityStatus(
      ({ isShortage, startTime }) => {
        // Update electricity status
        setElectricityShortage(isShortage);
        setElectricityShortageStartTime(startTime);
        
        // If status changes, update machine timers
        if (isShortage && startTime) {
          electricityService.updateMachineTimersDuringShortage(startTime);
        } else if (!isShortage && electricityShortage) {
          // If shortage ends, resume timers
          electricityService.resumeMachineTimersAfterShortage();
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, [electricityShortage]);

  return {
    electricityShortage,
    electricityShortageStartTime,
  };
};

export default useElectricityStatus;
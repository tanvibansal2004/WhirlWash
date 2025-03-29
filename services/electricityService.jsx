import firestore from '@react-native-firebase/firestore';

/**
 * Service to handle electricity status related operations
 */
const electricityService = {
  /**
   * Listen to changes in electricity status
   * @param {Function} callback - Function to call with updated status
   * @returns {Function} Unsubscribe function
   */
  subscribeToElectricityStatus: (callback) => {
    return firestore()
      .collection('systemStatus')
      .doc('electricityStatus')
      .onSnapshot(
        (snapshot) => {
          const data = snapshot.data() || {};
          const status = {
            isShortage: data.isShortage || false,
            startTime: data.startTime ? data.startTime.toDate() : null,
          };
          callback(status);
        },
        (error) => {
          console.error('Error listening to electricity status:', error);
          callback({ isShortage: false, startTime: null, error });
        }
      );
  },

  /**
   * Update machine timers during electricity shortage
   * @param {Date} shortageStartTime - When the shortage started
   * @returns {Promise<void>}
   */
  updateMachineTimersDuringShortage: async (shortageStartTime) => {
    if (!shortageStartTime) return;

    try {
      // Query for currently booked machines
      const bookedMachinesQuery = await firestore()
        .collection('machines')
        .where('inUse', '==', true)
        .get();

      const batch = firestore().batch();

      bookedMachinesQuery.forEach((machineDoc) => {
        const machineData = machineDoc.data();

        // If machine is in use, extend its expiry time
        if (machineData.expiryTime) {
          const currentExpiryTime = new Date(machineData.expiryTime);
          const timePaused = new Date() - shortageStartTime;

          batch.update(machineDoc.ref, {
            expiryTime: currentExpiryTime.toISOString(),
            pausedTime: timePaused,
            isPaused: true,
          });
        }
      });

      await batch.commit();
    } catch (error) {
      console.error('Error updating machine timers:', error);
      throw error;
    }
  },

  /**
   * Resume machine timers after electricity is restored
   * @returns {Promise<void>}
   */
  resumeMachineTimersAfterShortage: async () => {
    try {
      // Query for paused machines
      const pausedMachinesQuery = await firestore()
        .collection('machines')
        .where('isPaused', '==', true)
        .get();

      const batch = firestore().batch();

      pausedMachinesQuery.forEach((machineDoc) => {
        batch.update(machineDoc.ref, {
          isPaused: false,
          pausedTime: 0,
        });
      });

      await batch.commit();
    } catch (error) {
      console.error('Error resuming machine timers:', error);
      throw error;
    }
  },
};

export default electricityService;
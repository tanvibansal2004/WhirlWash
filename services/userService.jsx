import firestore from '@react-native-firebase/firestore';
import { createCooldownTime, createPenaltyTime } from '../utils/timeUtils';

/**
 * Service to handle user-related operations
 */
const userService = {
  /**
   * Get user details
   * @param {string} userEmail - Email of the user
   * @returns {Promise<Object|null>} User details or null if not found
   */
  getUserDetails: async (userEmail) => {
    try {
      const userQuery = await firestore()
        .collection('students')
        .where('Email', '==', userEmail)
        .limit(1)
        .get();

      if (userQuery.empty) {
        return null;
      }

      return userQuery.docs[0].data();
    } catch (error) {
      console.error('Error getting user details:', error);
      throw error;
    }
  },

  /**
   * Get user document reference
   * @param {string} userEmail - Email of the user
   * @returns {Promise<Object|null>} User document reference or null if not found
   */
  getUserDocRef: async (userEmail) => {
    try {
      const userQuery = await firestore()
        .collection('students')
        .where('Email', '==', userEmail)
        .limit(1)
        .get();

      if (userQuery.empty) {
        return null;
      }

      return userQuery.docs[0].ref;
    } catch (error) {
      console.error('Error getting user doc ref:', error);
      throw error;
    }
  },

  /**
   * Apply cooldown to user after unbooking a machine
   * @param {string} userEmail - Email of the user
   * @returns {Promise<void>}
   */
  applyCooldown: async (userEmail) => {
    try {
      const userDocRef = await userService.getUserDocRef(userEmail);
      if (!userDocRef) {
        throw new Error('User not found');
      }

      const userData = (await userDocRef.get()).data();

      // Update lastUses array
      let updatedLastUses = userData.lastUses || ['', '', '', '', ''];
      const newEntry = new Date().toISOString();
      updatedLastUses.shift();
      updatedLastUses.push(newEntry);

      // Calculate cooldown time (30 seconds from now)
      const cooldownTime = createCooldownTime();

      // Update user with new lastUses and cooldown
      await userDocRef.update({
        lastUses: updatedLastUses,
        cooldownUntil: cooldownTime,
      });
    } catch (error) {
      console.error('Error applying cooldown:', error);
      throw error;
    }
  },

  /**
   * Apply penalty to user for not unbooking a machine
   * @param {string} userEmail - Email of the user
   * @returns {Promise<void>}
   */
  applyPenalty: async (userEmail) => {
    try {
      const userDocRef = await userService.getUserDocRef(userEmail);
      if (!userDocRef) {
        return; // Silently fail if user not found
      }

      const userData = (await userDocRef.get()).data();

      // Update lastUses array
      let updatedLastUses = userData.lastUses || ['', '', '', '', ''];
      const newEntry = new Date().toISOString();
      updatedLastUses.shift();
      updatedLastUses.push(newEntry);

      // Calculate penalty time (1 minute from now)
      const penaltyTime = createPenaltyTime();

      // Update user's lastUses list and add penalty
      await userDocRef.update({
        lastUses: updatedLastUses,
        penaltyUntil: penaltyTime,
        hasPenaltyNotification: true, // Add a flag to indicate pending notification
      });
    } catch (error) {
      console.error('Error applying penalty:', error);
      // Don't throw, just log error
    }
  },

  /**
   * Check if user is under restriction (cooldown or penalty)
   * @param {string} userEmail - Email of the user
   * @returns {Promise<Object>} Restriction status
   */
  checkUserRestrictions: async (userEmail) => {
    try {
      const userData = await userService.getUserDetails(userEmail);
      if (!userData) {
        return { isRestricted: false };
      }

      const now = new Date();
      let isRestricted = false;
      let restrictionType = null;
      let restrictionEndsAt = null;
      let secondsRemaining = 0;

      // Check for penalty period
      if (userData.penaltyUntil) {
        const penaltyTime = new Date(userData.penaltyUntil);
        if (penaltyTime > now) {
          isRestricted = true;
          restrictionType = 'penalty';
          restrictionEndsAt = penaltyTime;
          secondsRemaining = Math.ceil((penaltyTime - now) / 1000);
        }
      }

      // Check for cooldown period if not under penalty
      if (!isRestricted && userData.cooldownUntil) {
        const cooldownTime = new Date(userData.cooldownUntil);
        if (cooldownTime > now) {
          isRestricted = true;
          restrictionType = 'cooldown';
          restrictionEndsAt = cooldownTime;
          secondsRemaining = Math.ceil((cooldownTime - now) / 1000);
        }
      }

      return {
        isRestricted,
        restrictionType,
        restrictionEndsAt,
        secondsRemaining,
      };
    } catch (error) {
      console.error('Error checking user restrictions:', error);
      return { isRestricted: false };
    }
  },
};

export default userService;
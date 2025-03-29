import { format } from 'date-fns';
import firestore from '@react-native-firebase/firestore';

/**
 * Formats a timestamp using date-fns library with a specific format
 * @param {Date|Object} timestamp - A Date object or Firestore timestamp
 * @returns {string} Formatted date string or 'Unknown' if invalid
 */
export const formatTimestamp = timestamp => {
  if (!timestamp) return 'Unknown';

  try {
    const date =
      timestamp instanceof firestore.Timestamp
        ? timestamp.toDate()
        : new Date(timestamp);

    return format(date, 'MMM d, yyyy • h:mm a');
  } catch (error) {
    console.error('Error formatting timestamp:', error);
    return 'Invalid Date';
  }
};

/**
 * Formats a date or timestamp using native JavaScript methods
 * @param {Date|Object|string} timestamp - A Date object, Firestore timestamp, or date string
 * @returns {string} Formatted date string or empty string if invalid
 */
export const formatDate = (timestamp) => {
  if (!timestamp || timestamp === "") return '';

  try {
    const date = typeof timestamp === 'object' && timestamp.toDate ? 
      timestamp.toDate() : new Date(timestamp);
    
    if (!isNaN(date.getTime())) {
      return date.toLocaleString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      });
    }
  } catch (e) {
    console.error('Error parsing date:', e);
  }
  
  return '';
};

/**
 * Formats seconds into a readable time remaining string
 * @param {number} seconds - Number of seconds
 * @returns {string} Formatted time remaining string
 */
export const formatTimeRemaining = (seconds) => {
  return `${seconds} ${seconds === 1 ? 'second' : 'seconds'} remaining`;
};

/**
 * Unified date formatting function that can handle various formats
 * @param {Date|Object|string} date - A Date object, Firestore timestamp, or date string
 * @param {string} [formatType='default'] - Format type: 'default', 'timestamp', or 'compact'
 * @returns {string} Formatted date string
 */
export const formatDateUnified = (date, formatType = 'default') => {
  if (!date) return '';
  
  try {
    // Handle different date input types
    let dateObj;
    if (date instanceof firestore.Timestamp) {
      dateObj = date.toDate();
    } else if (typeof date === 'object' && date.toDate) {
      dateObj = date.toDate();
    } else {
      dateObj = new Date(date);
    }
    
    // Ensure we have a valid date
    if (isNaN(dateObj.getTime())) {
      return '';
    }
    
    // Format based on requested type
    switch (formatType) {
      case 'timestamp':
        return format(dateObj, 'MMM d, yyyy • h:mm a');
      case 'compact':
        return format(dateObj, 'MM/dd/yy h:mm a');
      default:
        return dateObj.toLocaleString('en-US', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true
        });
    }
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};
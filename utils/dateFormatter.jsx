const formatDate = (timestamp) => {
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
  
  const formatTimeRemaining = (seconds) => {
    return `${seconds} ${seconds === 1 ? 'second' : 'seconds'} remaining`;
  };
  
  export { formatDate, formatTimeRemaining };
import { useState, useEffect } from 'react';

const useLogFiltering = (usageLogs) => {
  const [selectedMachine, setSelectedMachine] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredLogs, setFilteredLogs] = useState([]);

  // Filter logs based on selected machine and search query
  useEffect(() => {
    let result = [...usageLogs];

    // Filter by machine
    if (selectedMachine !== 'all') {
      result = result.filter(
        log => log.machineNumber === parseInt(selectedMachine),
      );
    }

    // Filter by search query (student name, roll number, or mobile)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        log =>
          (log.userName && log.userName.toLowerCase().includes(query)) ||
          (log.userEmail && log.userEmail.toLowerCase().includes(query)) ||
          (log.userMobile && log.userMobile.toLowerCase().includes(query)),
      );
    }

    setFilteredLogs(result);
  }, [selectedMachine, searchQuery, usageLogs]);

  return {
    selectedMachine,
    setSelectedMachine,
    searchQuery,
    setSearchQuery,
    filteredLogs
  };
};

export default useLogFiltering;
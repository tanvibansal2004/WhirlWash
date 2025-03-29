import { useState } from 'react';

const useExpandableSections = (initialSections = {}) => {
  const [expandedSections, setExpandedSections] = useState(initialSections);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return {
    expandedSections,
    toggleSection
  };
};

export default useExpandableSections;
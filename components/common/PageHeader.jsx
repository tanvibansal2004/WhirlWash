// import React from 'react';
// import { View, Text, StyleSheet } from 'react-native';

// const PageHeader = ({ children, title, subtitle, subtitleColor = 'green' }) => {
//   // Determine content based on whether we're using children or title/subtitle
//   const usingChildrenMode = children !== undefined;

//   return (
//     <View style={styles.container}>
//       {usingChildrenMode ? (
//         // Original version that uses children
//         <Text style={styles.header}>{children}</Text>
//       ) : (
//         // Version with title and optional subtitle
//         <>
//           <Text style={styles.heading}>{title}</Text>
//           {subtitle && (
//             <Text style={[styles.subheading, { color: subtitleColor }]}>
//               {subtitle}
//             </Text>
//           )}
//         </>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     alignItems: 'center',
//     marginVertical: 20,
//   },
//   // Style from first component
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   // Styles from second component
//   heading: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 5,
//   },
//   subheading: {
//     fontSize: 14,
//     textAlign: 'center',
//   },
// });

// export default PageHeader;

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * A flexible page header component with multiple usage modes
 * @param {Object} props - Component props
 * @param {string} [props.title] - Header title for title/subtitle mode
 * @param {string} [props.subtitle] - Subtitle for title/subtitle mode
 * @param {string} [props.subtitleColor] - Color for the subtitle text
 * @param {ReactNode} [props.children] - Children for simple mode
 * @returns {JSX.Element} Rendered component
 */
const PageHeader = ({ 
  children, 
  title, 
  subtitle, 
  subtitleColor = '#B03D4E' 
}) => {
  // Determine which mode to use based on provided props
  const usingChildrenMode = children !== undefined;

  return (
    <View style={styles.container}>
      {usingChildrenMode ? (
        // Simple mode with just children
        <Text style={styles.header}>{children}</Text>
      ) : (
        // Title/subtitle mode
        <>
          <Text style={styles.heading}>{title}</Text>
          {subtitle && (
            <Text style={[styles.subheading, { color: subtitleColor }]}>
              {subtitle}
            </Text>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
  // Style for children mode
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  // Styles for title/subtitle mode
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  subheading: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default PageHeader;
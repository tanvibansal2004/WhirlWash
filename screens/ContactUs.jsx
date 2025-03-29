// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   Image,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';

// const ContactUs = () => {
//   const [expandedSections, setExpandedSections] = useState({
//     'Warden GH': false,
//     'Associate Warden GH': false,
//     'Jr. Hostel Superintendent GH': false,
//   });

//   const developers = [
//     {
//       name: 'Kashvi Jain',
//       email: '22ucc050@lnmiit.ac.in',
//       image: require('../assets/kashvi.png'),
//     },
//     {
//       name: 'Kashvi Jain',
//       email: '22ucc050@lnmiit.ac.in',
//       image: require('../assets/kashvi.png'),
//     },
//     {
//       name: 'Kashvi Jain',
//       email: '22ucc050@lnmiit.ac.in',
//       image: require('../assets/kashvi.png'),
//     },
//   ];

//   const toggleSection = (section) => {
//     setExpandedSections(prev => ({
//       ...prev,
//       [section]: !prev[section]
//     }));
//   };

//   const ContactCard = ({ title, name, phone, email }) => (
//     <View style={styles.contactCard}>
//       <Text style={styles.cardTitle}>{title}</Text>
//       <Text style={styles.cardName}>{name}</Text>
//       <Text style={styles.cardDetail}>{phone}</Text>
//       <Text style={styles.cardDetail}>{email}</Text>
//     </View>
//   );

//   const ContactCardSmall = ({ title, name, phone, email }) => (
//     <View style={styles.contactCard}>
//       <Text style={styles.cardName}>{name}</Text>
//       <Text style={styles.cardDetail}>{phone}</Text>
//       <Text style={styles.cardDetail}>{email}</Text>
//     </View>
//   );

//   const DropdownSection = ({ title, isExpanded, onPress, children }) => (
//     <View style={styles.dropdownContainer}>
//       <TouchableOpacity 
//         style={styles.dropdownHeader} 
//         onPress={onPress}
//       >
//         <Text style={styles.dropdownTitle}>{title}</Text>
//         <Icon 
//           name={isExpanded ? "chevron-down" : "chevron-forward"} 
//           size={24} 
//           color="#000"
//         />
//       </TouchableOpacity>
//       {isExpanded && children}
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Contact Us</Text>
      
//       <ScrollView 
//         style={styles.scrollView}
//         contentContainerStyle={styles.scrollViewContent} // Added this
//       >
//         {/* Contact Information Section */}
//         <ContactCard
//           title="Chief Warden"
//           name="ABCD"
//           phone="0141-3526391"
//           email="chief-warden@lnmiit.ac.in"
//         />

//         <ContactCard
//           title="Associate Chief Warden, Girls Hostel"
//           name="ABCD"
//           phone="0141-3526317"
//           email="assoc.cw-gh@lnmiit.ac.in"
//         />

//         <Text style={styles.sectionTitle}>Girl's Hostel - 0141-2688132</Text>

//         {/* Collapsible Sections */}
//         <DropdownSection
//           title="Warden GH"
//           isExpanded={expandedSections['Warden GH']}
//           onPress={() => toggleSection('Warden GH')}
//         >
//           <ContactCardSmall
//             name="ABCD"
//             phone="0141-3526225"
//             email="warden-gh@lnmiit.ac.in"
//           />
//         </DropdownSection>

//         <DropdownSection
//           title="Associate Warden GH"
//           isExpanded={expandedSections['Associate Warden GH']}
//           onPress={() => toggleSection('Associate Warden GH')}
//         >
//           <ContactCardSmall
//             name="ABCD"
//             phone="0141-3526225"
//             email="warden-gh@lnmiit.ac.in"
//           />
//         </DropdownSection>

//         <DropdownSection
//           title="Jr. Hostel Superintendent GH"
//           isExpanded={expandedSections['Jr. Hostel Superintendent GH']}
//           onPress={() => toggleSection('Jr. Hostel Superintendent GH')}
//         >
//           <ContactCardSmall
//             name="ABCD"
//             phone="0141-3526225"
//             email="warden-gh@lnmiit.ac.in"
//           />
//         </DropdownSection>

//         <DropdownSection
//           title="Hostel Support GH"
//           isExpanded={expandedSections['Hostel Support GH']}
//           onPress={() => toggleSection('Hostel Support GH')}
//         >
//           <ContactCardSmall
//             name="ABCD"
//             phone="0141-3526225"
//             email="warden-gh@lnmiit.ac.in"
//           />
//           <ContactCardSmall
//             name="ABCD"
//             phone="0141-3526225"
//             email="warden-gh@lnmiit.ac.in"
//           />
//           <ContactCardSmall
//             name="ABCD"
//             phone="0141-3526225"
//             email="warden-gh@lnmiit.ac.in"
//           />
//         </DropdownSection>

//         {/* Developers Section */}
//         <Text style={styles.sectionTitle}>Developers</Text>
        
//         {developers.map((developer, index) => (
//           <View key={index} style={styles.developerCard}>
//             <Image source={developer.image} style={styles.developerImage} />
//             <View style={styles.developerInfo}>
//               <Text style={styles.developerName}>{developer.name}</Text>
//               <Text style={styles.developerEmail}>{developer.email}</Text>
//             </View>
//           </View>
//         ))}
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'white',
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginVertical: 20,
//   },
//   scrollView: {
//     flex: 1,
//   },
//   scrollViewContent: {
//     padding: 20,
//     paddingBottom: 80, // Added padding at bottom to account for tab navigation
//   },
//   contactCard: {
//     backgroundColor: '#F5F5F5',
//     padding: 20,
//     borderRadius: 15,
//     marginBottom: 15,
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//   },
//   cardTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 8,
//   },
//   cardName: {
//     fontSize: 18,
//     color: '#444',
//     marginBottom: 6,
//   },
//   cardDetail: {
//     fontSize: 16,
//     color: '#666',
//     marginBottom: 4,
//   },
//   dropdownContainer: {
//     marginBottom: 10,
//   },
//   dropdownHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: '#F5F5F5',
//     padding: 15,
//     borderRadius: 10,
//   },
//   dropdownTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#333',
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginVertical: 15,
//     textAlign: 'center',
//   },
//   developerCard: {
//     backgroundColor: '#F5F5F5',
//     borderRadius: 15,
//     padding: 15,
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   developerImage: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     marginRight: 15,
//   },
//   developerInfo: {
//     flex: 1,
//   },
//   developerName: {
//     color: 'black',
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 5,
//   },
//   developerEmail: {
//     color: 'black',
//     fontSize: 14,
//   },
//   navItem: {
//     padding: 5,
//   },
// });

// export default ContactUs;

import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
} from 'react-native';

// Components
import ContactCard from '../components/contact/ContactCard';
import DropdownSection from '../components/contact/DropdownSection';
import DeveloperCard from '../components/contact/DeveloperCard';
import SectionTitle from '../components/common/SectionTitle';
import PageHeader from '../components/common/PageHeader';

// Data and Hooks
import { 
  mainContacts, 
  wardenGHData,
  associateWardenGHData,
  juniorHSGHData,
  hostelSupportGHData,
  developersData
} from '../data/contactData';
import useExpandableSections from '../hooks/useExpandableSections';

const ContactUs = () => {
  const { expandedSections, toggleSection } = useExpandableSections({
    'Warden GH': false,
    'Associate Warden GH': false,
    'Jr. Hostel Superintendent GH': false,
    'Hostel Support GH': false,
  });

  return (
    <View style={styles.container}>
      <PageHeader>Contact Us</PageHeader>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        {/* Main Contact Information Section */}
        {mainContacts.map((contact, index) => (
          <ContactCard
            key={index}
            title={contact.title}
            name={contact.name}
            phone={contact.phone}
            email={contact.email}
          />
        ))}

        <SectionTitle>Girl's Hostel - 0141-2688132</SectionTitle>

        {/* Collapsible Sections */}
        <DropdownSection
          title="Warden GH"
          isExpanded={expandedSections['Warden GH']}
          onPress={() => toggleSection('Warden GH')}
        >
          <ContactCard
            name={wardenGHData.name}
            phone={wardenGHData.phone}
            email={wardenGHData.email}
          />
        </DropdownSection>

        <DropdownSection
          title="Associate Warden GH"
          isExpanded={expandedSections['Associate Warden GH']}
          onPress={() => toggleSection('Associate Warden GH')}
        >
          <ContactCard
            name={associateWardenGHData.name}
            phone={associateWardenGHData.phone}
            email={associateWardenGHData.email}
          />
        </DropdownSection>

        <DropdownSection
          title="Jr. Hostel Superintendent GH"
          isExpanded={expandedSections['Jr. Hostel Superintendent GH']}
          onPress={() => toggleSection('Jr. Hostel Superintendent GH')}
        >
          <ContactCard
            name={juniorHSGHData.name}
            phone={juniorHSGHData.phone}
            email={juniorHSGHData.email}
          />
        </DropdownSection>

        <DropdownSection
          title="Hostel Support GH"
          isExpanded={expandedSections['Hostel Support GH']}
          onPress={() => toggleSection('Hostel Support GH')}
        >
          {hostelSupportGHData.map((contact, index) => (
            <ContactCard
              key={index}
              name={contact.name}
              phone={contact.phone}
              email={contact.email}
            />
          ))}
        </DropdownSection>

        {/* Developers Section */}
        <SectionTitle>Developers</SectionTitle>
        
        {developersData.map((developer, index) => (
          <DeveloperCard
            key={index}
            name={developer.name}
            email={developer.email}
            image={developer.image}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 20,
    paddingBottom: 80, // Added padding at bottom to account for tab navigation
  },
});

export default ContactUs;
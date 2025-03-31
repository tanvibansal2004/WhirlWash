import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
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
  developersData,
} from '../data/contactData';
import useExpandableSections from '../hooks/useExpandableSections';
import SectionHeader from '../components/SectionHeader';

const ContactUs = () => {
  const {expandedSections, toggleSection} = useExpandableSections({
    'Warden GH': false,
    'Associate Warden GH': false,
    'Jr. Hostel Superintendent GH': false,
    'Hostel Support GH': false,
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <View style={styles.container}>
        <SectionHeader title="Contact Us" subtitle="LNMIIT Jaipur" />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={true}>
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
            onPress={() => toggleSection('Warden GH')}>
            <ContactCard
              name={wardenGHData.name}
              phone={wardenGHData.phone}
              email={wardenGHData.email}
            />
          </DropdownSection>

          <DropdownSection
            title="Associate Warden GH"
            isExpanded={expandedSections['Associate Warden GH']}
            onPress={() => toggleSection('Associate Warden GH')}>
            <ContactCard
              name={associateWardenGHData.name}
              phone={associateWardenGHData.phone}
              email={associateWardenGHData.email}
            />
          </DropdownSection>

          <DropdownSection
            title="Jr. Hostel Superintendent GH"
            isExpanded={expandedSections['Jr. Hostel Superintendent GH']}
            onPress={() => toggleSection('Jr. Hostel Superintendent GH')}>
            <ContactCard
              name={juniorHSGHData.name}
              phone={juniorHSGHData.phone}
              email={juniorHSGHData.email}
            />
          </DropdownSection>

          <DropdownSection
            title="Hostel Support GH"
            isExpanded={expandedSections['Hostel Support GH']}
            onPress={() => toggleSection('Hostel Support GH')}>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 10,
    paddingBottom: 90, // Increased padding at bottom to account for tab navigation
  },
});

export default ContactUs;

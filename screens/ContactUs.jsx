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

// Define a professional color palette
const COLORS = {
  primary: '#3D4EB0',       // Rich blue - your app's existing primary color
  cardBg: '#F5F7FA',        // Slightly blueish gray for cards
  cardBgAlt: '#F8F8F8',     // Alternative light gray
  dropdownHeader: '#EAEEF2', // Slightly darker gray for dropdown headers
  background: '#FFFFFF',    // White background
  text: '#333333',          // Dark text
  textLight: '#666666',     // Light text
  border: '#E0E0E0',        // Border color
};

const ContactUs = () => {
  const {expandedSections, toggleSection} = useExpandableSections({
    'Warden GH': false,
    'Associate Warden GH': false,
    'Jr. Hostel Superintendent GH': false,
    'Hostel Support GH': false,
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <View style={styles.container}>
        <SectionHeader 
          title="Contact Us" 
          subtitle="LNMIIT Jaipur"
        />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}>
          
          {/* Main Contact Information Section */}
          <View style={styles.sectionContainer}>
            {mainContacts.map((contact, index) => (
              <ContactCard
                key={index}
                title={contact.title}
                name={contact.name}
                phone={contact.phone}
                email={contact.email}
                containerStyle={styles.contactCard}
              />
            ))}
          </View>

          <View style={styles.sectionContainer}>
            <SectionTitle style={styles.sectionTitleText}>Girl's Hostel - 0141-2688132</SectionTitle>

            {/* Collapsible Sections */}
            <DropdownSection
              title="Warden GH"
              isExpanded={expandedSections['Warden GH']}
              onPress={() => toggleSection('Warden GH')}
              containerStyle={styles.dropdownContainer}
              headerStyle={styles.dropdownHeader}>
              <ContactCard
                name={wardenGHData.name}
                phone={wardenGHData.phone}
                email={wardenGHData.email}
                containerStyle={styles.nestedContactCard}
              />
            </DropdownSection>

            <DropdownSection
              title="Associate Warden GH"
              isExpanded={expandedSections['Associate Warden GH']}
              onPress={() => toggleSection('Associate Warden GH')}
              containerStyle={styles.dropdownContainer}
              headerStyle={styles.dropdownHeader}>
              <ContactCard
                name={associateWardenGHData.name}
                phone={associateWardenGHData.phone}
                email={associateWardenGHData.email}
                containerStyle={styles.nestedContactCard}
              />
            </DropdownSection>

            <DropdownSection
              title="Jr. Hostel Superintendent GH"
              isExpanded={expandedSections['Jr. Hostel Superintendent GH']}
              onPress={() => toggleSection('Jr. Hostel Superintendent GH')}
              containerStyle={styles.dropdownContainer}
              headerStyle={styles.dropdownHeader}>
              <ContactCard
                name={juniorHSGHData.name}
                phone={juniorHSGHData.phone}
                email={juniorHSGHData.email}
                containerStyle={styles.nestedContactCard}
              />
            </DropdownSection>

            <DropdownSection
              title="Hostel Support GH"
              isExpanded={expandedSections['Hostel Support GH']}
              onPress={() => toggleSection('Hostel Support GH')}
              containerStyle={styles.dropdownContainer}
              headerStyle={styles.dropdownHeader}>
              {hostelSupportGHData.map((contact, index) => (
                <ContactCard
                  key={index}
                  name={contact.name}
                  phone={contact.phone}
                  email={contact.email}
                  containerStyle={styles.nestedContactCard}
                />
              ))}
            </DropdownSection>
          </View>

          {/* Developers Section */}
          <View style={styles.sectionContainer}>
            <SectionTitle style={styles.sectionTitleText}>Developers</SectionTitle>
            
            <View style={styles.developersContainer}>
              {developersData.map((developer, index) => (
                <DeveloperCard
                  key={index}
                  name={developer.name}
                  email={developer.email}
                  image={developer.image}
                  containerStyle={styles.developerCard}
                />
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 15,
    paddingBottom: 90,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitleText: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginVertical: 15,
  },
  contactCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    marginBottom: 12,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  dropdownContainer: {
    marginBottom: 12,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dropdownHeader: {
    backgroundColor: COLORS.dropdownHeader,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nestedContactCard: {
    backgroundColor: COLORS.cardBgAlt,
    borderRadius: 0,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    marginBottom: 0,
    padding: 15,
  },
  developersContainer: {
    flexDirection: 'column',
    gap: 10,
  },
  developerCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
});

export default ContactUs;
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Linking,
} from 'react-native';
import { CircleHelp as HelpCircle, Phone, Mail, MessageCircle, ChevronRight, ChevronDown, Search, X, Send, ExternalLink, FileText, Clock, Calendar } from 'lucide-react-native';

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
}

export default function HelpScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactMessage, setContactMessage] = useState('');

  const faqs: FAQ[] = [
    {
      id: 1,
      question: 'How do I file my annual tax return?',
      answer: 'To file your annual tax return, navigate to the Tax Filing tab, select "Individual Tax", and follow the step-by-step guide. Make sure you have all required documents ready before starting.',
      category: 'Tax Filing'
    },
    {
      id: 2,
      question: 'What documents do I need to upload?',
      answer: 'You need to upload your W-2 forms, bank statements, receipts for deductions, and any other relevant tax documents. All documents should be in PDF or image format.',
      category: 'Documents'
    },
    {
      id: 3,
      question: 'How can I make a tax payment?',
      answer: 'You can make payments through the app using mobile money, bank transfer, or by visiting any authorized payment center. Payment receipts will be automatically generated.',
      category: 'Payments'
    },
    {
      id: 4,
      question: 'What are the tax filing deadlines?',
      answer: 'Annual tax returns are due by April 15th. Quarterly estimated payments are due on the 15th of January, April, July, and October.',
      category: 'Deadlines'
    },
    {
      id: 5,
      question: 'How do I update my personal information?',
      answer: 'Go to the Profile tab, tap "Edit Profile", and update your information. Changes will be verified before being applied to your account.',
      category: 'Account'
    },
    {
      id: 6,
      question: 'What if I made an error in my tax return?',
      answer: 'If you notice an error after submission, you can file an amended return. Contact support for assistance with the amendment process.',
      category: 'Tax Filing'
    },
  ];

  const contactOptions = [
    {
      id: 1,
      title: 'Call Support',
      description: 'Available 8 AM - 5 PM, Mon-Fri',
      icon: Phone,
      color: '#2d5a87',
      action: () => Linking.openURL('tel:+211912345678')
    },
    {
      id: 2,
      title: 'Email Support',
      description: 'Response within 24 hours',
      icon: Mail,
      color: '#059669',
      action: () => Linking.openURL('mailto:support@ssra.gov.ss')
    },
    {
      id: 3,
      title: 'Live Chat',
      description: 'Chat with our agents',
      icon: MessageCircle,
      color: '#7c3aed',
      action: () => setShowContactModal(true)
    },
  ];

  const quickLinks = [
    {
      id: 1,
      title: 'Tax Forms & Instructions',
      icon: FileText,
      color: '#2d5a87',
      action: () => Linking.openURL('https://ssra.gov.ss/forms')
    },
    {
      id: 2,
      title: 'Payment Schedule',
      icon: Calendar,
      color: '#f59e0b',
      action: () => Linking.openURL('https://ssra.gov.ss/schedule')
    },
    {
      id: 3,
      title: 'Office Hours',
      icon: Clock,
      color: '#059669',
      action: () => {}
    },
  ];

  const filteredFAQs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFAQ = (id: number) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const handleSendMessage = () => {
    if (contactMessage.trim()) {
      setContactMessage('');
      setShowContactModal(false);
      // Here you would integrate with your chat system
      alert('Message sent! Our support team will respond shortly.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Help & Support</Text>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color="#666" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for help..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Links</Text>
          <View style={styles.quickLinksContainer}>
            {quickLinks.map((link) => (
              <TouchableOpacity
                key={link.id}
                style={styles.quickLinkCard}
                onPress={link.action}
              >
                <View style={[styles.quickLinkIcon, { backgroundColor: link.color }]}>
                  <link.icon size={24} color="#fff" />
                </View>
                <Text style={styles.quickLinkText}>{link.title}</Text>
                <ExternalLink size={16} color="#666" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Support</Text>
          <View style={styles.contactContainer}>
            {contactOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.contactCard}
                onPress={option.action}
              >
                <View style={[styles.contactIcon, { backgroundColor: `${option.color}15` }]}>
                  <option.icon size={24} color={option.color} />
                </View>
                <View style={styles.contactContent}>
                  <Text style={styles.contactTitle}>{option.title}</Text>
                  <Text style={styles.contactDescription}>{option.description}</Text>
                </View>
                <ChevronRight size={20} color="#666" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          <View style={styles.faqContainer}>
            {filteredFAQs.map((faq) => (
              <View key={faq.id} style={styles.faqCard}>
                <TouchableOpacity
                  style={styles.faqHeader}
                  onPress={() => toggleFAQ(faq.id)}
                >
                  <View style={styles.faqHeaderContent}>
                    <Text style={styles.faqQuestion}>{faq.question}</Text>
                    <Text style={styles.faqCategory}>{faq.category}</Text>
                  </View>
                  {expandedFAQ === faq.id ? (
                    <ChevronDown size={20} color="#2d5a87" />
                  ) : (
                    <ChevronRight size={20} color="#666" />
                  )}
                </TouchableOpacity>
                {expandedFAQ === faq.id && (
                  <View style={styles.faqAnswer}>
                    <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        {filteredFAQs.length === 0 && (
          <View style={styles.noResults}>
            <HelpCircle size={48} color="#ccc" />
            <Text style={styles.noResultsText}>No results found</Text>
            <Text style={styles.noResultsSubtext}>Try adjusting your search terms</Text>
          </View>
        )}
      </ScrollView>

      <Modal
        visible={showContactModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Contact Support</Text>
              <TouchableOpacity onPress={() => setShowContactModal(false)}>
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.inputLabel}>How can we help you?</Text>
              <TextInput
                style={styles.messageInput}
                placeholder="Describe your issue or question..."
                value={contactMessage}
                onChangeText={setContactMessage}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
              <Text style={styles.inputHelp}>
                Our support team will respond within 24 hours
              </Text>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowContactModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.sendButton}
                onPress={handleSendMessage}
              >
                <Send size={16} color="#fff" />
                <Text style={styles.sendButtonText}>Send Message</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a365d',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a365d',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  quickLinksContainer: {
    paddingHorizontal: 20,
  },
  quickLinkCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  quickLinkIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  quickLinkText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a365d',
    flex: 1,
  },
  contactContainer: {
    paddingHorizontal: 20,
  },
  contactCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contactContent: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a365d',
    marginBottom: 4,
  },
  contactDescription: {
    fontSize: 14,
    color: '#666',
  },
  faqContainer: {
    paddingHorizontal: 20,
  },
  faqCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  faqHeaderContent: {
    flex: 1,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a365d',
    marginBottom: 4,
  },
  faqCategory: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  faqAnswer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  faqAnswerText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginTop: 12,
  },
  noResults: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '90%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a365d',
  },
  modalBody: {
    padding: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a365d',
    marginBottom: 8,
  },
  messageInput: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    height: 100,
  },
  inputHelp: {
    fontSize: 12,
    color: '#666',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
  },
  sendButton: {
    backgroundColor: '#2d5a87',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sendButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
  },
});
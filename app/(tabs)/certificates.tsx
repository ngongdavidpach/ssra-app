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
  Alert,
  Image,
} from 'react-native';
import { Award, Plus, Download, Eye, Share, X, CircleCheck as CheckCircle, Clock, CircleAlert as AlertCircle, Calendar, Building, User, FileText, Search, Filter } from 'lucide-react-native';

interface Certificate {
  id: number;
  type: string;
  title: string;
  issueDate: string;
  expiryDate: string;
  status: 'active' | 'expired' | 'pending';
  certificateNumber: string;
  description: string;
  downloadUrl?: string;
}

interface CertificateRequest {
  type: string;
  businessName: string;
  businessType: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
}

export default function CertificatesScreen() {
  const [certificates, setCertificates] = useState<Certificate[]>([
    {
      id: 1,
      type: 'Tax Clearance',
      title: 'Tax Clearance Certificate 2024',
      issueDate: '2024-01-15',
      expiryDate: '2024-12-31',
      status: 'active',
      certificateNumber: 'TCC-2024-001234',
      description: 'Certificate confirming tax compliance for 2024',
      downloadUrl: 'https://example.com/cert1.pdf'
    },
    {
      id: 2,
      type: 'Business Registration',
      title: 'Business Registration Certificate',
      issueDate: '2023-06-10',
      expiryDate: '2025-06-10',
      status: 'active',
      certificateNumber: 'BRC-2023-005678',
      description: 'Official business registration certificate',
      downloadUrl: 'https://example.com/cert2.pdf'
    },
    {
      id: 3,
      type: 'VAT Registration',
      title: 'VAT Registration Certificate',
      issueDate: '2023-03-20',
      expiryDate: '2024-03-20',
      status: 'expired',
      certificateNumber: 'VAT-2023-009876',
      description: 'Value Added Tax registration certificate'
    },
    {
      id: 4,
      type: 'Withholding Tax',
      title: 'Withholding Tax Certificate',
      issueDate: '2024-02-01',
      expiryDate: '2024-12-31',
      status: 'pending',
      certificateNumber: 'WHT-2024-001122',
      description: 'Withholding tax exemption certificate'
    },
  ]);

  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  
  const [certificateRequest, setCertificateRequest] = useState<CertificateRequest>({
    type: 'Tax Clearance',
    businessName: '',
    businessType: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: ''
  });

  const certificateTypes = [
    'Tax Clearance',
    'Business Registration',
    'VAT Registration',
    'Withholding Tax',
    'Import/Export License',
    'Professional License'
  ];

  const filterOptions = ['All', 'Active', 'Expired', 'Pending'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#10b981';
      case 'expired':
        return '#dc2626';
      case 'pending':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return CheckCircle;
      case 'expired':
        return AlertCircle;
      case 'pending':
        return Clock;
      default:
        return Clock;
    }
  };

  const filteredCertificates = certificates.filter(cert => {
    const matchesSearch = cert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         cert.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         cert.certificateNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'All' || 
                         cert.status.toLowerCase() === selectedFilter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const handleViewCertificate = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    setShowCertificateModal(true);
  };

  const handleDownloadCertificate = (certificate: Certificate) => {
    Alert.alert('Download', `${certificate.title} will be downloaded`);
  };

  const handleShareCertificate = (certificate: Certificate) => {
    Alert.alert('Share', `${certificate.title} sharing options would be shown here`);
  };

  const handleSubmitRequest = () => {
    if (!certificateRequest.businessName || !certificateRequest.contactPerson || !certificateRequest.email) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const newCertificate: Certificate = {
      id: Date.now(),
      type: certificateRequest.type,
      title: `${certificateRequest.type} Certificate`,
      issueDate: new Date().toISOString().split('T')[0],
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'pending',
      certificateNumber: `${certificateRequest.type.substring(0, 3).toUpperCase()}-${new Date().getFullYear()}-${Math.floor(Math.random() * 100000).toString().padStart(6, '0')}`,
      description: `${certificateRequest.type} certificate for ${certificateRequest.businessName}`
    };

    setCertificates([newCertificate, ...certificates]);
    setCertificateRequest({
      type: 'Tax Clearance',
      businessName: '',
      businessType: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: ''
    });
    setShowRequestModal(false);
    Alert.alert('Success', 'Certificate request submitted successfully. You will be notified when it\'s ready.');
  };

  const updateRequest = (field: keyof CertificateRequest, value: string) => {
    setCertificateRequest(prev => ({ ...prev, [field]: value }));
  };

  const activeCertificates = certificates.filter(cert => cert.status === 'active').length;
  const pendingCertificates = certificates.filter(cert => cert.status === 'pending').length;
  const expiredCertificates = certificates.filter(cert => cert.status === 'expired').length;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Certificates</Text>
          <TouchableOpacity 
            style={styles.requestButton}
            onPress={() => setShowRequestModal(true)}
          >
            <Plus size={20} color="#fff" />
            <Text style={styles.requestButtonText}>Request</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: '#d1fae5' }]}>
            <CheckCircle size={24} color="#10b981" />
            <Text style={styles.statNumber}>{activeCertificates}</Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#fef3c7' }]}>
            <Clock size={24} color="#f59e0b" />
            <Text style={styles.statNumber}>{pendingCertificates}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#fecaca' }]}>
            <AlertCircle size={24} color="#dc2626" />
            <Text style={styles.statNumber}>{expiredCertificates}</Text>
            <Text style={styles.statLabel}>Expired</Text>
          </View>
        </View>

        {/* Search and Filter */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color="#666" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search certificates..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={20} color="#2d5a87" />
          </TouchableOpacity>
        </View>

        {/* Filter Chips */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
        >
          {filterOptions.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterChip,
                selectedFilter === filter && styles.selectedFilterChip
              ]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text style={[
                styles.filterText,
                selectedFilter === filter && styles.selectedFilterText
              ]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Certificates List */}
        <View style={styles.certificatesContainer}>
          {filteredCertificates.map((certificate) => {
            const StatusIcon = getStatusIcon(certificate.status);
            return (
              <View key={certificate.id} style={styles.certificateCard}>
                <View style={styles.certificateHeader}>
                  <View style={styles.certificateIcon}>
                    <Award size={24} color="#2d5a87" />
                  </View>
                  <View style={styles.certificateInfo}>
                    <Text style={styles.certificateTitle}>{certificate.title}</Text>
                    <Text style={styles.certificateType}>{certificate.type}</Text>
                    <Text style={styles.certificateNumber}>{certificate.certificateNumber}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(certificate.status) }]}>
                    <StatusIcon size={12} color="#fff" />
                    <Text style={styles.statusText}>{certificate.status.toUpperCase()}</Text>
                  </View>
                </View>

                <Text style={styles.certificateDescription}>{certificate.description}</Text>

                <View style={styles.certificateDates}>
                  <View style={styles.dateItem}>
                    <Calendar size={16} color="#666" />
                    <Text style={styles.dateText}>Issued: {certificate.issueDate}</Text>
                  </View>
                  <View style={styles.dateItem}>
                    <Calendar size={16} color="#666" />
                    <Text style={styles.dateText}>Expires: {certificate.expiryDate}</Text>
                  </View>
                </View>

                <View style={styles.certificateActions}>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => handleViewCertificate(certificate)}
                  >
                    <Eye size={16} color="#2d5a87" />
                    <Text style={styles.actionButtonText}>View</Text>
                  </TouchableOpacity>
                  
                  {certificate.status === 'active' && (
                    <>
                      <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => handleDownloadCertificate(certificate)}
                      >
                        <Download size={16} color="#059669" />
                        <Text style={[styles.actionButtonText, { color: '#059669' }]}>Download</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => handleShareCertificate(certificate)}
                      >
                        <Share size={16} color="#7c3aed" />
                        <Text style={[styles.actionButtonText, { color: '#7c3aed' }]}>Share</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        {filteredCertificates.length === 0 && (
          <View style={styles.emptyState}>
            <Award size={64} color="#ccc" />
            <Text style={styles.emptyStateText}>No certificates found</Text>
            <Text style={styles.emptyStateSubtext}>
              {searchQuery ? 'Try adjusting your search terms' : 'Request your first certificate to get started'}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Request Certificate Modal */}
      <Modal
        visible={showRequestModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Request Certificate</Text>
              <TouchableOpacity onPress={() => setShowRequestModal(false)}>
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={styles.inputLabel}>Certificate Type *</Text>
              <View style={styles.modalInput}>
                <Text style={styles.inputText}>{certificateRequest.type}</Text>
              </View>

              <Text style={styles.inputLabel}>Business Name *</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Enter business name"
                value={certificateRequest.businessName}
                onChangeText={(text) => updateRequest('businessName', text)}
              />

              <Text style={styles.inputLabel}>Business Type</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g., Limited Company, Partnership"
                value={certificateRequest.businessType}
                onChangeText={(text) => updateRequest('businessType', text)}
              />

              <Text style={styles.inputLabel}>Contact Person *</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Enter contact person name"
                value={certificateRequest.contactPerson}
                onChangeText={(text) => updateRequest('contactPerson', text)}
              />

              <Text style={styles.inputLabel}>Email Address *</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Enter email address"
                value={certificateRequest.email}
                onChangeText={(text) => updateRequest('email', text)}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Enter phone number"
                value={certificateRequest.phone}
                onChangeText={(text) => updateRequest('phone', text)}
                keyboardType="phone-pad"
              />

              <Text style={styles.inputLabel}>Business Address</Text>
              <TextInput
                style={[styles.modalInput, styles.textArea]}
                placeholder="Enter business address"
                value={certificateRequest.address}
                onChangeText={(text) => updateRequest('address', text)}
                multiline
                numberOfLines={3}
              />

              <Text style={styles.helpText}>
                * Required fields. Processing time is typically 5-7 business days.
              </Text>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowRequestModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.submitButton}
                onPress={handleSubmitRequest}
              >
                <Text style={styles.submitButtonText}>Submit Request</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Certificate Details Modal */}
      <Modal
        visible={showCertificateModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Certificate Details</Text>
              <TouchableOpacity onPress={() => setShowCertificateModal(false)}>
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {selectedCertificate && (
                <>
                  <View style={styles.certificatePreview}>
                    <View style={styles.previewHeader}>
                      <Award size={48} color="#2d5a87" />
                      <Text style={styles.previewTitle}>South Sudan Revenue Authority</Text>
                    </View>
                    
                    <View style={styles.previewContent}>
                      <Text style={styles.previewCertificateTitle}>{selectedCertificate.title}</Text>
                      <Text style={styles.previewCertificateNumber}>
                        Certificate No: {selectedCertificate.certificateNumber}
                      </Text>
                      
                      <View style={styles.previewDetails}>
                        <Text style={styles.previewDetailLabel}>Type:</Text>
                        <Text style={styles.previewDetailValue}>{selectedCertificate.type}</Text>
                      </View>
                      
                      <View style={styles.previewDetails}>
                        <Text style={styles.previewDetailLabel}>Issue Date:</Text>
                        <Text style={styles.previewDetailValue}>{selectedCertificate.issueDate}</Text>
                      </View>
                      
                      <View style={styles.previewDetails}>
                        <Text style={styles.previewDetailLabel}>Expiry Date:</Text>
                        <Text style={styles.previewDetailValue}>{selectedCertificate.expiryDate}</Text>
                      </View>
                      
                      <View style={styles.previewDetails}>
                        <Text style={styles.previewDetailLabel}>Status:</Text>
                        <Text style={[
                          styles.previewDetailValue, 
                          { color: getStatusColor(selectedCertificate.status) }
                        ]}>
                          {selectedCertificate.status.toUpperCase()}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {selectedCertificate.status === 'active' && (
                    <View style={styles.certificateActionsModal}>
                      <TouchableOpacity 
                        style={styles.modalActionButton}
                        onPress={() => handleDownloadCertificate(selectedCertificate)}
                      >
                        <Download size={20} color="#fff" />
                        <Text style={styles.modalActionButtonText}>Download PDF</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={[styles.modalActionButton, { backgroundColor: '#7c3aed' }]}
                        onPress={() => handleShareCertificate(selectedCertificate)}
                      >
                        <Share size={20} color="#fff" />
                        <Text style={styles.modalActionButtonText}>Share Certificate</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </>
              )}
            </ScrollView>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a365d',
  },
  requestButton: {
    backgroundColor: '#2d5a87',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  requestButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a365d',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  filterButton: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  filtersContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filterChip: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  selectedFilterChip: {
    backgroundColor: '#2d5a87',
    borderColor: '#2d5a87',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  selectedFilterText: {
    color: '#fff',
  },
  certificatesContainer: {
    paddingHorizontal: 20,
  },
  certificateCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  certificateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  certificateIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  certificateInfo: {
    flex: 1,
  },
  certificateTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a365d',
    marginBottom: 2,
  },
  certificateType: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  certificateNumber: {
    fontSize: 12,
    color: '#2d5a87',
    fontWeight: '500',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
    marginLeft: 4,
  },
  certificateDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  certificateDates: {
    marginBottom: 12,
  },
  dateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  certificateActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginLeft: 8,
  },
  actionButtonText: {
    fontSize: 14,
    color: '#2d5a87',
    fontWeight: '500',
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
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
    maxHeight: '80%',
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
    maxHeight: 400,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a365d',
    marginBottom: 8,
  },
  modalInput: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  inputText: {
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  helpText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 8,
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
  submitButton: {
    backgroundColor: '#2d5a87',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  submitButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  certificatePreview: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  previewHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a365d',
    marginTop: 8,
    textAlign: 'center',
  },
  previewContent: {
    alignItems: 'center',
  },
  previewCertificateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d5a87',
    textAlign: 'center',
    marginBottom: 8,
  },
  previewCertificateNumber: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  previewDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 8,
  },
  previewDetailLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  previewDetailValue: {
    fontSize: 14,
    color: '#1a365d',
    fontWeight: '600',
  },
  certificateActionsModal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalActionButton: {
    backgroundColor: '#2d5a87',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    justifyContent: 'center',
  },
  modalActionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
});
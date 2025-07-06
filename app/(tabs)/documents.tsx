import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  TextInput,
} from 'react-native';
import { 
  FolderOpen, 
  Plus, 
  FileText, 
  Image, 
  Download, 
  Trash2, 
  X,
  Upload,
  Search,
  Filter
} from 'lucide-react-native';

interface Document {
  id: number;
  name: string;
  type: 'pdf' | 'image' | 'document';
  category: string;
  size: string;
  date: string;
  status: 'uploaded' | 'processing' | 'verified';
}

export default function DocumentsScreen() {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: 1,
      name: 'W-2 Form 2024.pdf',
      type: 'pdf',
      category: 'Tax Documents',
      size: '1.2 MB',
      date: '2024-01-15',
      status: 'verified'
    },
    {
      id: 2,
      name: 'Bank Statement Jan 2024.pdf',
      type: 'pdf',
      category: 'Bank Statements',
      size: '856 KB',
      date: '2024-01-10',
      status: 'verified'
    },
    {
      id: 3,
      name: 'Receipt Invoice.jpg',
      type: 'image',
      category: 'Receipts',
      size: '2.1 MB',
      date: '2024-01-08',
      status: 'processing'
    },
    {
      id: 4,
      name: 'Property Tax Statement.pdf',
      type: 'pdf',
      category: 'Property Documents',
      size: '643 KB',
      date: '2024-01-05',
      status: 'uploaded'
    },
  ]);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Tax Documents', 'Bank Statements', 'Receipts', 'Property Documents'];

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return FileText;
      case 'image':
        return Image;
      default:
        return FileText;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'uploaded':
        return '#f59e0b';
      case 'processing':
        return '#3b82f6';
      case 'verified':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'uploaded':
        return 'Uploaded';
      case 'processing':
        return 'Processing';
      case 'verified':
        return 'Verified';
      default:
        return 'Unknown';
    }
  };

  const handleUpload = () => {
    Alert.alert(
      'Upload Document',
      'Choose upload method:',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Camera', onPress: () => handleCameraUpload() },
        { text: 'Gallery', onPress: () => handleGalleryUpload() },
      ]
    );
  };

  const handleCameraUpload = () => {
    setShowUploadModal(false);
    Alert.alert('Camera', 'Camera functionality would be implemented here');
  };

  const handleGalleryUpload = () => {
    setShowUploadModal(false);
    Alert.alert('Gallery', 'Gallery selection would be implemented here');
  };

  const handleDeleteDocument = (id: number) => {
    Alert.alert(
      'Delete Document',
      'Are you sure you want to delete this document?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setDocuments(documents.filter(doc => doc.id !== id));
          }
        }
      ]
    );
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Documents</Text>
        <TouchableOpacity 
          style={styles.uploadButton}
          onPress={handleUpload}
        >
          <Plus size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search documents..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="#2d5a87" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryChip,
              selectedCategory === category && styles.selectedCategoryChip
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[
              styles.categoryText,
              selectedCategory === category && styles.selectedCategoryText
            ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.documentsContainer}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{documents.length}</Text>
            <Text style={styles.statLabel}>Total Documents</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {documents.filter(doc => doc.status === 'verified').length}
            </Text>
            <Text style={styles.statLabel}>Verified</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {documents.filter(doc => doc.status === 'processing').length}
            </Text>
            <Text style={styles.statLabel}>Processing</Text>
          </View>
        </View>

        <View style={styles.documentsGrid}>
          {filteredDocuments.map((document) => {
            const IconComponent = getDocumentIcon(document.type);
            return (
              <View key={document.id} style={styles.documentCard}>
                <View style={styles.documentHeader}>
                  <View style={styles.documentIcon}>
                    <IconComponent size={24} color="#2d5a87" />
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(document.status) }]}>
                    <Text style={styles.statusText}>{getStatusText(document.status)}</Text>
                  </View>
                </View>
                
                <Text style={styles.documentName} numberOfLines={2}>
                  {document.name}
                </Text>
                
                <View style={styles.documentInfo}>
                  <Text style={styles.documentCategory}>{document.category}</Text>
                  <Text style={styles.documentSize}>{document.size}</Text>
                  <Text style={styles.documentDate}>{document.date}</Text>
                </View>

                <View style={styles.documentActions}>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => Alert.alert('Download', 'Download functionality would be implemented here')}
                  >
                    <Download size={16} color="#2d5a87" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => handleDeleteDocument(document.id)}
                  >
                    <Trash2 size={16} color="#dc2626" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>

        {filteredDocuments.length === 0 && (
          <View style={styles.emptyState}>
            <FolderOpen size={64} color="#ccc" />
            <Text style={styles.emptyStateText}>No documents found</Text>
            <Text style={styles.emptyStateSubtext}>
              {searchQuery ? 'Try adjusting your search terms' : 'Upload your first document to get started'}
            </Text>
          </View>
        )}
      </ScrollView>

      <Modal
        visible={showUploadModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Upload Document</Text>
              <TouchableOpacity onPress={() => setShowUploadModal(false)}>
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <TouchableOpacity style={styles.uploadOption} onPress={handleCameraUpload}>
                <View style={styles.uploadIcon}>
                  <Upload size={24} color="#2d5a87" />
                </View>
                <View style={styles.uploadText}>
                  <Text style={styles.uploadTitle}>Take Photo</Text>
                  <Text style={styles.uploadSubtitle}>Use camera to capture document</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.uploadOption} onPress={handleGalleryUpload}>
                <View style={styles.uploadIcon}>
                  <Image size={24} color="#2d5a87" />
                </View>
                <View style={styles.uploadText}>
                  <Text style={styles.uploadTitle}>Choose from Gallery</Text>
                  <Text style={styles.uploadSubtitle}>Select existing photo or document</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.uploadOption} onPress={() => Alert.alert('Files', 'File picker would be implemented here')}>
                <View style={styles.uploadIcon}>
                  <FileText size={24} color="#2d5a87" />
                </View>
                <View style={styles.uploadText}>
                  <Text style={styles.uploadTitle}>Browse Files</Text>
                  <Text style={styles.uploadSubtitle}>Select PDF or document files</Text>
                </View>
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
  uploadButton: {
    backgroundColor: '#2d5a87',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
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
  categoriesContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  categoryChip: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  selectedCategoryChip: {
    backgroundColor: '#2d5a87',
    borderColor: '#2d5a87',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: '#fff',
  },
  documentsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flex: 1,
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
    color: '#2d5a87',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  documentsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  documentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    width: '48%',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  documentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  documentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '500',
  },
  documentName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a365d',
    marginBottom: 8,
    height: 40,
  },
  documentInfo: {
    marginBottom: 12,
  },
  documentCategory: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  documentSize: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  documentDate: {
    fontSize: 12,
    color: '#666',
  },
  documentActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 12,
  },
  actionButton: {
    padding: 8,
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
    padding: 0,
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
  uploadOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 12,
  },
  uploadIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  uploadText: {
    flex: 1,
  },
  uploadTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a365d',
  },
  uploadSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
});
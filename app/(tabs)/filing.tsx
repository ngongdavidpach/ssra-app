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
} from 'react-native';
import { FileText, Plus, CreditCard as Edit3, Trash2, Check, X, Calendar, DollarSign, User, Building } from 'lucide-react-native';

interface TaxReturn {
  id: number;
  year: string;
  type: string;
  status: 'draft' | 'submitted' | 'processed' | 'approved';
  amount: number;
  dueDate: string;
}

export default function FilingScreen() {
  const [taxReturns, setTaxReturns] = useState<TaxReturn[]>([
    {
      id: 1,
      year: '2024',
      type: 'Individual Income Tax',
      status: 'draft',
      amount: 45000,
      dueDate: '2024-04-15'
    },
    {
      id: 2,
      year: '2023',
      type: 'Individual Income Tax',
      status: 'approved',
      amount: 42000,
      dueDate: '2023-04-15'
    },
    {
      id: 3,
      year: '2022',
      type: 'Individual Income Tax',
      status: 'processed',
      amount: 38000,
      dueDate: '2022-04-15'
    },
  ]);

  const [showNewReturnModal, setShowNewReturnModal] = useState(false);
  const [newReturn, setNewReturn] = useState({
    year: '',
    type: 'Individual Income Tax',
    amount: '',
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return '#f59e0b';
      case 'submitted':
        return '#3b82f6';
      case 'processed':
        return '#8b5cf6';
      case 'approved':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft':
        return 'Draft';
      case 'submitted':
        return 'Submitted';
      case 'processed':
        return 'Processing';
      case 'approved':
        return 'Approved';
      default:
        return 'Unknown';
    }
  };

  const handleCreateReturn = () => {
    if (!newReturn.year || !newReturn.amount) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const newTaxReturn: TaxReturn = {
      id: Date.now(),
      year: newReturn.year,
      type: newReturn.type,
      status: 'draft',
      amount: parseFloat(newReturn.amount),
      dueDate: `${newReturn.year}-04-15`
    };

    setTaxReturns([newTaxReturn, ...taxReturns]);
    setNewReturn({ year: '', type: 'Individual Income Tax', amount: '' });
    setShowNewReturnModal(false);
    Alert.alert('Success', 'Tax return created successfully');
  };

  const handleDeleteReturn = (id: number) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this tax return?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setTaxReturns(taxReturns.filter(item => item.id !== id));
          }
        }
      ]
    );
  };

  const handleSubmitReturn = (id: number) => {
    Alert.alert(
      'Submit Tax Return',
      'Are you sure you want to submit this tax return? You will not be able to edit it after submission.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Submit', 
          onPress: () => {
            setTaxReturns(taxReturns.map(item => 
              item.id === id ? { ...item, status: 'submitted' } : item
            ));
            Alert.alert('Success', 'Tax return submitted successfully');
          }
        }
      ]
    );
  };

  const quickActions = [
    {
      id: 1,
      title: 'Individual Tax',
      icon: User,
      color: '#2d5a87',
      description: 'File personal income tax return'
    },
    {
      id: 2,
      title: 'Business Tax',
      icon: Building,
      color: '#059669',
      description: 'File business tax return'
    },
    {
      id: 3,
      title: 'Property Tax',
      icon: DollarSign,
      color: '#dc2626',
      description: 'File property tax return'
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Tax Filing</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setShowNewReturnModal(true)}
          >
            <Plus size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick File</Text>
          <View style={styles.quickActionsContainer}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.quickActionCard}
                onPress={() => setShowNewReturnModal(true)}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}>
                  <action.icon size={24} color="#fff" />
                </View>
                <Text style={styles.quickActionTitle}>{action.title}</Text>
                <Text style={styles.quickActionDescription}>{action.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Tax Returns</Text>
          {taxReturns.map((item) => (
            <View key={item.id} style={styles.returnCard}>
              <View style={styles.returnHeader}>
                <View style={styles.returnInfo}>
                  <Text style={styles.returnYear}>{item.year}</Text>
                  <Text style={styles.returnType}>{item.type}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                  <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
                </View>
              </View>
              
              <View style={styles.returnDetails}>
                <View style={styles.returnDetailItem}>
                  <DollarSign size={16} color="#666" />
                  <Text style={styles.returnDetailText}>SSP {item.amount.toLocaleString()}</Text>
                </View>
                <View style={styles.returnDetailItem}>
                  <Calendar size={16} color="#666" />
                  <Text style={styles.returnDetailText}>Due: {item.dueDate}</Text>
                </View>
              </View>

              <View style={styles.returnActions}>
                {item.status === 'draft' && (
                  <>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => Alert.alert('Edit', 'Edit functionality would be implemented here')}
                    >
                      <Edit3 size={16} color="#2d5a87" />
                      <Text style={styles.actionButtonText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => handleSubmitReturn(item.id)}
                    >
                      <Check size={16} color="#059669" />
                      <Text style={[styles.actionButtonText, { color: '#059669' }]}>Submit</Text>
                    </TouchableOpacity>
                  </>
                )}
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleDeleteReturn(item.id)}
                >
                  <Trash2 size={16} color="#dc2626" />
                  <Text style={[styles.actionButtonText, { color: '#dc2626' }]}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <Modal
        visible={showNewReturnModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New Tax Return</Text>
              <TouchableOpacity onPress={() => setShowNewReturnModal(false)}>
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.inputLabel}>Tax Year</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g., 2024"
                value={newReturn.year}
                onChangeText={(text) => setNewReturn({...newReturn, year: text})}
                keyboardType="numeric"
              />

              <Text style={styles.inputLabel}>Tax Type</Text>
              <View style={styles.modalInput}>
                <Text style={styles.inputText}>{newReturn.type}</Text>
              </View>

              <Text style={styles.inputLabel}>Estimated Amount (SSP)</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g., 45000"
                value={newReturn.amount}
                onChangeText={(text) => setNewReturn({...newReturn, amount: text})}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowNewReturnModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.createButton}
                onPress={handleCreateReturn}
              >
                <Text style={styles.createButtonText}>Create</Text>
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
  addButton: {
    backgroundColor: '#2d5a87',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
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
  quickActionsContainer: {
    paddingHorizontal: 20,
  },
  quickActionCard: {
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
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a365d',
    flex: 1,
  },
  quickActionDescription: {
    fontSize: 12,
    color: '#666',
    flex: 2,
  },
  returnCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  returnHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  returnInfo: {
    flex: 1,
  },
  returnYear: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a365d',
  },
  returnType: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  returnDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  returnDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  returnDetailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  returnActions: {
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
  createButton: {
    backgroundColor: '#2d5a87',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  createButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});
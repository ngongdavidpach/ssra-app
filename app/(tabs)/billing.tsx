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
import { CreditCard, Plus, DollarSign, Calendar, Clock, CircleCheck as CheckCircle, CircleAlert as AlertCircle, X, Building, Hash, Copy, Download, QrCode, Smartphone } from 'lucide-react-native';

interface Bill {
  id: number;
  type: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
  description: string;
  prn?: string;
  bankDetails?: BankDetails;
}

interface BankDetails {
  bankName: string;
  accountNumber: string;
  accountName: string;
  swiftCode: string;
}

interface Assessment {
  taxType: string;
  income: number;
  deductions: number;
  taxRate: number;
}

export default function BillingScreen() {
  const [bills, setBills] = useState<Bill[]>([
    {
      id: 1,
      type: 'Income Tax',
      amount: 125000,
      dueDate: '2024-03-15',
      status: 'pending',
      description: 'Annual Income Tax 2024',
      prn: 'SSRA240315001',
      bankDetails: {
        bankName: 'Bank of South Sudan',
        accountNumber: '1234567890',
        accountName: 'South Sudan Revenue Authority',
        swiftCode: 'BOSSSSJU'
      }
    },
    {
      id: 2,
      type: 'Business Tax',
      amount: 75000,
      dueDate: '2024-04-01',
      status: 'paid',
      description: 'Quarterly Business Tax Q1 2024',
      prn: 'SSRA240401002'
    },
    {
      id: 3,
      type: 'Property Tax',
      amount: 50000,
      dueDate: '2024-02-28',
      status: 'overdue',
      description: 'Annual Property Tax 2024',
      prn: 'SSRA240228003'
    },
  ]);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [showPRNModal, setShowPRNModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [assessment, setAssessment] = useState<Assessment>({
    taxType: 'Income Tax',
    income: 0,
    deductions: 0,
    taxRate: 15
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return '#10b981';
      case 'pending':
        return '#f59e0b';
      case 'overdue':
        return '#dc2626';
      default:
        return '#6b7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return CheckCircle;
      case 'pending':
        return Clock;
      case 'overdue':
        return AlertCircle;
      default:
        return Clock;
    }
  };

  const generatePRN = () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `SSRA${year}${month}${day}${random}`;
  };

  const calculateTax = () => {
    const taxableIncome = assessment.income - assessment.deductions;
    const taxAmount = (taxableIncome * assessment.taxRate) / 100;
    return Math.max(0, taxAmount);
  };

  const handlePayment = (bill: Bill) => {
    setSelectedBill(bill);
    setShowPaymentModal(true);
  };

  const handlePRNGeneration = (bill: Bill) => {
    setSelectedBill(bill);
    setShowPRNModal(true);
  };

  const copyToClipboard = (text: string) => {
    // In a real app, you'd use Clipboard API
    Alert.alert('Copied', `${text} copied to clipboard`);
  };

  const downloadReceipt = (bill: Bill) => {
    Alert.alert('Download', `Receipt for ${bill.description} will be downloaded`);
  };

  const totalPending = bills
    .filter(bill => bill.status === 'pending' || bill.status === 'overdue')
    .reduce((sum, bill) => sum + bill.amount, 0);

  const totalPaid = bills
    .filter(bill => bill.status === 'paid')
    .reduce((sum, bill) => sum + bill.amount, 0);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Billing & Payments</Text>
          <TouchableOpacity 
            style={styles.assessmentButton}
            onPress={() => setShowAssessmentModal(true)}
          >
            <Plus size={20} color="#fff" />
            <Text style={styles.assessmentButtonText}>Assessment</Text>
          </TouchableOpacity>
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <View style={[styles.summaryCard, { backgroundColor: '#fef3c7' }]}>
            <DollarSign size={24} color="#f59e0b" />
            <Text style={styles.summaryAmount}>SSP {totalPending.toLocaleString()}</Text>
            <Text style={styles.summaryLabel}>Outstanding</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: '#d1fae5' }]}>
            <CheckCircle size={24} color="#10b981" />
            <Text style={styles.summaryAmount}>SSP {totalPaid.toLocaleString()}</Text>
            <Text style={styles.summaryLabel}>Paid This Year</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsContainer}>
            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => setShowAssessmentModal(true)}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#2d5a87' }]}>
                <DollarSign size={24} color="#fff" />
              </View>
              <Text style={styles.quickActionText}>Tax Assessment</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => Alert.alert('Payment History', 'Payment history would be shown here')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#059669' }]}>
                <Calendar size={24} color="#fff" />
              </View>
              <Text style={styles.quickActionText}>Payment History</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bills List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Bills</Text>
          {bills.map((bill) => {
            const StatusIcon = getStatusIcon(bill.status);
            return (
              <View key={bill.id} style={styles.billCard}>
                <View style={styles.billHeader}>
                  <View style={styles.billInfo}>
                    <Text style={styles.billType}>{bill.type}</Text>
                    <Text style={styles.billDescription}>{bill.description}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(bill.status) }]}>
                    <StatusIcon size={12} color="#fff" />
                    <Text style={styles.statusText}>{bill.status.toUpperCase()}</Text>
                  </View>
                </View>
                
                <View style={styles.billDetails}>
                  <View style={styles.billDetailItem}>
                    <Text style={styles.billAmount}>SSP {bill.amount.toLocaleString()}</Text>
                    <Text style={styles.billDueDate}>Due: {bill.dueDate}</Text>
                  </View>
                  {bill.prn && (
                    <View style={styles.prnContainer}>
                      <Text style={styles.prnLabel}>PRN:</Text>
                      <Text style={styles.prnText}>{bill.prn}</Text>
                      <TouchableOpacity onPress={() => copyToClipboard(bill.prn)}>
                        <Copy size={16} color="#2d5a87" />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>

                <View style={styles.billActions}>
                  {bill.status === 'pending' || bill.status === 'overdue' ? (
                    <>
                      <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => handlePayment(bill)}
                      >
                        <CreditCard size={16} color="#2d5a87" />
                        <Text style={styles.actionButtonText}>Pay Now</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => handlePRNGeneration(bill)}
                      >
                        <QrCode size={16} color="#059669" />
                        <Text style={[styles.actionButtonText, { color: '#059669' }]}>PRN Details</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => downloadReceipt(bill)}
                    >
                      <Download size={16} color="#10b981" />
                      <Text style={[styles.actionButtonText, { color: '#10b981' }]}>Receipt</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Payment Modal */}
      <Modal
        visible={showPaymentModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Payment Options</Text>
              <TouchableOpacity onPress={() => setShowPaymentModal(false)}>
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              {selectedBill && (
                <>
                  <View style={styles.billSummary}>
                    <Text style={styles.billSummaryTitle}>{selectedBill.description}</Text>
                    <Text style={styles.billSummaryAmount}>SSP {selectedBill.amount.toLocaleString()}</Text>
                  </View>

                  <TouchableOpacity style={styles.paymentOption}>
                    <View style={styles.paymentIcon}>
                      <Smartphone size={24} color="#2d5a87" />
                    </View>
                    <View style={styles.paymentText}>
                      <Text style={styles.paymentTitle}>Mobile Money</Text>
                      <Text style={styles.paymentSubtitle}>Pay with MTN, Airtel, or Zain</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.paymentOption}>
                    <View style={styles.paymentIcon}>
                      <Building size={24} color="#2d5a87" />
                    </View>
                    <View style={styles.paymentText}>
                      <Text style={styles.paymentTitle}>Bank Transfer</Text>
                      <Text style={styles.paymentSubtitle}>Use PRN for bank payment</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.paymentOption}>
                    <View style={styles.paymentIcon}>
                      <CreditCard size={24} color="#2d5a87" />
                    </View>
                    <View style={styles.paymentText}>
                      <Text style={styles.paymentTitle}>Debit/Credit Card</Text>
                      <Text style={styles.paymentSubtitle}>Visa, Mastercard accepted</Text>
                    </View>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </View>
      </Modal>

      {/* Assessment Modal */}
      <Modal
        visible={showAssessmentModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Tax Assessment Calculator</Text>
              <TouchableOpacity onPress={() => setShowAssessmentModal(false)}>
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={styles.inputLabel}>Tax Type</Text>
              <View style={styles.modalInput}>
                <Text style={styles.inputText}>{assessment.taxType}</Text>
              </View>

              <Text style={styles.inputLabel}>Annual Income (SSP)</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Enter your annual income"
                value={assessment.income.toString()}
                onChangeText={(text) => setAssessment({...assessment, income: parseFloat(text) || 0})}
                keyboardType="numeric"
              />

              <Text style={styles.inputLabel}>Deductions (SSP)</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Enter total deductions"
                value={assessment.deductions.toString()}
                onChangeText={(text) => setAssessment({...assessment, deductions: parseFloat(text) || 0})}
                keyboardType="numeric"
              />

              <Text style={styles.inputLabel}>Tax Rate (%)</Text>
              <View style={styles.modalInput}>
                <Text style={styles.inputText}>{assessment.taxRate}%</Text>
              </View>

              <View style={styles.assessmentResult}>
                <Text style={styles.assessmentResultLabel}>Estimated Tax:</Text>
                <Text style={styles.assessmentResultAmount}>
                  SSP {calculateTax().toLocaleString()}
                </Text>
              </View>

              <TouchableOpacity 
                style={styles.generateBillButton}
                onPress={() => {
                  const newBill: Bill = {
                    id: Date.now(),
                    type: assessment.taxType,
                    amount: calculateTax(),
                    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    status: 'pending',
                    description: `${assessment.taxType} Assessment`,
                    prn: generatePRN()
                  };
                  setBills([newBill, ...bills]);
                  setShowAssessmentModal(false);
                  Alert.alert('Success', 'Tax assessment created and bill generated');
                }}
              >
                <Text style={styles.generateBillButtonText}>Generate Bill</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* PRN Details Modal */}
      <Modal
        visible={showPRNModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Payment Reference Details</Text>
              <TouchableOpacity onPress={() => setShowPRNModal(false)}>
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {selectedBill && (
                <>
                  <View style={styles.prnDetailsCard}>
                    <Text style={styles.prnDetailsTitle}>Payment Reference Number</Text>
                    <View style={styles.prnDetailsRow}>
                      <Text style={styles.prnDetailsValue}>{selectedBill.prn}</Text>
                      <TouchableOpacity onPress={() => copyToClipboard(selectedBill.prn || '')}>
                        <Copy size={20} color="#2d5a87" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {selectedBill.bankDetails && (
                    <View style={styles.bankDetailsCard}>
                      <Text style={styles.bankDetailsTitle}>Bank Details</Text>
                      
                      <View style={styles.bankDetailRow}>
                        <Text style={styles.bankDetailLabel}>Bank Name:</Text>
                        <Text style={styles.bankDetailValue}>{selectedBill.bankDetails.bankName}</Text>
                      </View>
                      
                      <View style={styles.bankDetailRow}>
                        <Text style={styles.bankDetailLabel}>Account Number:</Text>
                        <View style={styles.bankDetailValueRow}>
                          <Text style={styles.bankDetailValue}>{selectedBill.bankDetails.accountNumber}</Text>
                          <TouchableOpacity onPress={() => copyToClipboard(selectedBill.bankDetails?.accountNumber || '')}>
                            <Copy size={16} color="#2d5a87" />
                          </TouchableOpacity>
                        </View>
                      </View>
                      
                      <View style={styles.bankDetailRow}>
                        <Text style={styles.bankDetailLabel}>Account Name:</Text>
                        <Text style={styles.bankDetailValue}>{selectedBill.bankDetails.accountName}</Text>
                      </View>
                      
                      <View style={styles.bankDetailRow}>
                        <Text style={styles.bankDetailLabel}>SWIFT Code:</Text>
                        <Text style={styles.bankDetailValue}>{selectedBill.bankDetails.swiftCode}</Text>
                      </View>
                    </View>
                  )}

                  <View style={styles.paymentInstructions}>
                    <Text style={styles.instructionsTitle}>Payment Instructions</Text>
                    <Text style={styles.instructionsText}>
                      1. Use the PRN as your payment reference{'\n'}
                      2. Transfer the exact amount: SSP {selectedBill.amount.toLocaleString()}{'\n'}
                      3. Keep your bank receipt for verification{'\n'}
                      4. Payment will be processed within 24 hours
                    </Text>
                  </View>
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
  assessmentButton: {
    backgroundColor: '#2d5a87',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  assessmentButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  summaryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 4,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a365d',
    marginTop: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
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
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  quickActionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    alignItems: 'center',
    minWidth: 120,
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
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1a365d',
    textAlign: 'center',
  },
  billCard: {
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
  billHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  billInfo: {
    flex: 1,
  },
  billType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a365d',
  },
  billDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
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
  billDetails: {
    marginBottom: 12,
  },
  billDetailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  billAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d5a87',
  },
  billDueDate: {
    fontSize: 14,
    color: '#666',
  },
  prnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 8,
    borderRadius: 8,
  },
  prnLabel: {
    fontSize: 12,
    color: '#666',
    marginRight: 8,
  },
  prnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a365d',
    flex: 1,
  },
  billActions: {
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
  billSummary: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  billSummaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a365d',
    marginBottom: 8,
  },
  billSummaryAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d5a87',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 12,
  },
  paymentIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  paymentText: {
    flex: 1,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a365d',
  },
  paymentSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
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
  assessmentResult: {
    backgroundColor: '#e0f2fe',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  assessmentResultLabel: {
    fontSize: 14,
    color: '#0369a1',
    marginBottom: 4,
  },
  assessmentResultAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0369a1',
  },
  generateBillButton: {
    backgroundColor: '#2d5a87',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  generateBillButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  prnDetailsCard: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  prnDetailsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a365d',
    marginBottom: 8,
  },
  prnDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  prnDetailsValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d5a87',
  },
  bankDetailsCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  bankDetailsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a365d',
    marginBottom: 12,
  },
  bankDetailRow: {
    marginBottom: 8,
  },
  bankDetailLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  bankDetailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a365d',
  },
  bankDetailValueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentInstructions: {
    backgroundColor: '#fef3c7',
    padding: 16,
    borderRadius: 8,
  },
  instructionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400e',
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 14,
    color: '#92400e',
    lineHeight: 20,
  },
});
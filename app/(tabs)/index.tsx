import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { FileText, FolderOpen, DollarSign, Calendar, Bell, TrendingUp, CircleCheck as CheckCircle, CircleAlert as AlertCircle, Clock, CreditCard, Award, Calculator, QrCode, Building } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const quickActions = [
    {
      id: 1,
      title: 'File Tax Return',
      icon: FileText,
      color: '#2d5a87',
      route: '/(tabs)/filing',
    },
    {
      id: 2,
      title: 'Pay Bills',
      icon: CreditCard,
      color: '#059669',
      route: '/(tabs)/billing',
    },
    {
      id: 3,
      title: 'Get Certificate',
      icon: Award,
      color: '#7c3aed',
      route: '/(tabs)/certificates',
    },
    {
      id: 4,
      title: 'Upload Documents',
      icon: FolderOpen,
      color: '#dc2626',
      route: '/(tabs)/documents',
    },
  ];

  const recentActivity = [
    {
      id: 1,
      title: 'Tax Clearance Certificate Issued',
      date: '2 days ago',
      status: 'completed',
      icon: CheckCircle,
    },
    {
      id: 2,
      title: 'Income Tax Payment Due',
      date: '5 days',
      status: 'pending',
      icon: AlertCircle,
    },
    {
      id: 3,
      title: 'Business Registration Approved',
      date: '1 week ago',
      status: 'completed',
      icon: CheckCircle,
    },
    {
      id: 4,
      title: 'VAT Return Submitted',
      date: '2 weeks ago',
      status: 'processing',
      icon: Clock,
    },
  ];

  const services = [
    {
      id: 1,
      title: 'Tax Assessment',
      description: 'Calculate your tax liability',
      icon: Calculator,
      color: '#2d5a87',
      route: '/(tabs)/billing',
    },
    {
      id: 2,
      title: 'PRN Generator',
      description: 'Generate payment reference numbers',
      icon: QrCode,
      color: '#059669',
      route: '/(tabs)/billing',
    },
    {
      id: 3,
      title: 'Business Services',
      description: 'Register and manage your business',
      icon: Building,
      color: '#7c3aed',
      route: '/(tabs)/certificates',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#059669';
      case 'pending':
        return '#dc2626';
      case 'processing':
        return '#7c3aed';
      default:
        return '#666';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Image 
              source={{ uri: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2' }}
              style={styles.profileImage}
            />
            <View style={styles.headerText}>
              <Text style={styles.greeting}>Good morning!</Text>
              <Text style={styles.userName}>John Doe</Text>
              <Text style={styles.userRole}>Taxpayer ID: SS123456789</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Bell size={24} color="#2d5a87" />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryTitle}>Tax Summary 2024</Text>
            <TrendingUp size={20} color="#059669" />
          </View>
          <View style={styles.summaryContent}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Paid</Text>
              <Text style={styles.summaryValue}>SSP 245,000</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Outstanding</Text>
              <Text style={[styles.summaryValue, { color: '#dc2626' }]}>SSP 125,000</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Certificates</Text>
              <Text style={[styles.summaryValue, { color: '#059669' }]}>4 Active</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.quickActionCard}
                onPress={() => router.push(action.route as any)}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}>
                  <action.icon size={24} color="#fff" />
                </View>
                <Text style={styles.quickActionText}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Services</Text>
          {services.map((service) => (
            <TouchableOpacity
              key={service.id}
              style={styles.serviceCard}
              onPress={() => router.push(service.route as any)}
            >
              <View style={[styles.serviceIcon, { backgroundColor: `${service.color}15` }]}>
                <service.icon size={24} color={service.color} />
              </View>
              <View style={styles.serviceContent}>
                <Text style={styles.serviceTitle}>{service.title}</Text>
                <Text style={styles.serviceDescription}>{service.description}</Text>
              </View>
              <View style={styles.serviceArrow}>
                <Text style={styles.serviceArrowText}>→</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {recentActivity.map((activity) => (
            <View key={activity.id} style={styles.activityCard}>
              <View style={styles.activityIconContainer}>
                <activity.icon size={20} color={getStatusColor(activity.status)} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                <Text style={styles.activityDate}>{activity.date}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(activity.status) }]}>
                <Text style={styles.statusText}>
                  {activity.status === 'completed' ? 'Done' : 
                   activity.status === 'processing' ? 'Processing' : 'Pending'}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Important Dates</Text>
          <View style={styles.dateCard}>
            <View style={styles.dateIcon}>
              <Calendar size={20} color="#7c3aed" />
            </View>
            <View style={styles.dateContent}>
              <Text style={styles.dateTitle}>Annual Tax Filing Deadline</Text>
              <Text style={styles.dateSubtitle}>April 15, 2024</Text>
            </View>
            <View style={styles.dateTimeLeft}>
              <Clock size={16} color="#dc2626" />
              <Text style={styles.timeLeftText}>45 days</Text>
            </View>
          </View>
          
          <View style={styles.dateCard}>
            <View style={styles.dateIcon}>
              <DollarSign size={20} color="#059669" />
            </View>
            <View style={styles.dateContent}>
              <Text style={styles.dateTitle}>Quarterly VAT Return</Text>
              <Text style={styles.dateSubtitle}>March 31, 2024</Text>
            </View>
            <View style={styles.dateTimeLeft}>
              <Clock size={16} color="#f59e0b" />
              <Text style={[styles.timeLeftText, { color: '#f59e0b' }]}>15 days</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>South Sudan Revenue Authority</Text>
          <Text style={styles.footerSubtext}>Building a prosperous South Sudan through efficient tax administration</Text>
        </View>
      </ScrollView>
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
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  greeting: {
    fontSize: 14,
    color: '#666',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a365d',
  },
  userRole: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#dc2626',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a365d',
  },
  summaryContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a365d',
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
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: (width - 60) / 2,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a365d',
    textAlign: 'center',
  },
  serviceCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  serviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  serviceContent: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a365d',
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#666',
  },
  serviceArrow: {
    padding: 8,
  },
  serviceArrowText: {
    fontSize: 18,
    color: '#2d5a87',
    fontWeight: 'bold',
  },
  activityCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  activityIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a365d',
    marginBottom: 4,
  },
  activityDate: {
    fontSize: 12,
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
  dateCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  dateIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  dateContent: {
    flex: 1,
  },
  dateTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a365d',
    marginBottom: 4,
  },
  dateSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  dateTimeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  timeLeftText: {
    fontSize: 12,
    color: '#dc2626',
    fontWeight: '500',
    marginLeft: 4,
  },
  footer: {
    backgroundColor: '#2d5a87',
    padding: 24,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  footerSubtext: {
    fontSize: 14,
    color: '#cbd5e1',
    textAlign: 'center',
    lineHeight: 20,
  },
});
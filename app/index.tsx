import { Redirect } from 'expo-router';

export default function Index() {
  // Check if user is authenticated
  const isAuthenticated = false; // This would come from your auth state
  
  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  } else {
    return <Redirect href="/(auth)/login" />;
  }
}
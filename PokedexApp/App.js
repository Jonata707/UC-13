import { ClerkProvider } from '@clerk/clerk-expo';
import Routes from './src/navigation';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  return (
    <ClerkProvider publishableKey="pk_test_bG92ZWQtY2FtZWwtNTMuY2xlcmsuYWNjb3VudHMuZGV2JA">
      <Routes />
    </ClerkProvider>
  );
}
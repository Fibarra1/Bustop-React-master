/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { AuthProvider } from './src/context/auth';
import { RootNavigation } from './src/navigation/RootNavigation';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useEffect } from 'react';

function App(): JSX.Element {

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '978163588725-f1mjvbeh8akclq5bfshevurn4mhtij2v.apps.googleusercontent.com',
    });
  }, [])

  return (
    <AuthProvider>
      <RootNavigation />
    </AuthProvider>
  );
}

export default App;

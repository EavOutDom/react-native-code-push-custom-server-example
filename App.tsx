/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import CodePush from 'react-native-code-push';

type DeploymentKeys = {
  ios: {[key: string]: string};
  android: {[key: string]: string};
};

const CODEPUSH_DEPLOYMENT_KEYS: DeploymentKeys = {
  android: {
    production: '43SgCqH5JP2V9tOPfTri8iZOsukN4ksvOXqog',
    staging: 'Dhps79edindqy6F6rfVDJgrg9CHY4ksvOXqog',
  },
  ios: {
    production: 'lOVrQI4itIp1z0QMGMJVDvPIvRVq4ksvOXqog',
    staging: 'krxkHqnXRfKg9XO2K81fnVyHDOpQ4ksvOXqog',
  },
};

let codePushOptions = {checkFrequency: CodePush.CheckFrequency.ON_APP_START};

function App(): React.JSX.Element {
  const [status, setStatus] = React.useState('');
  const [process, setProcess] = React.useState('');

  const handleChangeEnvironment = (env: string) => {
    const {ios, android} = CODEPUSH_DEPLOYMENT_KEYS;
    const selectedKeys = Platform.OS === 'ios' ? ios : android;
    const deploymentKey = selectedKeys[env] || selectedKeys.production;
    CodePush.sync(
      {
        deploymentKey,
        updateDialog: true,
        installMode: CodePush.InstallMode.IMMEDIATE,
        mandatoryInstallMode: CodePush.InstallMode.IMMEDIATE,
      },
      status => {
        switch (status) {
          case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
            setStatus('Downloading package.');
            break;
          case CodePush.SyncStatus.INSTALLING_UPDATE:
            setStatus('Installing update.');
            break;
          case CodePush.SyncStatus.UPDATE_INSTALLED:
            CodePush.notifyAppReady();
            setStatus('Update installed. Restart not required.');
            break;
          case CodePush.SyncStatus.UP_TO_DATE:
            setStatus('The app is up to date.');
            break;
          case CodePush.SyncStatus.UPDATE_IGNORED:
            setStatus('Update cancelled by user.');
            break;
          case CodePush.SyncStatus.UNKNOWN_ERROR:
            setStatus('An unknown error occurred.');
            break;
        }
      },
      progress => {
        setProcess(
          `Received ${progress.receivedBytes} of ${progress.totalBytes} bytes.`,
        );
      },
    ).catch(e => setStatus(JSON.stringify(e)));
  };

  return (
    <SafeAreaView style={{flex: 1, padding: 20}}>
      <TouchableOpacity
        style={{padding: 10, backgroundColor: 'red'}}
        onPress={() => handleChangeEnvironment('production')}>
        <Text>Check for updates for production</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{padding: 10, backgroundColor: 'blue', marginVertical: 20}}
        onPress={() => handleChangeEnvironment('staging')}>
        <Text>Check for updates for staging</Text>
      </TouchableOpacity>
      <Text>Staging 1.0.3</Text>
      <Text>{status}</Text>
      <Text>{process}</Text>
    </SafeAreaView>
  );
}

export default CodePush(codePushOptions)(App);

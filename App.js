import React, { useEffect, useState } from 'react';
import { Text, View, Pressable, StyleSheet } from 'react-native';
import { ethers } from 'ethers';
import { WalletConnectModal, useWalletConnectModal } from '@walletconnect/modal-react-native';

const projectId = '315b25d26527e41f1d8244b75db7b85f';

const providerMetadata = {
  name: 'YOUR_PROJECT_NAME',
  description: 'YOUR_PROJECT_DESCRIPTION',
  url: 'https://your-project-website.com/',
  icons: ['https://your-project-logo.com/'],
  redirect: {
    native: 'YOUR_APP_SCHEME://',
    universal: 'YOUR_APP_UNIVERSAL_LINK.com',
  },
};

export default function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const { isOpen, open, close, isConnected, address } = useWalletConnectModal();

  useEffect(() => {
    const initProvider = async () => {
      if (isConnected) {
        // Access the connected wallet's provider and signer here
        const walletProvider = new ethers.providers.Web3Provider(provider);
        const walletSigner = walletProvider.getSigner();

        setProvider(walletProvider);
        setSigner(walletSigner);
      }
    };

    initProvider();
  }, [isConnected]);

  const handleToggleModal = async () => {
    if (isConnected) {
      try {
        // Perform any necessary cleanup or disconnection steps here
        setProvider(null);
        setSigner(null);
  
        // Update the isConnected state to false
      } catch (error) {
        console.error('Error disconnecting:', error);
      }
    } else {
      open(); // Open the wallet connect modal
    }
  };

  const handleSignature = async () => {
    if (signer) {
      try {
        const message = 'Hello, this is a signed message!';
        const signature = await signer.signMessage(message);

        console.log('Message signature:', signature);
      } catch (error) {
        console.error('Error signing message:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text>Wallet Connect</Text>
      <Pressable
        onPress={handleToggleModal}
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      >
        <Text>{isConnected ? 'Disconnect' : 'Connect'}</Text>
      </Pressable>
      <Pressable onPress={handleSignature} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
        <Text>Sign Message</Text>
      </Pressable>
      <Text>{isConnected ? address : 'Status: Not Connected'}</Text>
      <WalletConnectModal
        projectId={projectId}
        providerMetadata={providerMetadata}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 70,
    alignItems: 'center',
  },
  button: {
    padding: 10,
    margin: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  pressed: {
    opacity: 0.6,
  },
});

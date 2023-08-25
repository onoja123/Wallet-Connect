import React, { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View, Pressable } from 'react-native'
import { ethers } from 'ethers'
import {
  WalletConnectModal,
  useWalletConnectModal,
} from '@walletconnect/modal-react-native'

const projectId = '315b25d26527e41f1d8244b75db7b85f'

const providerMetadata = {
  name: 'YOUR_PROJECT_NAME',
  description: 'YOUR_PROJECT_DESCRIPTION',
  url: 'https://your-project-website.com/',
  icons: ['https://your-project-logo.com/'],
  redirect: {
    native: 'YOUR_APP_SCHEME://',
    universal: 'YOUR_APP_UNIVERSAL_LINK.com',
  },
}

export default function App() {
    const [provider, setProvider] = useState(null)
    const [signer, setSigner] = useState(null)
  const { isOpen, open, close, isConnected, address } =
    useWalletConnectModal()

    useEffect(() => {
      const initProvider = async () => {
        const infuraApiKey = '572f15aef61f46aea1e0669b5465c4ec'
        const provider = new ethers.providers.JsonRpcProvider(
          `https://mainnet.infura.io/v3/${infuraApiKey}`
        )

        // Replace with your private key
        const privateKey =
          '0x40c8bd7580b4d81d4417ea3317d9b37dcd9628d5327b44d0622518c971537769'
        const wallet = new ethers.Wallet(privateKey, provider)
        const signer = wallet.connect(provider)

        setProvider(provider)
        setSigner(signer)
      }

      initProvider()
    }, [])
  const handleTransaction = async () => {
    if (signer) {
      try {
        const transaction = {
          to: '0xD98FD1B85A65Bf53c43e785a194e50913AeC8356', // Replace with recipient's Ethereum address
          value: ethers.utils.parseEther('0.1'), // Amount of ETH to send
        }

        const txResponse = await signer.sendTransaction(transaction)

        console.log('Transaction sent:', txResponse)
      } catch (error) {
        console.error('Error sending transaction:', error.code)
      }
    }
  }

  const handleSignature = async () => {
    if (signer) {
      try {
        const message = 'Hello, this is a signed message!'
        const signature = await signer.signMessage(message)

        console.log('Message signature:', signature)
      } catch (error) {
        console.error('Error signing message:', error)
      }
    }
  }

  const handleToggleModal = () => {
     if (isConnected) {
       return provider?.disconnect()
     }
     return open()
  }


  // console.log(provider)

  return (
    <View style={styles.container}>
      <Text>Wallet Connect</Text>
      <Pressable
        onPress={handleToggleModal}
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      >
        <Text>{isConnected ? 'Disconnect' : 'Connect'}</Text>
      </Pressable>
      <Pressable onPress={handleTransaction} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
        <Text>Send Transaction</Text>
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
  )
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
})

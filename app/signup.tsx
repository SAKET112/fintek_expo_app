import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState } from 'react'
import { defaultStyles } from '@/constants/Styles'
import Colors from '@/constants/Colors'
import { Link, useRouter } from 'expo-router'
import { useSignUp } from '@clerk/clerk-expo'

const Page = () => {

  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 90 : 0;
  const router = useRouter();
  const {signUp} = useSignUp();

  const onSignup = async() => {

      const fullPhoneNumber = `${countryCode}${phoneNumber}`;
      // router.push({pathname: '/verify/[phone]', params: {phone: fullPhoneNumber}})

      try {
        await signUp!.create({
            phoneNumber: fullPhoneNumber
        });
        signUp!.preparePhoneNumberVerification();
        router.push({pathname: '/verify/[phone]', params: {phone: fullPhoneNumber}})
      } catch (err) {
        console.error('Error signing up: ', err)
      }
  }
  
  return (
    <KeyboardAvoidingView style={{flex: 1}} behavior='padding' keyboardVerticalOffset={keyboardVerticalOffset}>
      <View style={defaultStyles.container}>
        <Text style={defaultStyles.header}>Lets get started!</Text>
        <Text style={defaultStyles.descriptionText}>
          Enter Your phone number. We will send you a confirmation code there
        </Text>
        <View style={styles.inputContainer}>
          <TextInput 
            style={[styles.input, {width: 80}]}
            placeholder='Country Code'
            placeholderTextColor={Colors.gray}
            value={countryCode}
          />
          <TextInput 
            style={[styles.input, {flex: 1}]}
            placeholder='Mobile Number'
            placeholderTextColor={Colors.gray}
            keyboardType='numeric'
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
        </View>
        <Link href={'/login'} replace asChild>
          <TouchableOpacity>
            <Text style={defaultStyles.textLink}>Already have an account? Log in</Text>
          </TouchableOpacity>
        </Link>

        <View style={{flex: 1}} />

        <TouchableOpacity style={[defaultStyles.pillButton, phoneNumber !== '' ? styles.enabled : styles.disabled, {marginBottom: 20}]} onPress={onSignup}>
          <Text style={defaultStyles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: 40,
    flexDirection: 'row'
  },
  input:{
    backgroundColor: Colors.lightGray,
    padding: 20,
    borderRadius: 16,
    fontSize: 20,
    marginRight:10
  },
  enabled: {
    backgroundColor: Colors.primary
  }, 
  disabled: {
    backgroundColor: Colors.primaryMuted
  }
})

export default Page
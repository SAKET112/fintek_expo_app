import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useUser } from '@clerk/clerk-expo'
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import * as Haptics from 'expo-haptics';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as LocalAuthentication from 'expo-local-authentication';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { transform } from '@babel/core';

const Page = () => {

  const { user } = useUser();
  const [firstName, setFirstName] = useState(user?.firstName);
  const [code, setCode] = useState<number[]>([]);
  const codeLength = Array(6).fill(0);

  const Offset = useSharedValue(0);
  const style = useAnimatedStyle(() => {
    return {
      transform: [{translateX: Offset.value}]
    }
  });

  const OFFSET = 20;
  const TIME = 80

  useEffect(() => {
    if(code.length === 6){
      if(code.join('') === '111111') {
        router.replace('/(authenticated)/(tabs)/home')
      } else {
        Offset.value = withSequence(
          withTiming(-OFFSET, {duration: TIME / 2}),
          withRepeat(withTiming(OFFSET, {duration: TIME}), 4, true),
          withTiming(0,{duration: TIME / 2})
        )
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        setCode([]);
      }
    }
  }, [code]);

  const onNumberPress = (number: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCode([...code, number]);
  }

  const numberBackSpace = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCode(code.slice(0, -1));
  }

  const onBiometricAuthPress = async() => {
    const {success} = await LocalAuthentication.authenticateAsync();
    if(success) {
      router.replace('/(authenticated)/(tabs)/home');
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }

  return (
    <SafeAreaView>
      <Text style={styles.greeting}>Welcome back, {firstName}</Text>

      <Animated.View style={[styles.codeView, style]}>
        {codeLength.map((_, index) => (
          <View key={index} style={[styles.codeEmpty, {backgroundColor: code[index] ? Colors.primary : Colors.lightGray}]} />
        ))}
      </Animated.View>

      <View style={styles.numbersView}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          {[1,2,3].map((number, index) => (
            <TouchableOpacity key={index} onPress={() => onNumberPress(number)}>
              <Text style={styles.number}>{number}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          {[4,5,6].map((number, index) => (
            <TouchableOpacity key={index} onPress={() => onNumberPress(number)}>
              <Text style={styles.number}>{number}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          {[7,8,9].map((number, index) => (
            <TouchableOpacity key={index} onPress={() => onNumberPress(number)}>
              <Text style={styles.number}>{number}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
          
            <TouchableOpacity  onPress={onBiometricAuthPress}>
              <MaterialCommunityIcons name='fingerprint' size={26} color='black' />
            </TouchableOpacity>

            <TouchableOpacity  onPress={() => onNumberPress(0)}>
              <Text style={styles.number}>0</Text>
            </TouchableOpacity>

            <View style={{minWidth: 30}}>
              {code.length > 0 && (
                <TouchableOpacity  onPress={numberBackSpace}>
                  <MaterialCommunityIcons name='backspace' size={26} color='black' />
                </TouchableOpacity>
              )}
            </View>
        </View>
        <Text style={{alignSelf: 'center', color: Colors.primary, fontWeight: 500, fontSize: 18}}>Forgot Your Passcode?</Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    greeting: {
      fontSize: 24,
      fontWeight: 'bold',
      marginTop: 80,
      alignSelf: 'center'
    },
    codeView: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 20,
      marginVertical: 100
    },
    codeEmpty: {
      width: 20,
      height: 20,
      borderRadius: 10
    },
    numbersView: {
      marginHorizontal: 80,
      gap: 60,
    },
    number: {
      fontSize: 32,
    }
})

export default Page;
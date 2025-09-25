import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
    Alert,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

// Import the logo - adjust path as needed
const sejaLogo = require('../assets/images/sejas-logo.png');

const RED_COLOR = '#D13635';
const GREY_COLOR = '#888888';

const OTPVerificationScreen: React.FC = () => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = useRef<TextInput[]>([]);
  const router = useRouter();

  const handleOtpChange = (value: string, index: number) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 3) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    // Handle backspace to go to previous input
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    Alert.alert('OTP Resent', 'A new verification code has been sent to your email or mobile number.');
  };

  const handleSubmit = () => {
    const otpValue = otp.join('');
    if (otpValue.length === 4) {
      // Navigate to success page after OTP verification
      router.push('/auth/success');
    } else {
      Alert.alert('Incomplete OTP', 'Please enter all 4 digits.');
    }
  };

  const isOtpComplete = otp.every(digit => digit !== '');

  return (
    <View style={styles.container}>
      {/* Logo Section */}
      <View style={styles.logoSection}>
        <Image source={sejaLogo} style={styles.logo} resizeMode="contain" />
      </View>

      {/* Instruction Text */}
      <View style={styles.instructionSection}>
        <Text style={styles.instructionText}>
          Verification code is sent to your Email or Mobile number
        </Text>
      </View>

      {/* OTP Input Boxes */}
      <View style={styles.otpSection}>
        <View style={styles.otpInputContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                if (ref) inputRefs.current[index] = ref;
              }}
              style={[
                styles.otpInput,
                digit !== '' && styles.otpInputFilled
              ]}
              value={digit}
              onChangeText={(value) => handleOtpChange(value, index)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
              keyboardType="numeric"
              maxLength={1}
              textAlign="center"
            />
          ))}
        </View>

        {/* Resend Option */}
        <View style={styles.resendSection}>
          <TouchableOpacity onPress={handleResend}>
            <Text style={styles.resendText}>Resend</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Submit Button */}
      <View style={styles.submitSection}>
        <TouchableOpacity 
          style={[
            styles.submitButton,
            isOtpComplete && styles.submitButtonActive
          ]} 
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },

  logoSection: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },

  logo: {
    width: 280,
    height: 140,
  },

  instructionSection: {
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },

  instructionText: {
    fontSize: 20,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
    lineHeight: 28,
  },

  otpSection: {
    alignItems: 'center',
    marginBottom: 50,
  },

  otpInputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },

  otpInput: {
    width: 65,
    height: 65,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 12,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 10,
    backgroundColor: 'white',
    textAlign: 'center',
    textAlignVertical: 'center',
  },

  otpInputFilled: {
    backgroundColor: RED_COLOR,
    borderColor: RED_COLOR,
    color: 'white',
  },

  resendSection: {
    alignSelf: 'flex-end',
    paddingRight: 20,
  },

  resendText: {
    fontSize: 16,
    color: RED_COLOR,
    textDecorationLine: 'underline',
    fontWeight: '500',
  },

  submitSection: {
    alignItems: 'center',
    marginTop: 'auto',
    paddingBottom: 40,
  },

  submitButton: {
    backgroundColor: GREY_COLOR,
    paddingVertical: 18,
    paddingHorizontal: 80,
    borderRadius: 30,
    width: '85%',
    alignItems: 'center',
  },

  submitButtonActive: {
    backgroundColor: RED_COLOR,
  },

  submitButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default OTPVerificationScreen;
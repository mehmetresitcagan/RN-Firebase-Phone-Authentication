/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native';

const InputOTPScreen = ({navigation, route}) => {
  let textInput = useRef(null);
  let clockCall = null;
  const lengthInput = 6;
  const defaultCountdown = 60;
  const [internalVal, setInternalVal] = useState('');
  const [countdown, setCountdown] = useState(defaultCountdown);
  const [enableResend, setEnableResend] = useState(false);
  const {confirm} = route.params;

  async function verifyOTP() {
    if (countdown !== 0) {
      try {
        let data = await confirm.confirm(internalVal);
        console.log('data', data);
        navigation.navigate('Success');
      } catch (error) {
        navigation.navigate('Unsuccess');
      }
    } else {
      navigation.navigate('Unsuccess');
    }
  }

  useEffect(() => {
    clockCall = setInterval(() => {
      decrementClock();
    }, 1000);
    return () => {
      clearInterval(clockCall);
    };
  });

  const decrementClock = () => {
    if (countdown === 0) {
      setEnableResend(true);
      setCountdown(0);
      clearInterval(clockCall);
    } else {
      setCountdown(countdown - 1);
    }
  };

  const onChangeText = val => {
    setInternalVal(val);
  };

  const onResendOTP = () => {
    if (enableResend) {
      setCountdown(defaultCountdown);
      setEnableResend(false);
      clearInterval(clockCall);
      clockCall = setInterval(() => {
        decrementClock();
      }, 1000);
    }
  };

  useEffect(() => {
    textInput.focus();
  }, []);

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        keyboardVerticalOffset={50}
        behavior={'padding'}
        style={styles.container_avoiding_view}>
        <Text style={styles.text_title}>
          SMS olarak gönderilen kodu giriniz
        </Text>
        <View>
          <TextInput
            ref={input => (textInput = input)}
            onChangeText={onChangeText}
            style={{width: 0, height: 0}}
            value={internalVal}
            maxLength={lengthInput}
            returnKeyType="done"
            keyboardType="numeric"
          />
          <View style={styles.container_input}>
            {Array(lengthInput)
              .fill()
              .map((data, index) => (
                <View
                  key={index}
                  style={[
                    styles.cell_view,
                    {
                      borderBottomColor:
                        index === internalVal.length ? '#FB6C6A' : '#234DB7',
                    },
                  ]}>
                  <Text
                    style={styles.cell_text}
                    onPress={() => textInput.focus()}>
                    {internalVal && internalVal.length > 0
                      ? internalVal[index]
                      : ''}
                  </Text>
                </View>
              ))}
          </View>
        </View>
        <View style={styles.bottom_view}>
          <TouchableOpacity onPress={verifyOTP}>
            <View style={styles.btn_change_number}>
              <Text style={styles.text_change}>Kodu Onayla</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={onResendOTP}>
            <View style={styles.btn_resend}>
              <Text
                style={[
                  styles.text_resend,
                  {
                    color: enableResend ? '#234DB7' : 'gray',
                  },
                ]}>
                Kodu Tekrar Gönder ({countdown})
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container_avoiding_view: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  container: {
    flex: 1,
  },
  text_title: {
    marginTop: 50,
    marginBottom: 50,
    fontSize: 16,
  },
  container_input: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cell_view: {
    paddingVertical: 11,
    width: 40,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1.5,
  },
  cell_text: {
    textAlign: 'center',
    fontSize: 16,
  },
  bottom_view: {
    flex: 1,
    flexDirection: 'row',
    //justifyContent: 'flex-end',
    marginBottom: 50,
    alignItems: 'flex-end',
  },
  btn_change_number: {
    width: 150,
    height: 50,
    borderRadius: 10,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  text_change: {
    color: '#234DB7',
    alignItems: 'center',
    fontSize: 15,
  },
  btn_resend: {
    width: 150,
    height: 50,
    borderRadius: 10,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  text_resend: {
    alignItems: 'center',
    fontSize: 15,
  },
});
export default InputOTPScreen;

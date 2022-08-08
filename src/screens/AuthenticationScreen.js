/* eslint-disable react-native/no-inline-styles */
import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Modal,
  SafeAreaView,
  FlatList,
  TouchableWithoutFeedback,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {Countries} from '../countries/Countries';
import auth from '@react-native-firebase/auth';

const AuthenticationScreen = ({navigation}) => {
  let textInput = useRef(null);
  const defaultCodeCountry = '+90';
  const defaultMaskCountry = '(999) 999 9999';
  const [phoneNumber, setPhoneNumber] = useState();
  const [focusInput, setFocusInput] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [dataCountries, setDataCountries] = useState(Countries);
  const [codeCountry, setCodeCountry] = useState(defaultCodeCountry);
  const [placeHolder, setPlaceHolder] = useState(defaultMaskCountry);

  const onShowHideModal = () => {
    setModalVisible(!modalVisible);
  };

  const onChangePhone = number => {
    setPhoneNumber(number);
  };

  const verifyPhoneNumber = async () => {
    const number = codeCountry + phoneNumber;
    const confirmation = await auth().signInWithPhoneNumber(number);
    if (confirmation) {
      navigation.navigate('InputOTP', {confirm: confirmation});
    }
  };

  const onPressContinue = () => {
    verifyPhoneNumber();
  };

  const onChangeFocus = () => {
    setFocusInput(true);
  };

  const onChangeBlur = () => {
    setFocusInput(false);
  };

  useEffect(() => {
    textInput.focus();
  }, []);

  const filterCountries = value => {
    if (value) {
      const countryData = dataCountries.filter(
        obj => obj.tr.indexOf(value) > -1 || obj.dialCode.indexOf(value) > -1,
      );
      setDataCountries(countryData);
    } else {
      setDataCountries(Countries);
    }
  };

  const onCountryChange = item => {
    setCodeCountry(item.dialCode);
    setPlaceHolder(item.mask);
    onShowHideModal();
  };

  let renderModal = () => {
    return (
      <Modal animationType="slide" transparent={false} visible={modalVisible}>
        <SafeAreaView style={{flex: 1}}>
          <View style={styles.modal_container}>
            <View style={styles.filter_input_container}>
              <TextInput
                autoFocus={true}
                onChangeText={filterCountries}
                placeholder={'Ülke ismi...'}
                focusable={true}
                style={styles.filter_input_style}
              />
            </View>
            <FlatList
              style={{flex: 1}}
              data={dataCountries}
              extraData={dataCountries}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item}) => (
                <TouchableWithoutFeedback onPress={() => onCountryChange(item)}>
                  <View style={styles.country_modal_style}>
                    <View style={styles.modal_item_container}>
                      <Text style={styles.modal_item_name}>{item.tr}</Text>
                      <Text style={styles.modal_item_dial_code}>
                        {item.dialCode}
                      </Text>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              )}
            />
          </View>
          <TouchableOpacity
            onPress={onShowHideModal}
            style={styles.close_button_style}>
            <Text style={styles.close_text_style}>Kapat</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        keyboardVerticalOffset={50}
        behavior={'padding'}
        style={styles.container_avoiding_view}>
        <Text style={styles.text_title}>Lütfen telefon numaranızı girin</Text>
        <View
          style={[
            styles.container_input,
            {
              borderBottomColor: focusInput ? '#244DB7' : '#ffffff',
            },
          ]}>
          <TouchableOpacity onPress={onShowHideModal}>
            <View style={styles.open_dialogue_view}>
              <Text>{codeCountry + ' |'}</Text>
            </View>
          </TouchableOpacity>
          {renderModal()}
          <TextInput
            ref={input => (textInput = input)}
            style={styles.phone_input_style}
            placeholder={placeHolder}
            keyboardType="numeric"
            value={phoneNumber}
            onChangeText={onChangePhone}
            secureTextEntry={false}
            onFocus={onChangeFocus}
            onBlur={onChangeBlur}
            autoFocus={focusInput}
          />
        </View>
        <View style={styles.view_bottom}>
          <TouchableOpacity onPress={onPressContinue}>
            <View
              style={[
                styles.btn_continue,
                {
                  backgroundColor: phoneNumber ? '#244DB7' : 'gray',
                },
              ]}>
              <Text style={styles.text_continue}>Devam</Text>
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
    marginBottom: 50,
    marginTop: 50,
    fontSize: 16,
  },
  container_input: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: 'white',
    alignItems: 'center',
    borderBottomWidth: 1.5,
  },
  open_dialogue_view: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phone_input_style: {
    marginLeft: 5,
    flex: 1,
    height: 50,
  },
  view_bottom: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 50,
    alignItems: 'center',
  },
  btn_continue: {
    width: 150,
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text_continue: {
    color: '#ffffff',
    alignItems: 'center',
  },
  modal_container: {
    paddingTop: 15,
    paddingLeft: 25,
    paddingRight: 25,
    flex: 1,
    backgroundColor: 'white',
  },
  filter_input_style: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#ffffff',
    color: '#424242',
  },
  country_modal_style: {
    flex: 1,
    borderColor: 'black',
    borderTopWidth: 1,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modal_item_container: {
    flex: 1,
    paddingLeft: 5,
    flexDirection: 'row',
  },
  modal_item_name: {
    flex: 1,
    fontSize: 16,
  },
  modal_item_dial_code: {
    fontSize: 16,
  },
  filter_input_container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  close_button_style: {
    padding: 12,
    alignItems: 'center',
  },
  close_text_style: {
    padding: 5,
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
  },
});
export default AuthenticationScreen;

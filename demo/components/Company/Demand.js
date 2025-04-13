import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Import Picker
import axios from 'axios';

const PostDemand = () => {
  const [scrapType, setScrapType] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [quantityKg, setQuantityKg] = useState('');

  const handleSubmit = async () => {
    try {
      console.log({ scrapType, companyName, quantityKg });  
      await axios.post('http://10.10.49.163:5002/demand', { scrapType, companyName, quantityKg });
      Alert.alert('Success', 'Demand Posted Successfully!');
      setScrapType('');
      setCompanyName('');
      setQuantityKg('');
    } catch (error) {
      console.error(error); 
      Alert.alert('Error', 'Failed to post demand');
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Scrap Type</Text>
      <Picker
        selectedValue={scrapType}
        onValueChange={(itemValue, itemIndex) => setScrapType(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select Scrap Type..." value="" />
        <Picker.Item label="Iron" value="Iron" />
        <Picker.Item label="Copper" value="Copper" />
        <Picker.Item label="Plastic" value="Plastic" />
        <Picker.Item label="Aluminium" value="Aluminium" />
        <Picker.Item label="Glass" value="Glass" />
        <Picker.Item label="Steel" value="Steel" /> 
        <Picker.Item label="Brass" value="Brass" />
        <Picker.Item label="Stainless Steel" value="Stainless Steel" />
        <Picker.Item label="Silver" value="Silver" />
        <Picker.Item label="Old Battery" value="Old Battery" />
        <Picker.Item label="Paper" value="Paper" />
        <Picker.Item label="Old Cloth Fabric" value="Old Cloth Fabric" />
        <Picker.Item label="E-waste" value="E-waste" />
      </Picker>

      <TextInput
        style={styles.input}
        placeholder="Company Name"
        value={companyName}
        onChangeText={setCompanyName}
      />
      <TextInput
        style={styles.input}
        placeholder="Quantity (Kg)"
        value={quantityKg}
        onChangeText={setQuantityKg}
        keyboardType="numeric"
      />
      <Button title="Post Demand" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20
  },
  label: {
    fontSize: 16,
    marginBottom: 5
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 15
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5
  }
});

export default PostDemand;
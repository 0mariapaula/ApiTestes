// DetalhesDoLocal.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DetalhesDoLocal = ({ local }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.name}>{local.name}</Text>
      <Text style={styles.address}>{local.formatted_address}</Text>
      <Text style={styles.rating}>Avaliação: {local.rating}</Text>
      {/* Adicione mais informações conforme necessário */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  address: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  rating: {
    fontSize: 14,
    color: '#888',
  },
});

export default DetalhesDoLocal;

import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';

const API_KEY = 'AIzaSyAACgV5Ok9n-HsESqMo9d8cRGAiHFlOEAY'; // Certifique-se de substituir pela sua própria chave API

const SearchScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPlaces = async () => {
    if (!searchQuery.trim()) {
      alert('Por favor, insira um termo de pesquisa.');
      return;
    }

    setLoading(true);
    try {
      let query = `${searchQuery}`;
      if (city) query += ` in ${city}`;
      if (state) query += `, ${state}`;
      
      console.log(`Iniciando pesquisa para: ${query}`);
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${API_KEY}`
      );
      console.log('Resposta da API:', response.data);
      if (response.data.status === 'OK') {
        setResults(response.data.results);
      } else {
        console.error('Erro na resposta da API:', response.data.status);
        alert(`Erro na pesquisa: ${response.data.status}`);
      }
    } catch (error) {
      console.error('Erro ao buscar locais:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResultPress = (item) => {
    console.log('Clicou no resultado:', item); // Adicionando console.log para debug
    navigation.navigate('DetalhesDoLocal', { local: item });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.resultItem} onPress={() => handleResultPress(item)}>
      <Text style={styles.resultName}>{item.name}</Text>
      <Text style={styles.resultAddress}>{item.formatted_address}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pesquisa de Locais</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite sua pesquisa..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <TextInput
        style={styles.input}
        placeholder="Digite a cidade..."
        value={city}
        onChangeText={setCity}
      />
      <TextInput
        style={styles.input}
        placeholder="Digite o estado..."
        value={state}
        onChangeText={setState}
      />
      <Button title="Pesquisar" onPress={fetchPlaces} />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.place_id}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  loadingIndicator: {
    marginTop: 20,
  },
  resultItem: {
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: 15,
    borderRadius: 8,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  resultName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  resultAddress: {
    fontSize: 16,
    color: '#666',
  },
});

export default SearchScreen;

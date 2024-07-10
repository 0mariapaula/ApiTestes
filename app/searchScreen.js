import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, Button, FlatList, ActivityIndicator, TouchableHighlight } from 'react-native';
import axios from 'axios';
import debounce from 'lodash.debounce';

const API_KEY = 'AIzaSyAACgV5Ok9n-HsESqMo9d8cRGAiHFlOEAY';

const SearchScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPlaces = useCallback(
    debounce(async (query, city, state) => {
      if (!query.trim()) return;

      setLoading(true);
      try {
        let searchQuery = `${query}`;
        if (city) searchQuery += ` in ${city}`;
        if (state) searchQuery += `, ${state}`;

        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${searchQuery}&key=${API_KEY}`
        );

        if (response.data.status === 'OK') {
          setResults(response.data.results);
        } else {
          alert(`Erro na pesquisa: ${response.data.status}`);
        }
      } catch (error) {
        console.error('Erro ao buscar locais:', error);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  const handleSearchChange = (text) => {
    setSearchQuery(text);
    fetchPlaces(text, city, state);
  };

  const handleResultPress = (item) => {
    console.log('Clicou no resultado:', item); // Adicionando console.log para debug
    navigation.navigate('DetalhesDoLocal', { local: item });
  };

  const renderItem = ({ item }) => (
    <TouchableHighlight 
      style={styles.resultItem}
      onPress={() => handleResultPress(item)}
      underlayColor="#DDDDDD"
    >
      <View>
        <Text style={styles.resultName}>{item.name}</Text>
        <Text style={styles.resultAddress}>{item.formatted_address}</Text>
      </View>
    </TouchableHighlight>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pesquisa de Locais</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite sua pesquisa..."
        value={searchQuery}
        onChangeText={handleSearchChange}
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
      <Button title="Pesquisar" onPress={() => fetchPlaces(searchQuery, city, state)} />
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

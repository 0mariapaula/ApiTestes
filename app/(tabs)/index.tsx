import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';

const API_KEY = 'AIzaSyAACgV5Ok9n-HsESqMo9d8cRGAiHFlOEAY'; // Substitua pela sua chave de API do Google Places

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

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
        response.data.results.forEach((item) => {
          console.log('Resultado:', JSON.stringify(item, null, 2));
        });
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tela de Pesquisa</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite sua pesquisa..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <TouchableOpacity style={styles.filterButton} onPress={() => setShowFilters(!showFilters)}>
        <Text style={styles.filterButtonText}>Mostrar Filtros</Text>
      </TouchableOpacity>
      {showFilters && (
        <>
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
        </>
      )}
      <Button title="Pesquisar" onPress={fetchPlaces} />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.place_id}
          renderItem={({ item }) => (
            <View style={styles.resultItem}>
              <Text style={styles.resultText}>{item.name}</Text>
              <Text style={styles.resultText}>{item.formatted_address}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 30,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  filterButton: {
    width: '100%',
    padding: 15,
    backgroundColor: '#007BFF',
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
  },
  filterButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  resultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  resultText: {
    fontSize: 18,
  },
});

export default SearchScreen;

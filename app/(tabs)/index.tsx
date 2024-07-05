import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';

const API_KEY = 'AIzaSyAACgV5Ok9n-HsESqMo9d8cRGAiHFlOEAY'; // Substitua pela sua chave de API do Google Places

const estados = [
  { label: 'Alagoas', value: 'AL' },
  { label: 'Bahia', value: 'BA' },
  { label: 'Alagoas', value: 'AL' },
  { label: 'Bahia', value: 'BA' },
  { label: 'Ceará', value: 'CE' },
  { label: 'Distrito Federal', value: 'DF' },
  { label: 'Espírito Santo', value: 'ES' },
  { label: 'Goiás', value: 'GO' },
  { label: 'Maranhão', value: 'MA' },
  { label: 'Mato Grosso', value: 'MT' },
  { label: 'Mato Grosso do Sul', value: 'MS' },
  { label: 'Minas Gerais', value: 'MG' },
  { label: 'Pará', value: 'PA' },
  { label: 'Paraíba', value: 'PB' },
  { label: 'Paraná', value: 'PR' },
  { label: 'Pernambuco', value: 'PE' },
  { label: 'Piauí', value: 'PI' },
  { label: 'Rio de Janeiro', value: 'RJ' },
  { label: 'Rio Grande do Norte', value: 'RN' },
  { label: 'Rio Grande do Sul', value: 'RS' },
  { label: 'Rondônia', value: 'RO' },
  { label: 'Roraima', value: 'RR' },
  { label: 'Santa Catarina', value: 'SC' },
  { label: 'São Paulo', value: 'SP' },
  { label: 'Sergipe', value: 'SE' },
  { label: 'Tocantins', value: 'TO' },
];

const municipiosPorEstado = {
  AL: ['Maceió', 'Arapiraca', 'Palmeira dos Índios'],
  BA: ['Salvador', 'Feira de Santana', 'Vitória da Conquista'],
  CE: ['Fortaleza', 'Caucaia', 'Juazeiro do Norte'],
  DF: ['Brasília'],
  ES: ['Vitória', 'Vila Velha', 'Serra'],
  GO: ['Goiânia', 'Anápolis', 'Aparecida de Goiânia'],
  MA: ['São Luís', 'Imperatriz', 'Caxias'],
  MT: ['Cuiabá', 'Várzea Grande', 'Rondonópolis'],
  MS: ['Campo Grande', 'Dourados', 'Três Lagoas'],
  MG: ['Belo Horizonte', 'Uberlândia', 'Contagem'],
  PA: ['Belém', 'Ananindeua', 'Santarém'],
  PB: ['João Pessoa', 'Campina Grande', 'Santa Rita'],
  PR: ['Curitiba', 'Londrina', 'Maringá'],
  PE: ['Recife', 'Jaboatão dos Guararapes', 'Olinda'],
  PI: ['Teresina', 'Parnaíba', 'Picos'],
  RJ: ['Rio de Janeiro', 'São Gonçalo', 'Duque de Caxias'],
  RN: ['Natal', 'Mossoró', 'Parnamirim'],
  RS: ['Porto Alegre', 'Caxias do Sul', 'Pelotas'],
  RO: ['Porto Velho', 'Ji-Paraná', 'Ariquemes'],
  RR: ['Boa Vista', 'Rorainópolis', 'Caracaraí'],
  SC: ['Florianópolis', 'Joinville', 'Blumenau'],
  SP: ['São Paulo', 'Campinas', 'Santos'],
  SE: ['Aracaju', 'Nossa Senhora do Socorro', 'Lagarto'],
  TO: ['Palmas', 'Araguaína', 'Gurupi'],
};

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [estado, setEstado] = useState('');
  const [municipio, setMunicipio] = useState('');
  const [municipios, setMunicipios] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const handleEstadoChange = (value) => {
    setEstado(value);
    setMunicipios(municipiosPorEstado[value] || []);
    setMunicipio(''); // Reseta o município selecionado
  };

  const fetchPlaces = async () => {
    if (!searchQuery.trim()) {
      alert('Por favor, insira um termo de pesquisa.');
      return;
    }

    setLoading(true);
    try {
      let query = `${searchQuery}`;
      if (municipio) query += ` in ${municipio}`;
      if (estado) query += `, ${estado}`;
      
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
          <Picker
            selectedValue={estado}
            style={styles.picker}
            onValueChange={(itemValue) => handleEstadoChange(itemValue)}
          >
            <Picker.Item label="Selecione um estado" value="" />
            {estados.map((estado) => (
              <Picker.Item key={estado.value} label={estado.label} value={estado.value} />
            ))}
          </Picker>
          <Picker
            selectedValue={municipio}
            style={styles.picker}
            onValueChange={(itemValue) => setMunicipio(itemValue)}
          >
            <Picker.Item label="Selecione um município" value="" />
            {municipios.map((municipio) => (
              <Picker.Item key={municipio} label={municipio} value={municipio} />
            ))}
          </Picker>
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
  picker: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 8,
    marginBottom: 15,
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

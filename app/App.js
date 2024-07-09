import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SearchScreen from './searchScreen';
import DetalhesDoLocal from './DetalhesDoLocal';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SearchScreen">
        <Stack.Screen name="SearchScreen" component={SearchScreen} options={{ title: 'Pesquisa' }} />
        <Stack.Screen name="DetalhesDoLocal" component={DetalhesDoLocal} options={{ title: 'Detalhes do Local' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

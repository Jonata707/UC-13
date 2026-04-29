import { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';

const coresPorTipo = {
  fire: '#F08030',
  water: '#6890F0',
  grass: '#78C850',
  electric: '#F8D030',
  psychic: '#F85888',
  ice: '#98D8D8',
  dragon: '#7038F8',
  dark: '#705848',
  fairy: '#EE99AC',
  normal: '#A8A878',
  fighting: '#C03028',
  flying: '#A890F0',
  poison: '#A040A0',
  ground: '#E0C068',
  rock: '#B8A038',
  bug: '#A8B820',
  ghost: '#705898',
  steel: '#B8B8D0',
};

export default function PokemonDetailsScreen() {
  const route = useRoute();
  const navigation = useNavigation();

  const { pokemon } = route.params;

  const [detalhes, setDetalhes] = useState(null);

  const [loading, setLoading] = useState(true);
  

  //Chama as informações adicionais
  useEffect(() => {
    buscarDetalhes();
  }, []);

  async function buscarDetalhes() {
    try {
      // 1️⃣ Dados principais
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon.nome}`);
      
      // 2️⃣ Dados da espécie (geração + descrição)
      const especie = await axios.get(response.data.species.url);

      // descrição em português (se tiver)
      const descricao = especie.data.flavor_text_entries.find(
        item => item.language.name === 'pt' || item.language.name === 'en'
      );
    //Puxa os dados adicionais: Peso , Geração, Descrição
      setDetalhes({
        peso: response.data.weight,
        geracao: especie.data.generation.name,
        descricao: descricao?.flavor_text
      });

    } catch (error) {
      console.log(error);
    } 
    //Carrega os dados
    finally {
      setLoading(false);
    }
  }
  
  //Se der certo, irá carregar em um container com as informações dentro do const Detalhes
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#38bdf8" />
      </View>
    );
  }
const tipoPrincipal = pokemon.tipos[0];
const corFundo = coresPorTipo[tipoPrincipal] || '#0f172a';
  return (
    <View style={styles.container}>
     <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.voltar}>← Voltar</Text>
      </TouchableOpacity>

     <View style={[styles.containerTwo, { backgroundColor: corFundo }]}>
      

      <Text style={styles.nome}>{pokemon.nome}</Text>

      <Image
        source={{ uri: pokemon.imagem }}
        style={styles.imagem}
      />

      <Text style={styles.info}>
        Tipos: {pokemon.tipos.join(', ')}
      </Text>

      <Text style={styles.info}>
        Peso: {detalhes.peso / 10} kg
      </Text>

      <Text style={styles.info}>
        Geração: {detalhes.geracao}
      </Text>

      <Text style={styles.descricao}>
        {detalhes.descricao}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 20,
  },

  voltar: {
    color: '#38bdf8',
    marginBottom: 10,
  },

  nome: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    textTransform: 'capitalize',
    textAlign: 'center',
  },

  imagem: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginVertical: 20,
  },

  info: {
    color: 'black',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 5,
  },

  descricao: {
    color: 'black',
    marginTop: 20,
    textAlign: 'center',
  },
  containerTwo:{
    width: 500,
    marginLeft: 440,
    padding: 20,
    borderRadius: 20
  }
});
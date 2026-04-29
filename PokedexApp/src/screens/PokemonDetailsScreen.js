import { useEffect, useState } from 'react';
import { 
  View, Text, Image, StyleSheet, 
  TouchableOpacity, ActivityIndicator 
} from 'react-native';
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

  const { pokemon } = route.params || {};

  const [detalhes, setDetalhes] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (pokemon) {
      buscarDetalhes();
    }
  }, []);

  async function buscarDetalhes() {
    try {
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${pokemon.nome}`
      );

      const especie = await axios.get(response.data.species.url);

      const descricao = especie.data.flavor_text_entries.find(
        item => item.language.name === 'pt' || item.language.name === 'en'
      );

      setDetalhes({
        peso: response.data.weight,
        geracao: especie.data.generation.name,
        descricao: descricao?.flavor_text?.replace(/\n|\f/g, ' ')
      });

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  // 🔒 segurança contra erro
  if (!pokemon) {
    return (
      <View style={styles.container}>
        <Text style={{ color: '#fff' }}>Erro ao carregar Pokémon</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#38bdf8" />
      </View>
    );
  }

  // 🎨 cor dinâmica pelo tipo
  const tipoPrincipal = pokemon.tipos?.[0];
  const corFundo = coresPorTipo[tipoPrincipal] || '#1e293b';

  return (
    <View style={styles.container}>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.voltar}>← Voltar</Text>
      </TouchableOpacity>

      <View style={[styles.card, { backgroundColor: corFundo }]}>

        <Text style={styles.nome}>{pokemon.nome}</Text>

        <Image
          source={{ uri: pokemon.imagem }}
          style={styles.imagem}
        />

        <Text style={styles.info}>
          Tipos: {pokemon.tipos.join(', ')}
        </Text>

        <Text style={styles.info}>
          ⚖️ Peso: {detalhes.peso / 10} kg
        </Text>

        <Text style={styles.info}>
          🌎 Geração: {detalhes.geracao}
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
    fontSize: 16,
  },

  card: {
    flex: 1,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  nome: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    textTransform: 'capitalize',
    marginBottom: 10,
  },

  imagem: {
    width: 180,
    height: 180,
    marginVertical: 15,
  },

  info: {
    color: '#000',
    fontSize: 16,
    marginTop: 5,
    textAlign: 'center',
  },

  descricao: {
    color: '#000',
    marginTop: 15,
    textAlign: 'center',
    fontSize: 14,
  },
});
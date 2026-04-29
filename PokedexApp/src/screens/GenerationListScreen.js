import { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image
} from 'react-native';
import axios from 'axios';
import { useRoute, useNavigation } from '@react-navigation/native';

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

export default function GenerationListScreen() {
  const route = useRoute();
  const navigation = useNavigation();

  const { generation, nome } = route.params;

  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    buscar();
  }, []);

  async function buscar() {
    try {
      const res = await axios.get(
        `https://pokeapi.co/api/v2/generation/${generation}`
      );

      const lista = res.data.pokemon_species;

      // 🔥 buscar tipo de cada Pokémon
      const detalhados = await Promise.all(
        lista.slice(0, 30).map(async (item) => {
          try {
            const poke = await axios.get(
              `https://pokeapi.co/api/v2/pokemon/${item.name}`
            );

            return {
              nome: item.name,
              imagem: poke.data.sprites.front_default,
              tipos: poke.data.types.map(t => t.type.name)
            };
          } catch {
            return {
              nome: item.name,
              imagem: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getPokemonId(item.url)}.png`,
              tipos: ['normal']
            };
          }
        })
      );

      setPokemons(detalhados);

    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }

  function getPokemonId(url) {
    const partes = url.split('/');
    return partes[partes.length - 2];
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#38bdf8" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📍 {nome}</Text>

      <FlatList
        data={pokemons}
        keyExtractor={(item) => item.nome}
        renderItem={({ item }) => {

          const tipoPrincipal = item.tipos?.[0];
          const corFundo = coresPorTipo[tipoPrincipal] || '#1e293b';

          return (
            <TouchableOpacity
              style={[styles.card, { backgroundColor: corFundo }]}
              onPress={() =>
                navigation.navigate('PokemonDetails', {
                  pokemon: item
                })
              }
            >
              <Image
                source={{ uri: item.imagem }}
                style={styles.imagem}
              />

              <View>
                <Text style={styles.nome}>{item.nome}</Text>

                <Text style={styles.tipo}>
                  {item.tipos.join(', ')}
                </Text>
              </View>

            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 20,
  },

  title: {
    color: '#fff',
    fontSize: 22,
    marginBottom: 15,
  },

  card: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  imagem: {
    width: 60,
    height: 60,
    marginRight: 15,
  },

  nome: {
    color: '#fff',
    textTransform: 'capitalize',
    fontSize: 16,
    fontWeight: 'bold'
  },

  tipo: {
    color: '#000',
    textTransform: 'capitalize',
    fontSize: 12,
  },
});
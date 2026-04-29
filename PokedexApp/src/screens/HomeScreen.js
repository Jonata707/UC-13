import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Alert,
  Image,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import axios from 'axios';
import { useAuth, useUser } from '@clerk/clerk-expo';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

export default function HomeScreen({ navigation }) {
  const { signOut } = useAuth();
  const { user } = useUser();

  const [pokemon, setPokemon] = useState("");
  const [info, setInfo] = useState(null);
  const [favoritos, setFavoritos] = useState([]);

  useEffect(() => {
    carregarFavoritos();
  }, []);

  useEffect(() => {
    salvarFavoritos();
  }, [favoritos]);

  async function carregarFavoritos() {
    if (!user) return;
    const data = await AsyncStorage.getItem(`favoritos_${user?.id}`);
    if (data) setFavoritos(JSON.parse(data));
  }

  async function salvarFavoritos() {
    await AsyncStorage.setItem(
      `favoritos_${user?.id}`,
      JSON.stringify(favoritos)
    );
  }

  function toggleFavorito(pokemon) {
    const jaExiste = favoritos.find(p => p.nome === pokemon.nome);

    if (jaExiste) {
      setFavoritos(favoritos.filter(p => p.nome !== pokemon.nome));
    } else {
      setFavoritos([...favoritos, pokemon]);
    }
  }

  function ehFavorito(nome) {
    return favoritos.some(p => p.nome === nome);
  }

  async function buscarPokemon() {
    try {
      const resposta = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${pokemon.toLowerCase()}`
      );

      const dados = resposta.data;

      setInfo({
        nome: dados.name,
        imagem: dados.sprites.front_default,
        tipos: dados.types.map(t => t.type.name)
      });

    } catch (error) {
      Alert.alert("Erro", "Pokémon não encontrado!");
      setInfo(null);
    }
  }

  const tipoPrincipal = info?.tipos?.[0];
  const corFundo = coresPorTipo[tipoPrincipal] || '#0f172a';

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.titulo}>Pokédex 🔥</Text>

          <TouchableOpacity style={styles.logout} onPress={signOut}>
            <Text style={styles.logoutText}>Sair</Text>
          </TouchableOpacity>
        </View>

        {/* FAVORITOS */}
        <TouchableOpacity
          style={styles.favButton}
          onPress={() => navigation.navigate('Favorites')}
        >
          <Text style={styles.favText}>⭐ Ver Favoritos</Text>
        </TouchableOpacity>

        {/* INPUT */}
        <TextInput 
          style={styles.input}
          placeholder='Digite o nome do Pokémon'
          placeholderTextColor="#888"
          value={pokemon}
          onChangeText={setPokemon}
        />

        {/* BOTÃO */}
        <TouchableOpacity style={styles.botao} onPress={buscarPokemon}>
          <Text style={styles.botaoTexto}>Buscar</Text>
        </TouchableOpacity>

        {/* RESULTADO */}
        {info && (
          <View style={[styles.card, { borderColor: corFundo }]}>
            
            <TouchableOpacity
              style={styles.favorito}
              onPress={() => toggleFavorito(info)}
            >
              <Text style={styles.favoritoIcon}>
                {ehFavorito(info.nome) ? "⭐" : "☆"}
              </Text>
            </TouchableOpacity>

            <Text style={styles.nome}>{info.nome}</Text>

            <Image 
              source={{ uri: info.imagem }} 
              style={styles.imagem}
            />

            <View style={styles.containerTwo}>
              {info.tipos.map((tipo, index) => (
                <View
                  key={index}
                  style={[
                    styles.tipoBox,
                    { backgroundColor: coresPorTipo[tipo] || '#333' }
                  ]}
                >
                  <Text style={styles.tipoTexto}>
                    {tipo}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <StatusBar style="light" />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 20,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  titulo: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
  },

  logout: {
    backgroundColor: '#ef4444',
    padding: 10,
    borderRadius: 10,
  },

  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  favButton: {
    backgroundColor: '#facc15',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },

  favText: {
    fontWeight: 'bold',
  },

  input: {
    backgroundColor: '#1e293b',
    color: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },

  botao: {
    backgroundColor: '#3b82f6',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },

  botaoTexto: {
    color: '#fff',
    fontWeight: 'bold',
  },

  card: {
    marginTop: 20,
    backgroundColor: '#1e293b',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    position: 'relative',
    borderWidth: 2,
  },

  favorito: {
    position: 'absolute',
    top: 10,
    right: 10,
  },

  favoritoIcon: {
    fontSize: 28,
  },

  nome: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },

  imagem: {
    width: 150,
    height: 150,
    marginVertical: 10,
  },

  containerTwo: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },

  tipoBox: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
  },

  tipoTexto: {
    color: '#fff',
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
});
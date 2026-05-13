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
  TouchableOpacity,
  LayoutAnimation,
  UIManager,
  Platform
} from 'react-native';

import axios from 'axios';
import { useAuth, useUser } from '@clerk/clerk-expo';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 🔥 HABILITA ANIMAÇÃO NO ANDROID
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

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

  // 🌙 DARK MODE
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    carregarFavoritos();
  }, []);

  useEffect(() => {
    salvarFavoritos();
  }, [favoritos]);

  async function carregarFavoritos() {

    if (!user) return;

    const data = await AsyncStorage.getItem(
      `favoritos_${user?.id}`
    );

    if (data) {
      setFavoritos(JSON.parse(data));
    }
  }

  async function salvarFavoritos() {

    await AsyncStorage.setItem(
      `favoritos_${user?.id}`,
      JSON.stringify(favoritos)
    );
  }

  function toggleFavorito(pokemon) {

    const jaExiste = favoritos.find(
      p => p.nome === pokemon.nome
    );

    if (jaExiste) {

      setFavoritos(
        favoritos.filter(
          p => p.nome !== pokemon.nome
        )
      );

    } else {

      setFavoritos([
        ...favoritos,
        pokemon
      ]);
    }
  }

  function ehFavorito(nome) {

    return favoritos.some(
      p => p.nome === nome
    );
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
        tipos: dados.types.map(
          t => t.type.name
        )
      });

    } catch (error) {

      Alert.alert(
        "Erro",
        "Pokémon não encontrado!"
      );

      setInfo(null);
    }
  }

  // 🎨 COR DO TIPO
  const tipoPrincipal = info?.tipos?.[0];

  const corFundoPokemon =
    coresPorTipo[tipoPrincipal] || '#0f172a';

  // 🎨 TEMA
  const tema = {

    fundo: darkMode
      ? '#0f172a'
      : '#f1f5f9',

    card: darkMode
      ? '#1e293b'
      : '#ffffff',

    texto: darkMode
      ? '#ffffff'
      : '#000000',

    input: darkMode
      ? '#1e293b'
      : '#e2e8f0',

    placeholder: darkMode
      ? '#888'
      : '#555',
  };

  return (

    <View
      style={[
        styles.container,
        {
          backgroundColor: tema.fundo
        }
      ]}
    >

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          alignItems: 'center',
          width: '100%'
        }}
      >

        {/* HEADER */}
        <View style={styles.header}>

          <Text
            style={[
              styles.titulo,
              { color: tema.texto }
            ]}
          >
            Pokédex 🔥
          </Text>

          <TouchableOpacity
            style={styles.logout}
            onPress={signOut}
          >
            <Text style={styles.logoutText}>
              Sair
            </Text>
          </TouchableOpacity>

        </View>

        {/* INPUT */}
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: tema.input,
              color: tema.texto
            }
          ]}
          placeholder='Digite o nome do Pokémon'
          placeholderTextColor={tema.placeholder}
          value={pokemon}
          onChangeText={setPokemon}
        />

        {/* 🔥 BOTÕES LADO A LADO */}
        <View style={styles.rowButtons}>

          {/* 🌙 TEMA */}
          <TouchableOpacity
            style={styles.temaButton}
            activeOpacity={0.7}

            onPress={() => {

              LayoutAnimation.easeInEaseOut();

              setDarkMode(!darkMode);
            }}
          >
            <Text style={styles.temaTexto}>
              {darkMode
                ? '☀️ Light'
                : '🌙 Dark'}
            </Text>
          </TouchableOpacity>

          {/* ⭐ FAVORITOS */}
          <TouchableOpacity
            style={styles.favButton}
            activeOpacity={0.7}

            onPress={() =>
              navigation.navigate('Favorites')
            }
          >
            <Text style={styles.favText}>
              ⭐ Favoritos
            </Text>
          </TouchableOpacity>

        </View>

        {/* 🔍 BUSCAR */}
        <TouchableOpacity
          style={styles.botao}
          onPress={buscarPokemon}
        >
          <Text style={styles.botaoTexto}>
            Buscar
          </Text>
        </TouchableOpacity>

        {/* CARD DO POKÉMON */}
        {info && (

          <View
            style={[
              styles.card,
              {
                borderColor: corFundoPokemon,
                backgroundColor: tema.card
              }
            ]}
          >

            {/* FAVORITAR */}
            <TouchableOpacity
              style={styles.favorito}

              onPress={() =>
                toggleFavorito(info)
              }
            >
              <Text style={styles.favoritoIcon}>
                {ehFavorito(info.nome)
                  ? "⭐"
                  : "☆"}
              </Text>
            </TouchableOpacity>

            {/* NOME */}
            <Text
              style={[
                styles.nome,
                { color: tema.texto }
              ]}
            >
              {info.nome}
            </Text>

            {/* IMAGEM */}
            <Image
              source={{ uri: info.imagem }}
              style={styles.imagem}
            />

            {/* TIPOS */}
            <View style={styles.containerTwo}>

              {info.tipos.map((tipo, index) => (

                <View
                  key={index}

                  style={[
                    styles.tipoBox,
                    {
                      backgroundColor:
                        coresPorTipo[tipo] || '#333'
                    }
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

        {/* 🌎 GERAÇÕES */}
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(
              'Region',
              { generation: 1 }
            )
          }

          style={styles.Ger}
        >
          <Text style={styles.textoGer}>
            Ver Gerações
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate(
              'Quiz',
              { generation: 1 }
            )
          }

          style={styles.Ger}
        >
          <Text style={styles.textoGer}>
            Quiz
          </Text>
        </TouchableOpacity>

        <StatusBar
          style={darkMode ? "light" : "dark"}
        />

      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },

  titulo: {
    fontSize: 28,
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

  input: {
    padding: 18,
    borderRadius: 12,
    marginBottom: 15,
    width: '100%',
  },

  // 🔥 LINHA DOS BOTÕES
  rowButtons: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 15,
  },

  // 🌙 BOTÃO TEMA
  temaButton: {
    flex: 1,
    backgroundColor: '#6366f1',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 5,
  },

  temaTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },

  // ⭐ FAVORITOS
  favButton: {
    flex: 1,
    backgroundColor: '#facc15',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 5,
  },

  favText: {
    fontWeight: 'bold',
    fontSize: 15,
  },

  botao: {
    backgroundColor: '#3b82f6',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },

  botaoTexto: {
    color: '#fff',
    fontWeight: 'bold',
  },

  card: {
    marginTop: 20,
    padding: 25,
    borderRadius: 20,
    alignItems: 'center',
    position: 'relative',
    borderWidth: 2,
    width: '100%',
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
    flexWrap: 'wrap',
    justifyContent: 'center',
  },

  tipoBox: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },

  tipoTexto: {
    color: '#fff',
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },

  Ger: {
    backgroundColor: '#3b82f6',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },

  textoGer: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
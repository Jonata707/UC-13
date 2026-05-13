import { useEffect, useState } from 'react';
import {
  View,
  Text,
 FlatList,
  Image,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from '@clerk/clerk-expo';
import { useNavigation } from '@react-navigation/native';

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

export default function FavoritesScreen() {

  const { user } = useUser();
  const navigation = useNavigation();

  const [favoritos, setFavoritos] = useState([]);

  // 🌙 DARK MODE
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    carregarFavoritos();
  }, []);

  async function carregarFavoritos() {
    if (!user) return;

    const data = await AsyncStorage.getItem(
      `favoritos_${user?.id}`
    );

    if (data) {
      setFavoritos(JSON.parse(data));
    }
  }

  // 🎨 TEMA DINÂMICO
  const tema = {
    fundo: darkMode ? '#0f172a' : '#f1f5f9',

    card: darkMode ? '#1e293b' : '#ffffff',

    texto: darkMode ? '#ffffff' : '#000000',

    subtitulo: darkMode ? '#cbd5e1' : '#334155',
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: tema.fundo }
      ]}
    >

      {/* 🔥 LINHA SUPERIOR */}
      <View style={styles.topBar}>

        {/* 🔙 VOLTAR */}
        <TouchableOpacity
          style={styles.botaoVoltar}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.textoVoltar}>
            ← Voltar
          </Text>
        </TouchableOpacity>

        {/* 🌙 DARK/LIGHT MODE */}
        <TouchableOpacity
          style={styles.temaButton}
          onPress={() => setDarkMode(!darkMode)}
        >
          <Text style={styles.temaTexto}>
            {darkMode
              ? '☀️'
              : '🌙'}
          </Text>
        </TouchableOpacity>

      </View>

      {/* ⭐ TÍTULO */}
      <Text
        style={[
          styles.title,
          { color: tema.texto }
        ]}
      >
        ⭐ Favoritos
      </Text>

      <FlatList
        data={favoritos}
        keyExtractor={(item) => item.nome}

        renderItem={({ item }) => {

          // 🎨 PEGA A COR DO TIPO
          const tipoPrincipal = item.tipos?.[0];

          const corCard =
            coresPorTipo[tipoPrincipal] || tema.card;

          return (
            <TouchableOpacity
              style={[
                styles.card,
                { backgroundColor: corCard }
              ]}

              onPress={() =>
                navigation.navigate(
                  'PokemonDetails',
                  { pokemon: item }
                )
              }
            >

              {/* 📛 NOME */}
              <Text style={styles.nome}>
                {item.nome}
              </Text>

              {/* 🖼️ IMAGEM */}
              <Image
                source={{ uri: item.imagem }}
                style={styles.imagem}
              />

              {/* 🧬 TIPOS */}
              <Text style={styles.tipo}>
                {item.tipos.join(', ')}
              </Text>

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
    padding: 20,
  },

  // 🔥 LINHA SUPERIOR
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },

  botaoVoltar: {
    padding: 10,
  },

  textoVoltar: {
    color: '#38bdf8',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // 🌙 BOTÃO TEMA
  temaButton: {
    backgroundColor: '#6366f1',
    width: 50,
    height: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },

  temaTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  card: {
    padding: 15,
    borderRadius: 20,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 5,
  },

  nome: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
    textTransform: 'capitalize',
  },

  imagem: {
    width: 110,
    height: 110,
    marginVertical: 10,
  },

  tipo: {
    color: '#fff',
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
});
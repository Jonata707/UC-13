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

export default function FavoritesScreen() {
  const { user } = useUser();
  const navigation = useNavigation();
  const [favoritos, setFavoritos] = useState([]);

  useEffect(() => {
    carregarFavoritos();
  }, []);

  async function carregarFavoritos() {
    if (!user) return;
    const data = await AsyncStorage.getItem(`favoritos_${user?.id}`);
    if (data) setFavoritos(JSON.parse(data));
  }

  return (
    <View style={styles.container}>

      {/* BOTÃO VOLTAR */}
      <TouchableOpacity
        style={styles.botaoVoltar}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.textoVoltar}>← Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.title}>⭐ Favoritos</Text>

      <FlatList
        data={favoritos}
        keyExtractor={(item) => item.nome}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate('PokemonDetails', { pokemon: item })
            }
          >
            <Text style={styles.nome}>{item.nome}</Text>

            <Image
              source={{ uri: item.imagem }}
              style={styles.imagem}
            />

            <Text style={styles.tipo}>
              {item.tipos.join(', ')}
            </Text>
          </TouchableOpacity>
        )}
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

  botaoVoltar: {
    marginBottom: 10,
  },

  textoVoltar: {
    color: '#38bdf8',
    fontSize: 16,
    fontWeight: 'bold',
  },

  title: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  card: {
    backgroundColor: '#1e293b',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    alignItems: 'center',
  },

  nome: {
    color: '#fff',
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },

  imagem: {
    width: 100,
    height: 100,
    marginVertical: 10,
  },

  tipo: {
    color: '#fff',
  },
});
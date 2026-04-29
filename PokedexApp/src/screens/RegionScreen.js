import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function RegionScreen() {
  const navigation = useNavigation();

  // Lista manual (simples e eficiente)
  const geracoes = [
    {
      id: 1,
      nome: 'Kanto',
      imagem: 'https://archives.bulbagarden.net/media/upload/2/21/Kanto.png'
    },
    {
      id: 2,
      nome: 'Johto',
      imagem: 'https://archives.bulbagarden.net/media/upload/0/0b/Johto.png'
    },
    {
      id: 3,
      nome: 'Hoenn',
      imagem: 'https://archives.bulbagarden.net/media/upload/6/66/Hoenn.png'
    },
    {
      id: 4,
      nome: 'Sinnoh',
      imagem: 'https://archives.bulbagarden.net/media/upload/f/fc/Sinnoh.png'
    },
    {
      id: 5,
      nome: 'Unova',
      imagem: 'https://archives.bulbagarden.net/media/upload/4/4a/Unova.png'
    },
    {
      id: 6,
      nome: 'Kalos',
      imagem: 'https://archives.bulbagarden.net/media/upload/8/8a/Kalos.png'
    },
    {
      id: 7,
      nome: 'Alola',
      imagem: 'https://archives.bulbagarden.net/media/upload/0/08/Alola.png'
    },
    {
      id: 8,
      nome: 'Galar',
      imagem: 'https://archives.bulbagarden.net/media/upload/1/1a/Galar.png'
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌎 Escolha uma Região</Text>

      <FlatList
        data={geracoes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate('GenerationList', {
                generation: item.id,
                nome: item.nome
              })
            }
          >
            <Image source={{ uri: item.imagem }} style={styles.imagem} />
            <Text style={styles.nome}>{item.nome}</Text>
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

  title: {
    color: '#fff',
    fontSize: 24,
    marginBottom: 15,
  },

  card: {
    backgroundColor: '#1e293b',
    borderRadius: 15,
    padding: 10,
    marginBottom: 15,
    alignItems: 'center',
  },

  imagem: {
    width: 200,
    height: 100,
    resizeMode: 'contain',
  },

  nome: {
    color: '#fff',
    marginTop: 10,
    fontSize: 18,
  },
});
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput, Alert, Image, ScrollView } from 'react-native';
import axios from 'axios';

export default function BuscaFilme() {

  const [filme, setFilme] = useState("");
  const [info, setInfo] = useState(null);

  async function buscarFilme() {
    try {
      const resposta = await axios.get(
        `http://www.omdbapi.com/?t=${filme}&plot=full&apikey=6922fd72`
      );

      const dados = resposta.data;

      if (dados === "False") {
        Alert.alert("Erro", "Filme não encontrado!");
        setInfo("");
      } else {
        setInfo(dados);
      }

    } catch (error) {
      Alert.alert("Erro", "Erro ao buscar filme");
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView>
      <Text style={styles.titulo}>Buscar Filme🎥</Text>

      <TextInput 
        style={styles.input}
        placeholder='Digite o nome do filme'
        value={filme}
        onChangeText={setFilme}
      />

      <Button title='Buscar' onPress={buscarFilme} />

      {info && (
        <View style={styles.resultado}>
          <Text style={styles.nome}>{info.Title}</Text>
          <Text style={styles.ano}>Ano: {info.Year}</Text>
          <Text style={styles.genero}>Gênero: {info.Genre}</Text>
          <Text style={styles.diretor}>Diretor: {info.Director}</Text>
          <Text style={styles.plot}>Plot: {info.Plot}</Text>

          {info.Poster !== "N/A" && (
            <Image 
              source={{ uri: info.Poster }} 
              style={styles.imagem}
            />
          )}
        </View>
      )}

      <StatusBar style="auto" />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input:{
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: 20,
    borderWidth:3
  },
  resultado: {
    marginTop: 20,
    alignItems: 'center',
  },
  nome: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  imagem: {
    width: 200,
    height: 300,
    marginTop: 10,
    borderRadius: 10,
  },
    ano:{
      fontWeight: 'bold',
    marginBottom: 10,

    },
      genero:{
        fontWeight: 'bold',
    marginBottom: 10,
      },
      diretor:{
        fontWeight: 'bold',
    marginBottom: 10,
      },
      plot:{
        fontWeight: 'bold',
    marginBottom: 10,
    margin: 10,
    backgroundColor: "#1E90FF",
    padding: 20,
    borderRadius: 20
      },

      

});
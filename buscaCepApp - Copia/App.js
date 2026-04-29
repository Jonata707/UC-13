import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';


export default function BuscaCep() {

  const [cep, setCep] = useState("");

  const [endereco, setEndereco] = useState("");

  async function buscarCep() {
    if(cep.length !== 8 || isNaN(cep)) {
      Alert.alert("Erro", "CEP inválido!");
      return;
    }

    try {
      const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`)

      const dados = await resposta.json();

      if(dados.erro) {
        Alert.alert("Erro", "CEP não encontrado!")
      } else {
        setEndereco(dados);
      }

    } catch (error) {
      Alert.alert("Erro", "Erro ao buscar cep")
    }
  }


  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Consulta CEP</Text>

      <TextInput 
        style={styles.input}
        placeholder='Digite o CEP'
        keyboardType='numeric'
        maxLength={8}
        value={cep}
        onChangeText={setCep}
      />

      <Button title='Buscar' onPress={buscarCep} style={styles.botao}/>

      {endereco && (
        <View>
          <Text>Rua: {endereco.logradouro}</Text>
          <Text>Bairro: {endereco.bairro}</Text>
          <Text>Cidade: {endereco.localidade}</Text>
          <Text>Estado: {endereco.uf}</Text>
        </View>
      )}

      <StatusBar style="auto" />
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
  },

  botao:{
    
  }


});

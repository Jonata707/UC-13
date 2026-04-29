import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';

export default function App() {

  const[palpite, setPalpite] = useState("");
  const[tentativas, setTentativas] = useState(0);
  const[numeroSecreto, setNumeroSecreo] = useState(0);
  const[mensagem, setMensagem] = useState("");
  useEffect(() => {
    gerarNumero();
  }, []);

  //Função que gera um número aletorio entre 1 a 100

  function gerarNumero (){
    const numero = Math.floor(Math.random() * 100) + 1;

    setNumeroSecreo(numero);
  };

  function verificarPalpite(){
    const numeroDigitado = parseInt(palpite);

    if(!numeroDigitado){
      Alert.alert("Erro", "Digite um número válido!");
      return;

    }

    setTentativas(tentativas + 1);

    if(numeroDigitado === numeroSecreto){
      setMensagem("Acertou!");
    } else if(numeroDigitado > numeroSecreto){
      setMensagem("Muito Alto!");
    }
    else {
      setMensagem("Muito Baixo!");
    }
  }

  function reiniciar(){
    gerarNumero();

    // Limpa o input
    setPalpite("");

    setMensagem("");

    setTentativas(0);
  }
  return (
    <View style={styles.container}>
      <Text style={styles.alvo}>🎯</Text>
      <Text style={styles.titulo}>Jogo de Adivinhação</Text>
      

      <Text style={styles.texto}>Tente adivinhar um número de 1 a 100</Text>
      <TextInput
      style={styles.input}
      placeholder='Digite seu palpite'
      keyboardType='numeric'
      value={palpite}
      onChangeText={setPalpite}/>

      <TouchableOpacity style={styles.botao}
      onPress={verificarPalpite}>
        <Text style={styles.textoBotao}>Tentar</Text>
      </TouchableOpacity>
      {mensagem !== "" && (
        <Text>{mensagem}</Text>
      )}

      <Text style={styles.tentativas}>
        Tentativas: {tentativas}
      </Text>

      <TouchableOpacity style={styles.botaoReset}
onPress={reiniciar}      >
        <Text style={styles.textoBotao}>Reiniciar</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#87CEFA',
    alignItems: 'center',
    justifyContent: 'center',
    padding:16,

  },
  titulo: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 0

  },
  texto:{
    fontSize: 16,
    marginBottom: 20,

  },
  input:{
    width: "80%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#fff",
    fontSize: 18,
    textAlign: "center"


  },
  botao: {
    backgroundColor: "#3498db",
    paddingVertical: 12,
    paddingHorizontal: 31,
    borderRadius: 8

  },
  alvo:{
    fontSize: 100
  },
  tentativas:{
    fontSize: 16,
    marginBottom:10,
    marginTop: 10
  },
  botaoReset: {
    backgroundColor: "red",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8

  },
  textoBotao:{
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff"

  }
});

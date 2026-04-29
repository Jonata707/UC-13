import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Alert, TouchableOpacity } from 'react-native';

export default function PrevisaoTempo() {

  const [cidade, setCidade] = useState("");
  const [info, setInfo] = useState(null);
  const [corFundo, setCorFundo] = useState('#4facfe');

  async function buscarPrevisao() {
      //Verifica se o nome da cidade está correto
    if (!cidade) {
      Alert.alert("Erro", "Digite uma cidade");
      return;
    }

    try {
      // 1️⃣ Buscar coordenadas da cidade
      const geoResp = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${cidade}&count=1&language=pt&format=json`
      );

      const geoData = await geoResp.json();
      //Verifica se as coordenadas estão corretas
      if (!geoData.results) {
        Alert.alert("Erro", "Cidade não encontrada");
        return;
      }

      const lat = geoData.results[0].latitude;
      const lon = geoData.results[0].longitude;
      const nomeCidade = geoData.results[0].name;

      // 2️⃣ Buscar clima
      const climaResp = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=rain_sum&timezone=auto`
      );

      const dados = await climaResp.json();

      const temperatura = dados.current_weather.temperature;
      const temperaturaAparente = temperatura;
      const chuvaHoje = dados.daily.rain_sum[0];

      // 🎨 mudar cor do fundo
      if (chuvaHoje > 5) {
        setCorFundo('#1e3a8a'); // chuva forte
      } else if (chuvaHoje > 0) {
        setCorFundo('#4facfe'); // chuva leve
      } else {
        setCorFundo('#ffa500'); // sol
      }

      setInfo({
        cidade: nomeCidade,
        temperatura,
        temperaturaAparente,
        chuva: chuvaHoje > 0 ? "Sim 🌧️" : "Não ☀️"
      });

    } catch (error) {
      Alert.alert("Erro", "Erro ao buscar previsão");
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: corFundo }]}>
      <Text style={styles.titulo}>Previsão do Tempo</Text>

      <TextInput 
        style={styles.input}
        placeholder='Digite a cidade'
        value={cidade}
        onChangeText={setCidade}
      />

      <TouchableOpacity style={styles.botao} onPress={buscarPrevisao}>
        <Text style={styles.textoBotao}>Buscar</Text>
      </TouchableOpacity>

      {info && (
        <View style={styles.card}>
          <Text style={styles.cidade}>{info.cidade}</Text>

          <Text style={styles.temp}>
            🌡️ {info.temperatura}°C
          </Text>

          <Text style={styles.info}>
            Sensação térmica: {info.temperaturaAparente}°C
          </Text>

          <Text style={styles.info}>
            Vai chover? {info.chuva}
          </Text>
        </View>
      )}

      <StatusBar style="auto" />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 25,
  },

  input: {
    width: '100%',
    height: 45,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },

  botao: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },

  textoBotao: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 16,
  },

  card: {
    marginTop: 30,
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 20,
    width: '100%',
    alignItems: 'center',

    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },

  cidade: {
    fontSize: 20,
    color: '#555',
    marginBottom: 10,
  },

  temp: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#333',
  },

  info: {
    fontSize: 18,
    color: '#666',
    marginTop: 8,
  }
});
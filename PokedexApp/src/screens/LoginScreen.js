import { useOAuth } from '@clerk/clerk-expo';
import * as WebBrowser from 'expo-web-browser';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image
} from 'react-native';
import LogoPokemon from '../../assets/pokemon.png'

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });

  async function handleGoogleLogin() {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow();

      if (createdSessionId) {
        await setActive({ session: createdSessionId });

        Alert.alert("Sucesso 🎉", "Login com Google realizado!");
      } else {
        Alert.alert("Erro", "Não foi possível completar o login");
      }

    } catch (err) {
      console.log(err);
      Alert.alert("Erro", "Falha ao entrar com Google");
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.cad}>
        <View>
         <Image source={LogoPokemon} style={styles.logo} />
        </View>
      

      <Text style={styles.subtitle}>
        Entre com sua conta Google
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleGoogleLogin}>
        <Text style={styles.buttonText}>Entrar com Google</Text>
      </TouchableOpacity>
      </View>
        

      

    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a', // fundo escuro bonito
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  subtitle: {
    fontSize: 16,
    color: 'black',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#3b82f6', // azul forte
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  logo: {
  width: 200,
  height: 80,
  //resizeMode: 'contain' controla como a imagem se encaixa dentro do espaço definido (width/height).
  resizeMode: 'contain',
  marginBottom: 20,
},
cad:{
    backgroundColor: "#38bdf8",
    padding: 20,
    borderRadius: 20
}
});
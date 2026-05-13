import { useEffect, useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image
} from 'react-native';

import {
  useNavigation
} from '@react-navigation/native';

import axios from 'axios';
import { MotiView } from 'moti';

export default function QuizScreen() {

  const navigation = useNavigation();

  const [pokemon, setPokemon] = useState(null);

  const [opcoes, setOpcoes] = useState([]);

  const [resultado, setResultado] = useState('');

  const [tempo, setTempo] = useState(10);

  const [quizAtivo, setQuizAtivo] = useState(true);

  const [errou, setErrou] = useState(false);

  const [vidas, setVidas] = useState(3);

  useEffect(() => {
    gerarPergunta();
  }, []);

  useEffect(() => {

    if (!quizAtivo) return;

    if (tempo <= 0) {

      setQuizAtivo(false);

      setResultado('⏰ Tempo esgotado!');

      setVidas(prev => prev - 1);

      return;
    }

    const intervalo = setInterval(() => {

      setTempo(prev => prev - 1);

    }, 1000);

    return () => clearInterval(intervalo);

  }, [tempo, quizAtivo]);

  async function gerarPergunta() {

    setResultado('');

    setTempo(10);

    setQuizAtivo(true);

    // número aleatório
    const id = Math.floor(Math.random() * 151) + 1;

    // pokemon correto
    const response = await axios.get(
      `https://pokeapi.co/api/v2/pokemon/${id}`
    );

    const pokemonCorreto = response.data;

    // opções falsas
    const falsas = [];

    while (falsas.length < 3) {

      const fakeId =
        Math.floor(Math.random() * 151) + 1;

      const fakeResponse = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${fakeId}`
      );

      const nomeFake = fakeResponse.data.name;

      if (
        nomeFake !== pokemonCorreto.name &&
        !falsas.includes(nomeFake)
      ) {
        falsas.push(nomeFake);
      }
    }

    // junta tudo
    const todasOpcoes = [
      pokemonCorreto.name,
      ...falsas
    ];

    // embaralha
    todasOpcoes.sort(() => Math.random() - 0.5);

    setPokemon(pokemonCorreto);

    setOpcoes(todasOpcoes);
  }

  function responder(opcao) {

    if (!quizAtivo) return;

    setQuizAtivo(false);

    if (opcao === pokemon.name) {

      setResultado('✅ Acertou!');

    } else {

      setResultado(
        `❌ Era ${pokemon.name}`
      );

      setVidas(prev => prev - 1);

      // 🔥 SHAKE
      setErrou(true);

      setTimeout(() => {
        setErrou(false);
      }, 500);
    }

    setTimeout(() => {

      if (vidas > 1 || opcao === pokemon.name) {
        gerarPergunta();
      }

    }, 2000);
  }

  // proteção
  if (!pokemon) {
    return null;
  }

  // game over
  if (vidas <= 0) {

    return (

      <View style={styles.container}>

        {/* 🔙 voltar */}
        <TouchableOpacity
          style={styles.botaoVoltar}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.textoVoltar}>
            ← Voltar
          </Text>
        </TouchableOpacity>

        <Text style={styles.gameOver}>
          💀 Game Over
        </Text>

        <TouchableOpacity
          style={styles.botaoRestart}
          onPress={() => {

            setVidas(3);

            gerarPergunta();
          }}
        >
          <Text style={styles.textoBotao}>
            🔄 Jogar Novamente
          </Text>
        </TouchableOpacity>

      </View>
    );
  }

  return (

    <View style={styles.container}>

      {/* 🔙 voltar */}
      <TouchableOpacity
        style={styles.botaoVoltar}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.textoVoltar}>
          ← Voltar
        </Text>
      </TouchableOpacity>

      <MotiView
        animate={{
          translateX: errou
            ? [-10, 10, -10, 10, 0]
            : 0
        }}
        transition={{
          type: 'timing',
          duration: 500
        }}
      >

        <Text style={styles.titulo}>
          Quem é esse Pokémon?
        </Text>

        {/* ❤️ vidas */}
        <Text style={styles.vidas}>
          ❤️ Vidas: {vidas}
        </Text>

        {/* ⏳ timer */}
        <Text style={styles.timer}>
          ⏳ Tempo: {tempo}s
        </Text>

        {/* SILHUETA */}
        <Image
          source={{
            uri: pokemon.sprites.front_default
          }}
          style={styles.imagem}
        />

        {/* OPÇÕES */}
        {opcoes.map((opcao, index) => (

          <TouchableOpacity
            key={index}
            style={styles.botao}
            onPress={() => responder(opcao)}
          >
            <Text style={styles.textoBotao}>
              {
                opcao.charAt(0).toUpperCase() +
                opcao.slice(1)
              }
            </Text>
          </TouchableOpacity>

        ))}

        <Text style={styles.resultado}>
          {resultado}
        </Text>

      </MotiView>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  // 🔙 voltar
  botaoVoltar: {
    position: 'absolute',
    top: 50,
    left: 20,
  },

  textoVoltar: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  titulo: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },

  vidas: {
    color: '#ff4d6d',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },

  timer: {
    color: '#38bdf8',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },

  imagem: {
    width: 200,
    height: 200,

    // silhueta
    tintColor: '#000',

    marginBottom: 30,
    alignSelf: 'center',
  },

  botao: {
    backgroundColor: '#1e293b',
    width: 300,
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: 'center',
  },

  textoBotao: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },

  resultado: {
    marginTop: 20,
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  gameOver: {
    color: '#ff4d6d',
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 30,
  },

  botaoRestart: {
    backgroundColor: '#2563eb',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 12,
  },

});
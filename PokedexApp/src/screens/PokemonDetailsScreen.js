import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  ScrollView
} from 'react-native';

import { useRoute, useNavigation } from '@react-navigation/native';

import axios from 'axios';
import { Audio } from 'expo-av';

// ✨ ANIMAÇÕES
import { MotiView, MotiImage } from 'moti';

// 🎨 CORES DOS TIPOS
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

// 🎨 CORES DAS STATS
const coresStats = {
  hp: '#ef4444',
  attack: '#f97316',
  defense: '#3b82f6',
  'special-attack': '#a855f7',
  'special-defense': '#14b8a6',
  speed: '#eab308',
};

// 🗺️ REGIÕES
const regioes = {
  'generation-i': 'Kanto',
  'generation-ii': 'Johto',
  'generation-iii': 'Hoenn',
  'generation-iv': 'Sinnoh',
  'generation-v': 'Unova',
  'generation-vi': 'Kalos',
  'generation-vii': 'Alola',
  'generation-viii': 'Galar',
  'generation-ix': 'Paldea',
};

// 🌙 TEMAS
const temas = {

  dark: {
    fundo: '#0f172a',
    texto: '#ffffff',
    cardTexto: '#000',
    botao: '#1e293b',
  },

  light: {
    fundo: '#f1f5f9',
    texto: '#000000',
    cardTexto: '#111',
    botao: '#cbd5e1',
  }

};

export default function PokemonDetailsScreen() {

  const route = useRoute();
  const navigation = useNavigation();

  const { pokemon } = route.params || {};

  const [detalhes, setDetalhes] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔊 áudio
  const [somPokemon, setSomPokemon] = useState(null);

  // 🌙 tema
  const [temaEscuro, setTemaEscuro] = useState(true);

  // ✨ shiny
  const [shiny, setShiny] = useState(false);

  // 🧬 evoluções
  const [evolucoes, setEvolucoes] = useState([]);

  // 📊 stats
  const [stats, setStats] = useState([]);

  // 🗺️ região
  const [regiao, setRegiao] = useState('');

  // 🎨 tema atual
  const tema = temaEscuro
    ? temas.dark
    : temas.light;

  useEffect(() => {

    configurarAudio();

    if (pokemon) {
      buscarDetalhes();
    }

  }, []);

  // 🔊 configura áudio
  async function configurarAudio() {

    await Audio.requestPermissionsAsync();

    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
    });

  }

  // 🔥 busca dados
  async function buscarDetalhes() {

    try {

      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${pokemon.nome}`
      );

      const especie = await axios.get(
        response.data.species.url
      );

      const descricao =
        especie.data.flavor_text_entries.find(
          item =>
            item.language.name === 'pt' ||
            item.language.name === 'en'
        );

      // 🔊 cry
      const cry = response.data.cries.latest;

      // 🧬 EVOLUÇÃO
      const evolucaoResponse = await axios.get(
        especie.data.evolution_chain.url
      );

      const listaEvolucoes = [];

      let atual = evolucaoResponse.data.chain;

      while (atual) {

        listaEvolucoes.push(
          atual.species.name
        );

        atual = atual.evolves_to[0];
      }

      setEvolucoes(listaEvolucoes);

      // 📊 STATS
      setStats(response.data.stats);

      // 🗺️ REGIÃO
      const nomeRegiao =
        regioes[especie.data.generation.name];

      setRegiao(nomeRegiao);

      setDetalhes({
        id: response.data.id,
        peso: response.data.weight,
        geracao: especie.data.generation.name,
        descricao:
          descricao?.flavor_text?.replace(/\n|\f/g, ' ')
      });

      setSomPokemon(cry);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  }

  // 🔊 toca som
  async function tocarSom() {

    try {

      if (!somPokemon) return;

      const { sound } =
        await Audio.Sound.createAsync({
          uri: somPokemon
        });

      await sound.playAsync();

    } catch (error) {

      console.log(error);

    }
  }

  // 🔒 proteção
  if (!pokemon) {
    return (
      <View style={styles.container}>
        <Text style={{ color: '#fff' }}>
          Erro ao carregar Pokémon
        </Text>
      </View>
    );
  }

  // ⏳ loading
  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: tema.fundo }
        ]}
      >
        <ActivityIndicator
          size="large"
          color="#38bdf8"
        />
      </View>
    );
  }

  // 🎨 cor do tipo
  const tipoPrincipal = pokemon.tipos?.[0];

  const corFundo =
    coresPorTipo[tipoPrincipal] || '#1e293b';

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: tema.fundo }
      ]}
      showsVerticalScrollIndicator={false}
    >

      {/* 🔙 VOLTAR */}
      <View style={styles.topBar}>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
        >
          <Text
            style={[
              styles.voltar,
              { color: tema.texto }
            ]}
          >
            ← Voltar
          </Text>
        </TouchableOpacity>

        {/* 🌙 BOTÃO TEMA */}
        <TouchableOpacity
          style={[
            styles.botaoTema,
            { backgroundColor: tema.botao }
          ]}
          onPress={() =>
            setTemaEscuro(!temaEscuro)
          }
        >
          <Text style={{ color: tema.texto }}>
            {temaEscuro ? '☀️' : '🌙'}
          </Text>
        </TouchableOpacity>

      </View>

      {/* ✨ CARD COM ANIMAÇÃO */}
      <MotiView
        from={{
          opacity: 0,
          translateY: 80,
          scale: 0.8
        }}
        animate={{
          opacity: 1,
          translateY: 0,
          scale: 1
        }}
        transition={{
          type: 'timing',
          duration: 800
        }}
        style={[
          styles.card,
          { backgroundColor: corFundo }
        ]}
      >

        {/* 📛 NOME */}
        <Text style={styles.nome}>
          {
            pokemon.nome.charAt(0).toUpperCase() +
            pokemon.nome.slice(1)
          }
        </Text>

        {/* 🖼️ IMAGEM COM ANIMAÇÃO */}
        <MotiImage
          source={{
            uri: shiny
              ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${detalhes.id}.png`
              : pokemon.imagem
          }}
          style={styles.imagem}

          from={{
            rotate: '0deg',
            scale: 0.5,
            opacity: 0
          }}

          animate={{
            rotate: shiny ? '360deg' : '0deg',
            scale: 1,
            opacity: 1
          }}

          transition={{
            type: 'timing',
            duration: 1000
          }}
        />

        {/* ✨ BOTÃO SHINY */}
        <TouchableOpacity
          style={styles.shinyButton}
          onPress={() => setShiny(!shiny)}
        >
          <Text style={styles.shinyText}>
            {shiny
              ? '✨ Normal'
              : '⭐ Shiny'}
          </Text>
        </TouchableOpacity>

        {/* 🔊 SOM */}
        <TouchableOpacity
          style={styles.botaoSom}
          onPress={tocarSom}
        >
          <Text style={styles.textoSom}>
            🔊
          </Text>
        </TouchableOpacity>

        <Text
          style={[
            styles.info,
            { color: tema.cardTexto }
          ]}
        >
          Ouvir som do {
            pokemon.nome.charAt(0).toUpperCase() +
            pokemon.nome.slice(1)
          }
        </Text>

        {/* 📌 TIPOS */}
        <Text
          style={[
            styles.info,
            { color: tema.cardTexto }
          ]}
        >
          Tipos: {
            pokemon.tipos
              .map(tipo =>
                tipo.charAt(0).toUpperCase() +
                tipo.slice(1)
              )
              .join(', ')
          }
        </Text>

        {/* ⚖️ PESO */}
        <Text
          style={[
            styles.info,
            { color: tema.cardTexto }
          ]}
        >
          ⚖️ Peso: {detalhes.peso / 10} kg
        </Text>

        {/* 🌎 GERAÇÃO */}
        <Text
          style={[
            styles.info,
            { color: tema.cardTexto }
          ]}
        >
          🌎 Geração: {
            detalhes.geracao
              .replace('generation-', '')
              .toUpperCase()
          }
        </Text>

        {/* 🗺️ REGIÃO */}
        <Text
          style={[
            styles.info,
            { color: tema.cardTexto }
          ]}
        >
          🗺️ Região: {regiao}
        </Text>

        {/* 📖 DESCRIÇÃO */}
        <Text
          style={[
            styles.descricao,
            { color: tema.cardTexto }
          ]}
        >
          {detalhes.descricao}
        </Text>

        {/* 📊 STATS */}
        <Text style={styles.statsTitle}>
          📊 Stats
        </Text>

        <View style={styles.statsContainer}>

          {stats.map((item, index) => {

            const nomeStat = item.stat.name;

            const valor = item.base_stat;

            const cor =
              coresStats[nomeStat] || '#ffffff';

            return (

              <MotiView
                key={index}

                from={{
                  opacity: 0,
                  translateX: -30
                }}

                animate={{
                  opacity: 1,
                  translateX: 0
                }}

                transition={{
                  delay: index * 150,
                  type: 'timing'
                }}

                style={styles.statItem}
              >

                <View style={styles.statHeader}>

                  <Text style={styles.statNome}>
                    {
                      nomeStat
                        .replace('-', ' ')
                        .toUpperCase()
                    }
                  </Text>

                  <Text style={styles.statValor}>
                    {valor}
                  </Text>

                </View>

                <View style={styles.barraFundo}>

                  <MotiView
                    from={{
                      width: 0
                    }}

                    animate={{
                      width: `${Math.min(valor, 100)}%`
                    }}

                    transition={{
                      type: 'timing',
                      duration: 1000
                    }}

                    style={[
                      styles.barra,
                      {
                        backgroundColor: cor
                      }
                    ]}
                  />

                </View>

              </MotiView>

            );

          })}

        </View>

      {/* 🧬 EVOLUÇÕES */}
<Text style={styles.evolutionTitle}>
  🧬 Evoluções
</Text>

<View style={styles.evolutionContainer}>

  {evolucoes.length <= 1 ? (

    <Text style={styles.semEvolucao}>
      Este Pokémon não possui evolução.
    </Text>

  ) : (

    evolucoes.map((poke, index) => (

      <MotiView
        key={index}

        from={{
          opacity: 0,
          translateY: 20
        }}

        animate={{
          opacity: 1,
          translateY: 0
        }}

        transition={{
          delay: index * 300,
          type: 'timing'
        }}

        style={styles.evolutionItem}
      >

        <Image
          source={{
            uri:
              `https://img.pokemondb.net/sprites/home/normal/${poke}.png`
          }}
          style={styles.evolutionImage}
        />

        <Text style={styles.evolutionText}>
          {
            poke.charAt(0).toUpperCase() +
            poke.slice(1)
          }
        </Text>

        {index < evolucoes.length - 1 && (
          <Text style={styles.arrow}>
            ↓
          </Text>
        )}

      </MotiView>

    ))

  )}

</View>

      </MotiView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
  },

  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  voltar: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  botaoTema: {
    padding: 10,
    borderRadius: 10,
  },

  card: {
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },

  nome: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  imagem: {
    width: 180,
    height: 180,
    marginVertical: 15,
  },

  shinyButton: {
    backgroundColor: '#facc15',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 15,
  },

  shinyText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },

  botaoSom: {
    backgroundColor: '#0f172a',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 15,
  },

  textoSom: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  info: {
    fontSize: 16,
    marginTop: 5,
    textAlign: 'center',
  },

  descricao: {
    marginTop: 15,
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
  },

  statsTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 15,
  },

  statsContainer: {
    width: '100%',
  },

  statItem: {
    marginBottom: 15,
  },

  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },

  statNome: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },

  statValor: {
    color: '#fff',
    fontWeight: 'bold',
  },

  barraFundo: {
    width: '100%',
    height: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    overflow: 'hidden',
  },

  barra: {
    height: '100%',
    borderRadius: 20,
  },

  evolutionTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 15,
  },

  evolutionContainer: {
    alignItems: 'center',
  },

  evolutionItem: {
    alignItems: 'center',
    marginBottom: 10,
  },

  evolutionImage: {
    width: 90,
    height: 90,
  },

  evolutionText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 5,
  },

  arrow: {
    color: '#fff',
    fontSize: 30,
    marginVertical: 5,
  },

});
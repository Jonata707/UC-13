import { StatusBar } from 'expo-status-bar';
import { Text, View,  ScrollView, TextInput } from 'react-native';

// Importando o css do arquivo style.ts
import styles from "./style";

import { Feather } from '@expo/vector-icons';

export default function App() {
  return (
    <View style={styles.container}>
     <ScrollView>
        <View style={styles.inputContainer}>
            <Feather name='search' size={20} color="#ff556e"/>
            <TextInput
            style={styles.busca}
            placeholder='Digite aqui'
            placeholderTextColor="#888888"
            />
            <Feather name='arrow-right' size={20} color="#ff556e"/>
            
          
        </View>





     </ScrollView>
      <StatusBar style="auto" />
    </View>
  );
}
import { View, Text, StyleSheet } from 'react-native';

export function Alert({ type, children }: { type: 'success' | 'error', children: React.ReactNode }) {
  const stylesByType = {
    success: {
      backgroundColor: '#dcfce7', // light green
      color: '#166534', // dark green
    },
    error: {
      backgroundColor: '#fee2e2', // light red
      color: '#991b1b', // dark red
    }
  };

  const styles = StyleSheet.create({
    container: {
      padding: 16,
      borderRadius: 8,
      marginBottom: 16,
      backgroundColor: stylesByType[type].backgroundColor
    },
    text: {
      color: stylesByType[type].color
    }
  });
  
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{children}</Text>
    </View>
  );
} 
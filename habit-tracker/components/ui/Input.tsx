import { TextInput, StyleSheet } from 'react-native';

export function Input(props: React.ComponentProps<typeof TextInput>) {
  return (
    <TextInput 
      style={styles.input}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
  }
}); 
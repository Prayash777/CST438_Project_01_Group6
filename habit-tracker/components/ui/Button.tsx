import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps } from 'react-native';

type ButtonProps = TouchableOpacityProps & {
  variant?: 'default' | 'outline' | 'danger';
  children?: React.ReactNode;
};

export function Button({ variant = 'default', style, children, ...props }: ButtonProps) {
  const variantStyles = {
    default: styles.defaultButton,
    outline: styles.outlineButton,
    danger: styles.dangerButton,
  };
  
  return (
    <TouchableOpacity 
      style={[styles.button, variantStyles[variant], style]}
      {...props}
    >
      <Text style={[
        styles.text,
        variant === 'outline' ? styles.outlineText : styles.defaultText
      ]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  defaultButton: {
    backgroundColor: '#3B82F6',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  dangerButton: {
    backgroundColor: '#EF4444',
  },
  text: {
    textAlign: 'center',
  },
  defaultText: {
    color: '#FFFFFF',
  },
  outlineText: {
    color: '#374151',
  },
}); 
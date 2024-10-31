// AppText.tsx
import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { useFontSize } from '@/contexts/fontSizeContext';

interface AppTextProps extends TextProps {
  children: React.ReactNode;
}

const AppText: React.FC<AppTextProps> = ({ children, style, ...props }) => {
  const { fontSize } = useFontSize();

  return (
    <Text style={[styles.text, { fontSize }, style]} {...props}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    // Puedes agregar otros estilos globales si los necesitas
  },
});

export default AppText;

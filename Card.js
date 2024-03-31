// Card.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Card = ({ value, onPress, index, isFlipped, isMatched }) => {
  return (
    <TouchableOpacity 
      style={[styles.card, isFlipped || isMatched ? styles.flipped : styles.hidden, isMatched && styles.matched]}
      onPress={() => onPress(value, index)}
      disabled={isFlipped || isMatched}
    >
      <Text style={styles.text}>{isFlipped || isMatched ? value : ''}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 70,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    backgroundColor: '#333',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  flipped: {
    backgroundColor: '#FFF',
    borderColor: '#000',
  },
  hidden: {
    backgroundColor: '#333',
  },
  matched: {
    opacity: 0,
  },
  text: {
    fontSize: 24,
    color: '#000',
  },
});

export default Card;

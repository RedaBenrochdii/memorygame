// Board.js
import React, { useState, useEffect } from 'react';
import { View, Text, Alert, StyleSheet, Button } from 'react-native';
import Card from './Card';  // Assurez-vous que Card est adapté pour React Native

const shuffleCards = (array) => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
};

const Board = () => {
  const initialCards = shuffleCards(['A', 'A', 'B', 'B']);
  const [cards, setCards] = useState(initialCards);
  const [openCards, setOpenCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [playerTurn, setPlayerTurn] = useState(1);
  const [scores, setScores] = useState({ player1: 0, player2: 0 });
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [isLucky, setIsLucky] = useState(false);
  const [previouslySeen, setPreviouslySeen] = useState(new Set());
  const [luckyCount, setLuckyCount] = useState({ player1: 0, player2: 0 });

  const onCardClick = (cardValue, index) => {
    if (!openCards.includes(index) && openCards.length < 2 && !matchedPairs.includes(cardValue)) {
      const newOpenCards = [...openCards, index];
      setOpenCards(newOpenCards);

      if (newOpenCards.length === 2) {
        setMoves(moves + 1);
        const isMatch = cards[newOpenCards[0]] === cards[newOpenCards[1]];

        setTimeout(() => {
          if (isMatch) {
            setMatchedPairs([...matchedPairs, cards[newOpenCards[0]]]);
            const updatedScores = { ...scores };
            updatedScores[playerTurn === 1 ? 'player1' : 'player2'] += 1;
            setScores(updatedScores);

            const isFirstTimeSeen = !previouslySeen.has(newOpenCards[0]) && !previouslySeen.has(newOpenCards[1]);
            setIsLucky(isFirstTimeSeen);

            if (isFirstTimeSeen) {
              const updatedLuckyCount = { ...luckyCount };
              updatedLuckyCount[playerTurn === 1 ? 'player1' : 'player2'] += 1;
              setLuckyCount(updatedLuckyCount);
            }

            setPreviouslySeen(new Set([...previouslySeen, newOpenCards[0], newOpenCards[1]]));
          } else {
            setPreviouslySeen(new Set([...previouslySeen, newOpenCards[0], newOpenCards[1]]));
            setPlayerTurn(playerTurn === 1 ? 2 : 1);
          }
          setOpenCards([]);
        }, 1000);
      }
    }
  };

  useEffect(() => {
    if (matchedPairs.length === initialCards.length / 2) {
      Alert.alert(
        `Jeu terminé`,
        `Joueur ${scores.player1 > scores.player2 ? 1 : 2} gagne avec ${Math.max(scores.player1, scores.player2)} points!`,
        [
          {
            text: 'Rejouer',
            onPress: () => {
              resetGame();
            },
          },
        ]
      );
    }
  }, [matchedPairs, scores, initialCards.length]);

  const resetGame = () => {
    setCards(shuffleCards(['A', 'A', 'B', 'B']));
    setOpenCards([]);
    setMoves(0);
    setPlayerTurn(1);
    setScores({ player1: 0, player2: 0 });
    setMatchedPairs([]);
    setIsLucky(false);
    setPreviouslySeen(new Set());
    setLuckyCount({ player1: 0, player2: 0 });
  };

  return (
    <View style={styles.board}>
      {isLucky && <Text style={styles.luckyMessage}>Coup de chance!</Text>}
      <View style={styles.info}>
        <Text>Joueur 1: {scores.player1} (Coups de chance: {luckyCount.player1})</Text>
        <Text>{`Au tour du Joueur ${playerTurn}`}</Text>
        <Text>Joueur 2: {scores.player2} (Coups de chance: {luckyCount.player2})</Text>
      </View>
      <View style={styles.cardContainer}>
        {cards.map((value, index) => (
          <Card
            key={index}
            value={value}
            onPress={() => onCardClick(value, index)}
            index={index}
            isFlipped={openCards.includes(index) || matchedPairs.includes(value)}
            isMatched={matchedPairs.includes(value)}
          />
        ))}
      </View>
      <Button title="Rejouer" onPress={resetGame} />
    </View>
  );
};

const styles = StyleSheet.create({
  board: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  luckyMessage: {
    fontSize: 20,
    color: 'green',
  },
  info: {
    alignItems: 'center',
    marginBottom: 20,
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
});

export default Board;

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { fetchMotivationalQuote } from '../utils/fetchQuotes'; 
import { COLORS, FONTS, SPACING } from '../utils/theme';

const MotivationalHeader = () => {
  const [quote, setQuote] = useState('');

  const getQuote = async () => {
    const fetchedQuote = await fetchMotivationalQuote();
    setQuote(fetchedQuote);
  };

  useEffect(() => {
    getQuote();
    const intervalId = setInterval(() => {
      getQuote();
    }, 3600000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <View style={styles.headerContainer}>
      <Text style={styles.quoteText}>"{quote}"</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingVertical: SPACING.s,
    paddingHorizontal: SPACING.m,
    backgroundColor: 'transparent',
  },
  quoteText: {
    fontSize: 16,
    color: COLORS.white,
    textAlign: 'center',
    fontStyle: 'italic',
    fontFamily: FONTS.regular,
  },
});

export default MotivationalHeader;

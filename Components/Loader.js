import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const Loader = () => {
  const balls = new Array(5).fill(null);
  const animations = balls.map(() => useRef(new Animated.Value(0)).current);
  const screenHeight = Dimensions.get('window').height;

  useEffect(() => {
    const loops = animations.map((anim, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: -30,
            duration: 300,
            easing: Easing.ease,
            useNativeDriver: true,
            delay: i * 100,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 300,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
        ]),
      ),
    );
    loops.forEach(loop => loop.start());
  }, []);

  return (
    <View style={[styles.container, { height: screenHeight }]}>
      <View style={styles.ballsContainer}>
        {balls.map((_, i) => (
          <Animated.View
            key={i}
            style={[
              styles.ball,
              {
                transform: [{ translateY: animations[i] }],
                marginLeft: i * 10,
              },
            ]}
          />
        ))}
      </View>
      <Text style={styles.text}>Processing</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(225,225,225,0.5)',
  },
  ballsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  ball: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: '#3498db',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
  },
});

export default Loader;

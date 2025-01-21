
import React, { useState, useRef, useEffect } from 'react';
import { View, Image, Dimensions, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
const { width: viewportWidth } = Dimensions.get('window');

export default function AutoSlidingCarousel({ height, carouselItems }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => {
        const nextIndex = (prevIndex + 1) % carouselItems.length;
        scrollViewRef.current.scrollTo({ x: nextIndex * viewportWidth, animated: true });
        return nextIndex;
      });
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const renderImage = (item) => {
    if (typeof item.image === 'string') {
      // Remote image
      return <Image source={{ uri: item.image }} style={styles.image} resizeMode="contain" />;
    } else {
      // Local image
      return <Image source={item.image} style={styles.image} resizeMode="contain" />;
    }
  };

  const renderHomeCorousel = (item) => {
       
            return (
            
              <Image
                source={{ uri: item.image }}
                style={styles.image}
                resizeMode="cover"
              />
            );
          
      };

  const renderIndicators = () => {
    return (
      <View style={styles.indicatorContainer}>
        {carouselItems.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.indicator,
              { backgroundColor: currentIndex === index ? 'green' : 'lightgray' },
            ]}
            onPress={() => {
              setCurrentIndex(index);
              scrollViewRef.current.scrollTo({ x: index * viewportWidth, animated: true });
            }}
          />
        ))}
      </View>
    );
  };

  const handleScrollEnd = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / viewportWidth);
    setCurrentIndex(newIndex);
  };

 
  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        onMomentumScrollEnd={handleScrollEnd} // Add this event to handle manual scrolling
      >
        {carouselItems.map(item => (
          <View key={item.id} style={[styles.card, { height }]}>
            {renderImage(item)}
          </View>
        ))}
      </ScrollView>
      {renderIndicators()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    overflow: 'hidden',
  },
  scrollView: {
    width: '100%',
  },
  card: {
    width: viewportWidth,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    position: 'absolute',
    bottom: 10,
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
});

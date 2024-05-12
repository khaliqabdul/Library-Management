import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

export default function Card(props) {
  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        { props.children }
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 6,
        elevation: 13,
        backgroundColor: '#fff',
        shadowOffset: {width: 1, height: 4},
        shadowColor: 'black',
        shadowOpacity: 0.3,
        shadowRadius: 6,
        marginHorizontal: 4,
        marginVertical: 6
    },
    cardContent: {
        // marginHorizontal: 28,
        // marginVertical: 20
    }
})
import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { moderateScale, textScale } from '../styles/responsiveSize'
import Colors from '../Colors'

const RoundImage = ({image="", size=80}) => {
  return (
    <View style={{
        height: moderateScale(size),
        width: moderateScale(size),
        borderRadius: moderateScale(size/2),
        backgroundColor: Colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor:Colors.gray
    }}>
      {!!image ? <Image source={{uri: image}}/> : <Text style={styles.textStyle}>add photo</Text>}
    </View>
  )
}

export default RoundImage

const styles = StyleSheet.create({
    textStyle: {
        fontSize: textScale(12),
        color: Colors.menu1,
        fontWeight: '800'
    }
})
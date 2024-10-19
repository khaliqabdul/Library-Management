import {
  Pressable,
  StyleSheet,
  Text,
  Image,
  Modal,
  FlatList,
  TextInput,
} from "react-native";
import { useMedia, View } from "@gluestack-ui/themed";
import React, { Fragment, useCallback, useState } from "react";
import image from "../../assets/images/forward.png";
import { countries } from "../popup-menu/data";
import Colors from "../Colors";
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from "../styles/responsiveSize";

const CountryPicker = ({ fetchCountry = () => {}, value = "" }) => {
  const [countryData, setCountryData] = useState(countries);
  const [showModal, setShowModal] = useState(false);

  const ListHeader = () => {
    return (
      <>
        <View style={styles.listHeader}>
          <Pressable onPress={() => setShowModal(false)} activeOpacity={0.7}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>Back</Text>
          </Pressable>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            Select your country
          </Text>
        </View>
      </>
    );
  };

  const openModal = () => {
    setShowModal(true);
  };

  const onSearch = (text) => {
    if (text !== "") {
      let tempData = countryData.filter((item) => {
        return item.country.toLowerCase().indexOf(text.toLowerCase()) > -1;
      });
      setCountryData(tempData);
    } else {
      setCountryData(countries);
    }
  };
  // useCallback is used to speed up the flatlist
  const renderItem = useCallback(
    (item, index) => {
      const { country, code } = item.item;
      let isSelected = value == country;
      return (
        <View style={{ marginHorizontal: moderateScale(24) }}>
          <Pressable
            // pass country data from children to parent component
            onPress={() => onSelectCountry(item)}
            activeOpacity={0.7}
          >
            <Text
              style={{
                ...styles.nameStyle,
                color: isSelected ? Colors.menu1 : Colors.black,
                fontWeight: isSelected ? "800" : "400",
              }}
            >
              {country}, {code}
            </Text>
          </Pressable>
        </View>
      );
    },
    [countryData, value]
  );

  // pass data from children to parent component
  const onSelectCountry = (item) => {
    fetchCountry(item);
    onSearch("");
    setShowModal(false);
  };

  const media = useMedia();
  return (
    <Fragment>
      <Pressable
        style={styles.container}
        activeOpacity={0.7}
        onPress={openModal}
      >
        <Text style={styles.nameStyle}>{value}</Text>
        <Image source={image} style={{ width: 20, height: 20 }} />
      </Pressable>
      {/* Modal */}
      <Modal animationType="slide" transparent={false} visible={showModal}>
        <View
          style={styles.modal}
          width={media.lg ? "$1/3" : "$full"}
          marginRight={"auto"}
          marginLeft={"auto"}
        >
          <ListHeader />
          {/* search */}
          <TextInput
            placeholder="Search"
            style={styles.searchInput}
            onChangeText={(text) => {
              onSearch(text);
            }}
          />
          <View style={{ flex: 1 }}>
            <FlatList
              data={countryData}
              renderItem={renderItem}
              ItemSeparatorComponent={() => (
                <View style={styles.separator}></View>
              )}
              // ListHeaderComponent={() => listHeader()}
            />
          </View>
        </View>
      </Modal>
    </Fragment>
  );
};

export default React.memo(CountryPicker);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScaleVertical(7),
  },
  modal: {
    flex: 1,
  },
  searchInput: {
    width: "95%",
    height: height / 18,
    borderWidth: 0.5,
    borderColor: "#1b1b33",
    alignSelf: "center",
    paddingLeft: moderateScale(16),
    marginTop: moderateScaleVertical(20),
    marginBottom: moderateScaleVertical(20),
  },
  separator: {
    borderBottomWidth: 0.7,
    marginVertical: moderateScaleVertical(7),
  },
  listHeader: {
    height: height / 12,
    alignItems: "center",
    justifyContent: "space-evenly",
    borderBottomWidth: 1,
    flexDirection: "row",
  },
  nameStyle: {
    color: Colors.menu1,
    fontWeight: "800",
    fontSize: textScale(16),
  },
});

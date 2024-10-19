import {
  Pressable,
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
} from "react-native";
import React, { useRef, useState } from "react";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import Icon from "../Icons";
import Colors from "../Colors";
import {
  Modal,
  ModalContent,
  ModalBackdrop,
  ModalHeader,
  Heading,
  ModalCloseButton,
  CloseIcon,
  ModalBody,
  // Icon,
} from "@gluestack-ui/themed";

const CustomDropdownComponent = ({
  fetchItem = () => {},
  dropdownList,
  inputLabel = "",
  value = "",
  error,
}) => {
  const [isClicked, setIsClicked] = useState(false);
  const [data, setData] = useState(dropdownList);
  const searchRef = useRef();

  const onSearch = (text) => {
    if (text !== "") {
      let tempData = data.filter((item) => {
        return item.toLowerCase().indexOf(text.toLowerCase()) > -1;
      });
      setData(tempData);
    } else {
      setData(dropdownList);
    }
  };
  // flatlist render item function
  const renderItem = ({ item, index }) => {
    return (
      <>
        <Pressable
          style={styles.dropdownItem}
          onPress={() => {
            onSelectItem(item);
            onSearch("");
            setIsClicked(false);
            searchRef.current.clear();
          }}
        >
          <Text style={{ fontWeight: "600" }}>{item}</Text>
        </Pressable>
      </>
    );
  };

  const onSelectItem = (item) => {
    fetchItem(item);
  };

  return (
    <View style={styles.container}>
      {/* Label */}
      <Text style={styles.heading}>{inputLabel}</Text>
      {/* dropdown selector */}
      <Pressable
        style={styles.dropdownSelector}
        onPress={() => {
          setIsClicked(!isClicked);
        }}
      >
        <Text>{value}</Text>
        {isClicked ? <Icon icon={faAngleUp} /> : <Icon icon={faAngleDown} />}
      </Pressable>
      <Text style={styles.errorMessage}>{error}</Text>
      {/* dropdown area */}
      {isClicked ? (
        <Modal
          isOpen={isClicked}
          onClose={() => {
            setIsClicked(false);
          }}
        >
          <ModalBackdrop />
          <ModalContent>
            {/* <ModalHeader>
              <Heading size="lg" color="$red600">
                <Text>Date of Birth</Text>
              </Heading>
              <ModalCloseButton>
                <Icon as={CloseIcon} />
              </ModalCloseButton>
            </ModalHeader> */}
            <ModalBody>
              <View style={styles.dropdownArea}>
                {/* search */}
                <TextInput
                  placeholder="Search"
                  ref={searchRef}
                  style={styles.searchInput}
                  onChangeText={(text) => {
                    onSearch(text);
                  }}
                />
                {/* List */}
                <FlatList
                  data={data}
                  scrollEnabled={false}
                  renderItem={renderItem}
                />
              </View>
            </ModalBody>
          </ModalContent>
        </Modal>
      ) : null}
    </View>
  );
};

export default CustomDropdownComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 15,
  },
  heading: {
    fontSize: 16,
    fontWeight: "600",
    alignSelf: "flex-start",
  },
  dropdownSelector: {
    width: "100%",
    height: 35,
    borderWidth: 0.5,
    borderColor: "#1b1b33",
    alignSelf: "center",
    marginTop: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 15,
    paddingRight: 15,
  },
  icon: {
    width: 20,
    height: 20,
  },
  dropdownArea: {
    width: "100%",
    marginTop: 10,
    alignSelf: "center",
  },
  searchInput: {
    width: "90%",
    height: 35,
    borderWidth: 0.5,
    borderColor: "#1b1b33",
    alignSelf: "center",
    paddingLeft: 15,
    marginTop: 20,
  },
  dropdownItem: {
    width: "90%",
    height: 35,
    borderBottomWidth: 0.5,
    borderBottomColor: "#1b1b33",
    alignSelf: "center",
    justifyContent: "center",
  },
  errorMessage: {
    textAlign: "right",
    color: "red",
    fontSize: 13,
    marginBottom: 10,
  },
});

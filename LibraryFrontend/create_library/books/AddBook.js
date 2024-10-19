import { StyleSheet } from "react-native";
import { useEffect, useState, useRef } from "react";
import {
  FormControl,
  View,
  VStack,
  Spinner,
  ScrollView,
  useMedia,
} from "@gluestack-ui/themed";
import FormHeader from "../../components/formElements/ٖFormHeader";
import FormInput from "../../components/formElements/FormInput";
import FormSubmitButton from "../../components/formElements/FormSubmitButton";
import CustomDropdownComponent from "../../components/formElements/CustomDropdownComponent";
import { bookGenre } from "../../components/popup-menu/data";
import { useLogin } from "../../components/context/LoginProvider";
import {
  isValidFieldObject,
  updateError,
} from "../../components/utils/formValidationMethods";
import client from "../../components/api/client";
import ImagePickerComponent from "../../components/ImagePicker/ImagePickerComponent";
import socketServices from "../../components/utils/socketService";

const genreList = bookGenre.map((item, index) => {
  return `${item.genre}`;
});

const AddBook = ({ navigation }) => {
  const {
    isLoggedin,
    isToken,
    profile,
    image,
    setImage,
  } = useLogin();
  const [genre, setGenre] = useState("Select book genre")
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [inputInfo, setInputInfo] = useState({
    bookTitle: "",
    author: "",
    price: "",
  });
  const { bookTitle, author, price } = inputInfo;
  
  const inputRef = useRef();

  useEffect(() => {
    socketServices.iniliazeSocket();
    inputRef.current.focus();
  }, [inputRef]);

  const onChangeTextHandler = (value, fieldName) => {
    setInputInfo({ ...inputInfo, [fieldName]: value });
  };

  const registration_id = profile.id;
  
  // Reset From
  function resetForm() {
    setInputInfo({
      bookTitle: "",
      author: "",
      price: "",
    });
    setGenre("Select book genre")
    setImage(null);
  }

  function isvalidForm() {
    // return false if any field is empty
    if (!isValidFieldObject(inputInfo)) {
      return updateError("Required", setError);
    }
    // bookTitle validation
    if (bookTitle.length < 3) {
      return updateError("Title too short", setError);
    }
    // author validation
    if (author.length < 3) {
      return updateError("Name too short", setError);
    }
    // genre validation
    if (genre.length < 3) {
      return updateError("genre too short", setError);
    }
    // price validation
    if (price.length < 2) {
      return updateError("price too short", setError);
    }
    return true;
  }

  const sendRequestToAddNewBook = async () => {
    if (isvalidForm()) {
      setIsLoading(true);
      const formData = {
        registration_id,
        bookTitle,
        author,
        price,
        genre,
        image,
      };

      if (isLoggedin) {
        await client
          .post(`/addBook`, formData, {
            headers: {
              "Content-Type": "application/json",
              authorization: `${isToken}`,
            },
          })
          .then((res) => {
            // listen in bookController
            socketServices.emit("add_book", registration_id);
            resetForm();
            alert(res.data.message);
            // console.log(res.data)
          })
          .catch((err) => {
            console.log("Error", err);
            alert(res.data.message);
          })
          .finally(() => {
            setIsLoading(false);
            navigation.navigate("BooksList");
          });
      }
    }
  };

  // fetch book genre
  const fetchItem = (item) => {
    setGenre(item)
  }

  const media = useMedia();

  return (
    <View
      style={styles.container}
      bg="#f8f9fe"
      width={media.lg ? "$1/3" : "$full"}
      marginRight={"auto"}
      marginLeft={"auto"}
    >
      <View style={styles.formHeaderContainer}>
        <FormHeader
          leftHeading="Add"
          rightHeading="Book"
          style={{ color: "#FAF9F6", paddingTop: 5, fontWeight: "300" }}
        />
      </View>
      <ScrollView>
        <FormControl p="$4" borderWidth="$1" borderRadius="$lg">
          {/* Book Title */}
          <FormInput
            inputLabel="Book Title"
            placeholder="Enter Book Name"
            inputRef={inputRef}
            type="text"
            value={bookTitle}
            onChangeText={(value) => onChangeTextHandler(value, "bookTitle")}
            error={!bookTitle.trim() || bookTitle.length < 3 ? error : null}
          />
          {/* Author Name */}
          <FormInput
            inputLabel="Author"
            placeholder="Enter Author Name"
            type="text"
            value={author}
            onChangeText={(value) => onChangeTextHandler(value, "author")}
            error={!author.trim() || author.length < 3 ? error : null}
          />
          {/* Genre dropdown */}
          <CustomDropdownComponent
            dropdownList={genreList}
            inputLabel="Genre"
            value={genre}
            fetchItem={fetchItem}
            error={genre == "Select book genre" ? error : null}
          />
          {/* Price */}
          <FormInput
            inputLabel="Price"
            placeholder="Rs."
            keyboardType="numeric"
            maxLength={4}
            value={price}
            onChangeText={(value) => onChangeTextHandler(value, "price")}
            error={!price.trim() || price.length < 3 ? error : null}
          />
          {/* Image Picker */}
          <ImagePickerComponent />
          {/* Submit Button */}
          {isLoading ? (
            <VStack mt="$5">
              <Spinner size="large" color="red" />
            </VStack>
          ) : (
            <VStack mt="$5">
              <FormSubmitButton
                title={"Save Book"}
                onPress={() => sendRequestToAddNewBook()}
              />
            </VStack>
          )}
        </FormControl>
      </ScrollView>
    </View>
  );
};

export default AddBook;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 5,
  },
  formHeaderContainer: {
    height: 60,
    margin: 10,
    backgroundColor: "#1b1b33",
    borderRadius: 10,
  },
});

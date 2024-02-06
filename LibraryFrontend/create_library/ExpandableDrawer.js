import { Center } from "@gluestack-ui/themed";
import React, {useState, useEffect} from "react";
import { 
    SafeAreaView, StyleSheet, View, ScrollView, Text, Pressable, LayoutAnimation
} 
from "react-native";

// Dummy content
// you can also use dynamic data
const CONTENT = [
    {
        isExpanded: false,
        category_name: 'Item 1',
        subCategory: [
            {id: 1, val: 'Sub 1'},
            {id: 2, val: 'Sub 2'}
        ]
    }, 
    {
        isExpanded: false,
        category_name: 'Item 2',
        subCategory: [
            {id: 3, val: 'Sub 3'},
            {id: 4, val: 'Sub 4'}
        ]
    },
];

const ExpandableComponent = ({item, onClickFunction}) => {
    const [layoutHeight, setLayoutHeight] = useState(0);
    
    useEffect(() => {
        if (item.isExpanded) {
            setLayoutHeight(null);
        }else {
            setLayoutHeight(0)
        }  
    }, [item.isExpanded])

    return(
        <View>
            <Pressable 
                style={styles.item}
                onPress={onClickFunction}
            >
                <Text style={styles.itemText}>
                    {item.category_name}
                </Text>
                <View 
                    style={{
                        height: layoutHeight,
                        overflow: 'hidden'
                    }}
                >
                    {
                        item.subCategory.map((item, key) => (
                            <Pressable
                                key={key}
                                style={styles.content}
                            >
                                <Text style={styles.text}>
                                    {key}. {item.val}
                                </Text>
                                <View style={styles.separator}/>
                            </Pressable>
                        ))
                    }
                </View>
            </Pressable>
        </View>
    )
}

const ExpandableDrawer = () => {
    const [multiSelect, setMultiSelect] = useState(false);
    const [listDataSource, setListDataSource] = useState(CONTENT);

    const updateLayout = (index) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        const array = [...listDataSource];
        if (multiSelect) {
            // if multiple select is enabled
            array[index]['isExpanded'] = !array[index]['isExpanded'];
        } else {
            // if single select is enabled
            array.map((value, placeindex) => 
                placeindex === index
                ? (array[placeindex]['isExpanded'] = !array[placeindex]['isExpanded'])
                : (array[placeindex]['isExpanded'] = false)
            )
        }
        setListDataSource(array)
    }
    return(
        <SafeAreaView style={{flex: 1}}>
            <View style= {styles.container}>
                <View style={styles.header}>
                    <Text style={styles.titleText}>Expandable List View</Text>
                    <Pressable
                        onPress={() => setMultiSelect(!multiSelect)}
                    >
                        <Text style={styles.headerButton}>
                            {
                                multiSelect
                                ? 'Enable Single \n Expand'
                                : 'Enable Multiple \n Expand'
                            }
                        </Text>
                    </Pressable>
                </View>
                <ScrollView>
                    {
                        listDataSource.map((item, key) => (
                            <ExpandableComponent
                                key={item.category_name} 
                                item={item}
                                onClickFunction={()=>{
                                    updateLayout(key)
                                }}
                            />
                        ))
                    }
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        flexDirection: "row",
        padding: 10
    },
    titleText: {
        flex: 1,
        fontSize: 20,
        fontWeight: "bold"
    },
    headerButton: {
        textAlign: 'center',
        justifyContent: 'center',
        fontSize: 16
    },
    item: {
        backgroundColor: 'orange',
        padding: 20
    },
    itemText: {
        fontSize: 16,
        fontWeight: '500',
    },
    content: {
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: '#fff'
    },
    text: {
        fontSize: 16,
        padding: 10
    },
    separator: {
        height: 0.5,
        backgroundColor: '#c8c8c8',
        width: '100%'
    }
})

export default ExpandableDrawer;
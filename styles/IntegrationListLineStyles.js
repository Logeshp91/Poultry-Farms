import { StyleSheet } from 'react-native';

const IntegrationListLineStyles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: '4%'
    },
    iconTouch: {
        position: 'absolute',
        top: 20,
        right: 20,
        alignItems: 'center', 
    },
    iconImage: {
        width: 50,
        height: 50,
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTopColor: '#ccc',
    },
    icondraftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: '#ccc',
    },
    iconWithText: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 140,  
    },
    iconWithTextView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,  
    },
    iconButton: {
        flexDirection: 'row',
        alignItems: 'center',  
        borderColor: 'black', 
        borderRadius: 5,  
        margin: 1,
        borderColor: '#ccc',
    },
    plusicon: {
        position: 'absolute',
        bottom: 10,
        right: 1,
        zIndex: 2, 
    },
    startText: {
        marginLeft: 5,
        fontSize: 13,
        color: '#f6a62e',
    },
    viewText: {
        marginLeft: 5,
        fontSize: 13,
        color: 'green',
        justifyContent:'center'
    },
    setMpinText: {
        fontSize: 16,
        color: 'black',
        marginTop: 5, 
    },
    timeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft:3,
        marginRight:3,
    },
    spacecontainer :{
        marginTop:15
    },
    userInfoContainer: {
        position: 'absolute',
        top: 70,
        right: 5,
        backgroundColor: 'gray',
        padding: 14,
        borderRadius: 30,
        shadowColor: '',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        zIndex: 3, 
        alignItems: 'center'
    },
    userDataText: {
        fontSize: 12,
        color: 'black',
        marginBottom: 1,
    },
    itemContainer: {
        padding: 8,
    },

    item1Container: {
        padding: 7,
        borderWidth:0.3,
        borderRadius:5
    },
    completedContainer: {
        padding: 10,
        backgroundColor: "white",
        borderWidth: 0.5,
        borderColor: '#6bc984',
        shadowColor: "green",
        borderRadius: 10,
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 6,
    },
    runningContainer: {
        padding: 10,
        backgroundColor: "white",
        borderWidth: 0.5,
        borderColor: '#f7867e',
        shadowColor: "red",
        borderRadius: 10,
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 6,
    },
    draftContainer: {
        padding: 10,
        backgroundColor: "white",
        borderWidth: 0.5,
        borderColor: '#f7aa7e',
        shadowColor: "orange",
        borderRadius: 10,
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 6,
    },
    defaultContainer: {
        padding: 10,
        backgroundColor: "white",
        borderWidth: 0.5,
        borderColor: '#ccc',
        shadowColor: "gray",
        borderRadius: 5,
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 6,
    },
    imageContainer: {
        position: 'absolute',
        top: 5,
        right: 8,
        zIndex: 2, 
    },
    image: {
        width: 40,
        height: 40,
    },
    itemText: {
        fontSize: 12,
        color: "black",
        fontWeight:'bold'
    },
    labelText: {
        fontSize: 12,
        color: '#b0acac', 
    },
    errorText: {
        fontSize: 16,
        color: 'red',
    },
    ribbonCompleted: {
        backgroundColor: 'green',
    },
    ribbonRunning: {
        backgroundColor: 'red',
    },
    ribbonDraft: {
        backgroundColor: '#f6a62e',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
    },
});

export default IntegrationListLineStyles;

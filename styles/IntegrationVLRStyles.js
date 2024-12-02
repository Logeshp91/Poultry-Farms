import { StyleSheet } from 'react-native';

const IntegrationVLRStyles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20,
    },
    container1: {
        marginTop: 10,
    },
    header: {
        padding: 5,
        backgroundColor: 'white',
        borderRadius: 5,
        alignSelf: 'center',
        borderWidth: 1, 
        borderColor: '#ccc', 
        width:"95%",
        height:"15%"
    },
    batchName: {
        fontSize: 18,
        fontWeight: 'bold',
        color:'black'
    },
    statutstext:{
        textAlign:"center",
        width:"26%",
    },

    batchDuration: {
        color: '#666',
    },
    batchStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statsText: {
        fontSize: 14,
        color: 'black', 
        marginHorizontal:10    
    },
    runnerText: {
        fontSize: 18,
        color: 'black',
        fontWeight: 'bold',
        
    },
    tabs: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 8,
        marginTop: 25,
    },
    tab: {
        padding: 8,
        borderRadius: 5,
    },
    activeTab: {
        backgroundColor: 'green',
    },
    inactiveTab: {
        backgroundColor: '#dbd9d9',
    },
    activeTabText: {
        color: 'white',
        fontWeight: 'bold',
    },
    inactiveTabText: {
        color: 'black',
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        padding: 16,
        backgroundColor: 'white',
        marginTop: 25,
        marginBottom: 20,       
     borderColor: '#ccc',
        borderRadius: 5,
        alignSelf: 'center',
        width:"93%"
    },
    contentText: {
        alignSelf: 'center',
        marginTop: 10,
        fontSize: 15,
        color: 'black',
        fontWeight:'bold'
    },
    contentlabelText: {
        alignSelf: 'center',
        marginTop: 10,
        fontSize: 15,
        color: '#ccc',
        fontWeight:'bold',
        padding:10
    },
    completedContainer: {
        backgroundColor: "white",
        borderWidth: 0.5,
        borderColor: '#6bc984',
        shadowColor: "green",
        borderRadius: 7,
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 6,
    },
   
    runningContainer: {
        backgroundColor: "white",
        borderWidth: 0.5,
        borderColor: '#f7867e',
        shadowColor: "red",
        borderRadius: 7,
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 6,
    },
    draftContainer: {
        backgroundColor: "white",
        borderWidth: 0.5,
        borderColor: '#f7aa7e',
        shadowColor: "orange",
        borderRadius: 7,
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 6,
    },
    defaultContainer: {
        backgroundColor: "white",
        borderWidth: 0.5,
        borderColor: '#ccc',
        shadowColor: "gray",
        borderRadius: 7,
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 6,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default IntegrationVLRStyles;

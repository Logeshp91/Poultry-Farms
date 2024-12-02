import { StyleSheet } from 'react-native';


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  henContainer: {
    position: 'absolute',
    bottom: 100,
  },
  henStyle: {
    width: 100,
    height: 150,
  },
  iconStyle: {
    width: '100%',
    height: 100,
    resizeMode: 'contain',
  },
  inputContainer: {
    width: '80%',
    backgroundColor: 'rgba(211, 211, 211, 0.5)',
    padding: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: 10,
    zIndex: 1,
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    paddingLeft: 50,
    width: '100%',
    backgroundColor: 'white',
    color:'black'
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
  },
  error: {
    color: 'red',
    marginTop: 5,
  },
  checkboxText: {
    fontSize: 14,
    color: 'black',
  },
  forgotPasswordContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  clickHereText: {
    fontSize: 14,
    color: 'green',
  },
  setmpinText: {
    fontSize:16,
    color: 'blue',
    padding:10
  },
  
});
export default styles;
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',      // centra horizontal
    //justifyContent: 'center',  // centra vertical
    backgroundColor: '#fff',
    padding: 20
    
    
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#0056b8',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  input: {
    width: '80%',
    height: 45,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9',
   
  },

  inputlabel:{
    paddingBottom: 10,
    textAlign: 'left',

  },
  buttonContainer: {
    marginTop: 10,
    width: '90%',
    borderRadius: 8,
    overflow: 'hidden', // asegura que el botón siga el borderRadius
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20
   
  },
  logoHome: {
    width: 100,
    height: 100,
    margin:0,
  },  

header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'gray',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 10,
  },
  userName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  hamburger: {
    color: '#FFD700',
    fontSize: 24,
    fontWeight: 'bold',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
menu: {
  backgroundColor: '#fff',
  padding: 20,
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
},
menuItem: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 12,
},
menuText: {
  fontSize: 16,
  marginLeft: 10,
  color: '#333',
},

  logoutBtn: {
    marginTop: 20,
    backgroundColor: 'red',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
    placeholder: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#888',
  },
  
  
});
export default styles;

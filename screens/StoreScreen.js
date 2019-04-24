import React from 'react';
import {
  Image,
  Platform,
  TouchableHighlight,
  StyleSheet,
  Text,
  View,
  FlatList, 
  Dimensions
} from 'react-native';

import { SearchBar } from 'react-native-elements';

import _ from 'lodash';

import resources from '../data/data.json';


const formatData = (data, numColumns) => {
  const numberOfFullRows = Math.floor(data.length / numColumns);

  let numberOfElementsLastRow = data.length - (numberOfFullRows * numColumns);
  while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
    data.push({ key: `blank-${numberOfElementsLastRow}`, empty: true });
    numberOfElementsLastRow++;
  }

  return data;
};

const numColumns = 3;

class LogoTitle extends React.Component {
  render() {
    return (
     <Text style={styles.headerText}>
      Guitar Shop
     </Text>
    );
  }
}

export default class StoreScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      product: '',
      sender: 'Store',
      query: '',
      products: resources.slice(),
    };
    this.arrayholder = resources.slice();
  }

  static navigationOptions = {
    headerTitle: <LogoTitle />,
  };

  query = text => {
    console.log(text);
  };
  clear = () => {
    this.query.clear();
  };

  renderHeader = () =>{
    return (<SearchBar
      placeholder="Type Here..."
      lightTheme 
      round
      onChangeText={text => this.searchFilterFunction(text)}
      onClear={text => this.searchFilterFunction('')}
      onCancel={text => this.searchFilterFunction('')}
      autoCorrect={false}
      value= {this.state.query}
      platform= "ios"
      containerStyle={styles.searchBar}
      //style={styles.searchBar} 
    />)
  } 

  componentDidMount() 
  {
    var Datastore = require('react-native-local-mongodb'), 
    db = new Datastore({ filename: 'asyncStorageKey', autoload: true });
  }

  _keyExtractor = (item) => item.id;

  renderItem = ({ item }) => {
    const { navigate } = this.props.navigation
    
    if (item.empty === true) {
      return <View style={[styles.item, styles.itemInvisible]}></View>;
    }
    else{
      let modelName;
      if(item.model.length > 30)
      {
        modelName = item.model.slice(0, 25)
        modelName += "..."
      }
      else{
        modelName = item.model;
      }
      return (
        <View style={styles.item}>
          <TouchableHighlight onPress={() => {
            navigate('Details', {product : item, routing : this.state.sender})
            }}>
            <Image
                source={{ uri: item.src }} style={styles.itemPicture}
            />
          </TouchableHighlight>
            <Text style={styles.itemText}>{modelName}</Text>
        </View>
      );
    }
  };

  searchFilterFunction = text => {
      const newData = this.arrayholder.filter(item => {      
        const itemData = `${item.model.toUpperCase()}`;
        
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;    
      });
      console.log("new Data ", newData);
      this.setState({ 
        products: newData,
        query : text,
      }); 
  };
  

  render() {
    const { navigate } = this.props.navigation
    return ( 
          <View style={styles.container}>
          
              <FlatList
                data={formatData(this.state.products, numColumns)}
                style={styles.container}
                renderItem={this.renderItem}
                numColumns={numColumns}
                keyExtractor={this._keyExtractor}
                ListHeaderComponent = {this.renderHeader}
              />
          </View>
    );
  }

 
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    //marginTop: 5,
  },

  headerText: {
    alignItems: "center",
    fontSize: 18,
    marginLeft: 10,
  },

  item: 
  {
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#D5D5D5',
    flex: 1,
    margin: 5,
    //marginTop: 10,
    width: Dimensions.get('window').width / numColumns - 10,
    height: 175,
  },

  itemText: 
  {
    color: '#15150F',
    width: '100%',
    fontSize: 12,
    justifyContent: 'center',
    margin: 5,
  },

  itemPicture: 
  {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'white',
    height: 135,
    width: '100%',
    resizeMode: 'cover',
    backgroundColor: '#FAEEDD',
  },

  itemInvisible: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },

  searchBar : {
    backgroundColor : "#FAFAFA",
    margin: 0,
  }
  
});

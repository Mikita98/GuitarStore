import React from 'react';
import {
  Image,
  Platform,
  TouchableHighlight,
  ScrollView,
  StyleSheet,
  Text,
  View,
  FlatList, 
  Dimensions
} from 'react-native';

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
      sender: 'Store'
    };
  }

  static navigationOptions = {
    headerTitle: <LogoTitle />,
  };

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
    return (
      <View style={styles.item}>
        <TouchableHighlight onPress={() => {
          navigate('Details', {product : item, routing : this.state.sender})
          }}>
          <Image
              source={{ uri: item.src }} style={styles.itemPicture}
          />
        </TouchableHighlight>
          <Text style={styles.itemText}>{item.model}</Text>
          {/* <Text style={styles.itemText}>{item.style}</Text>
          <Text style={styles.itemText}>{item.price}</Text> */}
      </View>
    );
  };

  render() {
    const { navigate } = this.props.navigation

    return ( 
          <View style={styles.container}>
              <FlatList
                data={formatData(resources, numColumns)}
                style={styles.container}
                renderItem={this.renderItem}
                numColumns={numColumns}
                keyExtractor={this._keyExtractor}
              />
          </View>
    );
  }

 
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 5,
  },

  headerText: {
    alignItems: "center",
    fontSize: 18,
  },

  contentContainer: {
    paddingTop: 30,
  },
 
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },

  helpLinkText: {
    fontSize: 14,
    color: '#5F225F',
  },

  item: 
  {
    backgroundColor: '#E5E5DC',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#919191',
    flex: 1,
    margin: 5,
    marginTop: 10,
    width: Dimensions.get('window').width / numColumns,
    height: 175,
  },

  itemText: 
  {
    color: '#15150F',
    width: '100%',
    fontSize: 12,
    justifyContent: 'center',
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
  }

});

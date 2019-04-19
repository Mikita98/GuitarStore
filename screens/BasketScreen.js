import React from 'react';
import { ScrollView, StyleSheet, View, Dimensions, FlatList, Text, Image, TouchableHighlight, SwipeableFlatList} from 'react-native';
import Datastore from 'react-native-local-mongodb';

import resources from '../data/savedData.json';

db = new Datastore({ filename: 'asyncStorageKey', autoload: true });

const tre = [{"model":"Cordoba GK 888365473277","style":"Acoustic",
              "price":"$139.00",
              "src":"https://andertons-productimages.imgix.net/264915-1518794339079.png?w=1000&h=1000&fit=fill&bg=FFFFFF&auto=format&ixlib=imgixjs-3.3.2",
              "id":2,
              "description":"From Rogue comes this amazing deal in the RA-90 dreadnought acoustic guitar. The Rogue guitar is an ideal instrument for the beginner, or young musician. The body depth and width bring out balanced tone and plenty of projection to be heard from across the room.This ultra-affordable dreadnought acoustic guitar features a whitewood body, which brings...",
              "_id":"g8hZDE9CoTqwU3o3"},
              {"model":"Yamaha CGS102A","style":"Acoustic",
              "price":"$119.99",
              "src":"https://www.bettermusic.com.au/media/catalog/product/cache/1/image/1224x/9df78eab33525d08d6e5fb8d27136e95/g/a/gatton_playa_black_front.jpg",
              "id":1,
              "description":"From Rogue comes this amazing deal in the RA-90 dreadnought acoustic guitar. The Rogue guitar is an ideal instrument for the beginner, or young musician. The body depth and width bring out balanced tone andplenty of projection to be heard from across the room.This ultra-affordable dreadnought acoustic guitar features a whitewood body, which brings...","_id":"rUsmOio2qQgGW0bl"}
            ]


export default class BasketScreen extends React.Component {
  constructor(props) {
    super(props);
    console.log('Constructor Called.');
    this.state = {
      sender: 'Basket',
      requestItems: null,
      savedItems: [],
      items: '',
      externalData: null,
      loaded: false,
    };
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  static navigationOptions = {
    title: 'Basket',
  };

  componentWillMount() {
    if (this._asyncRequest) {
      this._asyncRequest.cancel();
    }
  }

  load = () => {
    // db.remove({}, { multi: true }, function (err, numRemoved) {
    // });
    let self = this;
    let temp = [];
    db.find({}, function (err, docs) 
    {
      console.log("Docs: " + JSON.stringify(docs))
      docs.forEach(function(entry) 
      {
        console.log("Each enty" + entry);
        for (let i =0; i < entry.count; i++)
        {
          temp.push(entry)
        }
      }
      );

      self.setState({savedItems : temp })
      self.setState({loaded : true})
    })

  }


  componentDidMount() 
  {
    this.load()
    this.props.navigation.addListener('willFocus', this.load)
  }

  componentWillUnmount() {
    console.log('componentWillUnmount called.');
  }

  componentWillUpdate(nextProp, nextState) {
    console.log('componentWillUpdate called.');
  }
 
  componentDidUpdate(prevProp, prevState) {
    console.log('componentDidUpdate called.');
  }

  _keyExtractor = (item) => item._Id;

  renderItem = ({ item }) => {
    const { navigate } = this.props.navigation

    return (
      <View>
        <TouchableHighlight onPress={() => {
          navigate('Details', {product : item, routing: this.state.sender})
          }}>
          <View style={styles.item}>
              <Image
                  source={{ uri: item.src }} style={styles.itemPicture}
              />
              <View style={styles.itemInfo}> 
                <Text style={styles.itemModel}>{item.model}</Text>
                <Text style={styles.itemPrice}>{item.price}</Text>
              </View> 
          </View>
        </TouchableHighlight>
      </View>
      )};

  

  render() {
    if (this.state.loaded === false)
    {
      return(
      <View><Text>You didn't add anything in your basket</Text></View>
      );
    } 
    else 
    {
      return (
      <View style={styles.container}>
          <FlatList
          data={this.state.savedItems}
          renderItem={this.renderItem}
          keyExtractor={this._keyExtractor}
            />
        {/* <Text>Request model is {this.temp[0].model}</Text> */}
      </View>
    );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: '#fff',
  },

  item: {
    backgroundColor: '#D5D5D5',
    flexDirection: 'row',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: 'grey',
    marginTop: 10,
    marginHorizontal: 5,
  },

  itemInfo: {
    flexDirection: 'column',
    margin: 5,
  },

  itemModel: {
    fontSize: 17,
    fontFamily: 'Roboto',
    marginBottom: 5,
  },

  itemPrice: {
    fontSize: 14,
    color: "#BF1212"
  },

  itemPicture : {
    width: 50,
    height: 50,
    borderRadius: 50 / 2 ,
    borderWidth: 1,
    borderColor: "black",
    margin: 5,
  }

});

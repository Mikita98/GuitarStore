import React from 'react';
import { ScrollView, StyleSheet, View, Alert, Dimensions, FlatList, Text, Image, TouchableHighlight, SwipeableFlatList} from 'react-native';
import Datastore from 'react-native-local-mongodb';
import Swipeout from 'react-native-swipeout'
import withBadge from "../components/withBadge";
import { Icon } from "react-native-elements";

db = new Datastore({ filename: 'asyncStorageKey', autoload: true });

class LogoTitle extends React.Component {
  render() {
    return (
      <Text style={styles.headerText}>
      Basket
      </Text>
    );
  }
}

class FlatListItem extends React.Component{
  constructor(props){
    super(props);
    this.state ={
      activeRowKey: null,
      sender: 'Basket',
    };
  }

  onSwipeOpen (rowIndex) {
    this.setState({
      activeRowKey: rowIndex
    })
    console.log('Opened item is  ' + this.state.activeRowKey)
  }

  onSwipeClose(rowIndex) {
      if (rowIndex === this.state.activeRowKey) {
          this.setState({ rowIndex: null });
          console.log('Closing item is  ')
      }
  }   

  render() 
  {
    const swipeSettings = {
        autoClose:true,
        right : [
          {
            onPress: () => {
                const deletingRow = this.state.activeRowKey;
                let self = this;
                Alert.alert(
                  'Alert',
                  'Are you sure you want to delete ?',
                  [
                    {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                    {text: 'Yes', onPress: () => {
                      db.remove({ _id: self.props.item._id }, {}, function (err, numRemoved) {
                        console.log('Deleting item is ' + JSON.stringify(self.props.item))
                        console.log('Count of deleted ' + numRemoved);
                      });
                      self.props.parentFlatList.refreshFlatList(deletingRow);
                      console.log("Deleting row is " + deletingRow)
                    }},
                  ],
                  {cancelable: true}
                );
            },
            text: 'Delete', type: 'delete'
          }
        ],

        rowId: this.props.index,
        sectionId: 1
    };
    return(
      // <View style={styles.item}>
        <Swipeout {...swipeSettings} onOpen={()=>(this.onSwipeOpen(this.props.item._id))} onClose={()=>(this.onSwipeClose(this.props.item._id))}>
          <View>
            <TouchableHighlight onPress={() => {
                this.props.parentFlatList.navigateToDetails(this.props.item);
              }}>
              <View style={styles.item}>
                  <Image
                      source={{ uri: this.props.item.src }} style={styles.itemPicture}
                  />
                  <View style={styles.itemInfo}> 
                    <Text style={styles.itemModel}>{this.props.item.model}</Text>
                    <Text style={styles.itemPrice}>{this.props.item.price}</Text>
                  </View> 
                  <View style={styles.arrowWrapper}>
                      <Text style={styles.arrow}>&#9655;</Text>
                    </View>
              </View>
            </TouchableHighlight>
          </View>
        </Swipeout>
      // </View>
    )
  }
}


export default class BasketScreen extends React.Component {
  constructor(props) {
    super(props);
    console.log('Constructor Called.');
    this.state = {
      sender: 'Basket',// from which screen navigate
      savedItems: [], // items from db
      items: '',
      loaded: false, // track if items not loaded
      deletedRowKey: null, // number of row need to delete
    };
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: <LogoTitle />,
      tabBarIcon: ({ count, focused }) => (
        <IconWithBadge name={Platform.OS === 'ios' ? 'ios-basket' : 'md-basket'} type="ionicon" size={30} badgeCount={this.state.savedItems.length} focused={focused}></IconWithBadge>
      )
    };
  };

  componentWillMount() {
    if (this._asyncRequest) {
      this._asyncRequest.cancel();
    }
  }

  load = () => { //download items from db
    let self = this;
    let temp = [];
    db.find({}, function (err, docs) 
    {
      if(docs.length === 0)
      {
        console.log("No items in database")
        self.setState({savedItems : temp })
        self.setState({loaded : true})
      }
      else{
        console.log("Docs: " + JSON.stringify(docs))
        docs.forEach(function(entry) 
        {
            temp.push(entry);
        }
        );

        self.setState({savedItems : temp })
        console.log("Load items: " + JSON.stringify(self.state.savedItems))
        self.setState({loaded : true})
      }
    })
    
  }


  componentDidMount() 
  {
    this.load()
    this.props.navigation.addListener('willFocus', this.load)
  }

  _keyExtractor = (item) => item._id;

  refreshFlatList = (deletedKey) => {
    this.setState((prevState) => {
        return {
          deletedRowKey: deletedKey
        };
    });
    this.load();
  }

  navigateToDetails = (item) => {
    this.props.navigation.navigate('Details', {product : item, routing: this.state.sender})
  }

  render() {
    if (this.state.loaded === false)
    {
      return(
        <View><Text>Loading...</Text></View>
      );
    } 
    else 
    {
      if(this.state.savedItems.length === 0)
      {
        return(
        <View><Text>You did not add anything in your wishlist</Text></View>
        );
      }
      else{
        return (
        <View style={styles.container}>
            <FlatList
            data={this.state.savedItems}
            renderItem={({item, index})=>{
              return(
                <FlatListItem item={item} index={index} parentFlatList={this}>

                </FlatListItem>
              )}
            }
            keyExtractor={this._keyExtractor}
            ItemSeparatorComponent={ () => <View style={ { width: 5, height: 3, backgroundColor: '#FAFAFA', borderRadius: 5 } } /> }
              />
        </View>
        );
      }
    }
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: '#FAFAFA',
  },
  item: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
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
    borderColor: 'transparent',
    margin: 5,
  },
  arrowWrapper: {
    height: 50,
    width: 50,
    justifyContent: 'center',
    marginLeft: 70,
    margin:5,
  },
  
  arrow: {
    textAlign: 'center',
    color: 'black',
  },

  headerText: {
    paddingLeft: 10,
    alignItems: "center",
    fontSize: 18,
  },
});
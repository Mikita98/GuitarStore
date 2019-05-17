import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, Picker, AsyncStorage } from 'react-native';
import Datastore from 'react-native-local-mongodb';

db = new Datastore({ filename: 'asyncStorageKey', autoload: true });

class LogoTitle extends React.Component {
  render() {
    return (
      <Text style={styles.headerText}>
      Product details
     </Text>
    );
  }
}

export default class DetailsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      product: props.navigation.state.params.product,
      productCount: 1,
      routing: props.navigation.state.params.routing,
      savedItems: [],
    };
  }
  
  static navigationOptions = {
    headerTitle: <LogoTitle />,
  };

  render() {

    switch(this.state.routing) {
      case 'Store':  
        return (<View style={styles.container}>
          <View style={styles.mainView}>
            <Image source={{ uri: this.state.product.src }} style={styles.productPicture}/>
            <View style={styles.mainInfo}>
              <View  style={styles.productModelAndType}>
                <Text style={styles.productModelText}>{this.state.product.model}</Text>
                <Text style={styles.productTypeText}>{this.state.product.style}</Text>
              </View>
              <Text style={styles.productPriceText}>{this.state.product.price}</Text>
            </View>
          </View>
          <View style={styles.buttonsView}>
            <TouchableOpacity style={styles.basketButton} activeOpacity={0.5} onPress={() => {
              let saveItem = this.props.navigation.state.params.product;
              //let countOfProd = this.state.productCount;
              db.update({ id: saveItem.id }, { $inc: { count: Number(this.state.productCount) } }, {}, function (err, numReplaced, affectedDocuments) {
                console.log('Count of updating ',  numReplaced)
                console.log('Updating docs ', affectedDocuments);
              });
              }}>
              <Image style={styles.imageIconStyle} source={require('../assets/images/basket.png')}></Image>
              <Text style={styles.basketButtonText}>Add to basket</Text>
            </TouchableOpacity>
            <View style={styles.pickerContainer}>
              <Picker style={styles.picker}
                selectedValue={this.state.productCount}
                itemStyle={styles.pickerItem}
                onValueChange={(itemValue) => this.setState({productCount: itemValue})}>
                <Picker.Item label="1" value='1' />
                <Picker.Item label="2" value='2' />
                <Picker.Item label="3" value='3' />
                <Picker.Item label="4" value='4' />
                <Picker.Item label="5" value='5' />
                <Picker.Item label="6" value='6' />
                <Picker.Item label="7" value='7' />
                <Picker.Item label="8" value='8' />
                <Picker.Item label="9" value='9' />
                <Picker.Item label="10" value='10' />
              </Picker>
              <View style={styles.arrowWrapper}>
                <Text style={styles.arrow}>&#9660;</Text>
              </View>
            </View>
          </View>
          <View>
          <View style={styles.descriptionView}>
              <Text style={styles.descriptionHeader}>Description</Text>
              <Text style={styles.descriptionText}>{this.state.product.description}</Text>
          </View>
          </View>
          </View>);
          break;
      
        case 'Basket':  
          return (<View style={styles.container}>
            <View style={styles.mainView}>
              <Image source={{ uri: this.state.product.src }} style={styles.productPicture}/>
              <View style={styles.mainInfo}>
                <View  style={styles.productModelAndType}>
                  <Text style={styles.productModelText}>{this.state.product.model}</Text>
                  <Text style={styles.productTypeText}>{this.state.product.style}</Text>
                </View>
                <Text style={styles.productPriceText}>{this.state.product.price}</Text>
              </View>
            </View>
            <View style={styles.descriptionView}>
              <Text style={styles.descriptionHeader}>Description</Text>
              <Text style={styles.descriptionText}>{this.state.product.description}</Text>
            </View>
            </View>);
        break
    
      default:
        return (<View style={styles.container}>
          <View style={styles.mainView}>
            <Image source={{ uri: this.state.product.src }} style={styles.productPicture}/>
            <View style={styles.mainInfo}>
              <View  style={styles.productModelAndType}>
                <Text style={styles.productModelText}>{this.state.product.model}</Text>
                <Text style={styles.productTypeText}>{this.state.product.style}</Text>
              </View>
              <Text style={styles.productPriceText}>{this.state.product.price}</Text>
            </View>
          </View>
          <View style={styles.descriptionView}>
              <Text style={styles.descriptionHeader}>Description</Text>
              <Text style={styles.descriptionText}>{this.state.product.description}</Text>
            </View>
          </View>);
        break;
    }
  }
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    width: Dimensions.get('window').width,
    flexDirection: 'column',
  },

  mainView:{
    width: '100%',
    height: '40%',
    flexDirection: 'row',
    marginTop: 10,
    height: 200,
    marginBottom: 10,
  },

  headerText: {
    alignItems: "center",
    fontSize: 18,
  },

  productModelAndType:{
    width: '100%',
    flexDirection: 'column',
    marginBottom: 20,
  },

  buttonsView:{
    width: '100%',
    flexDirection: 'row',
    marginBottom: 10,
  },

  basketButton:{
    width: 135,
    flexDirection: 'row',
    borderWidth: 0.5,
    borderColor: '#fff',
    height: 40,
    borderRadius: 5,
    margin: 5,
    backgroundColor: '#4d88ff',
  },

  basketButtonText: {
    color: '#fff',
    marginTop: 10,
    marginHorizontal: 5,
    marginBottom:5,
    alignItems: "center",
  },

  productModelText:{
    fontSize: 16,
    fontFamily: 'Roboto',
    marginBottom: 5,
  },

  imageIconStyle: {
    width: 25,
    height: 25,
    margin: 5,
    resizeMode: 'cover',
  },

  productPriceText:{
    fontSize: 20,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    color: 'red',
  },

  productTypeText:{
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'sans-serif-medium',
    width: '100%',
    margin: 0,
  },

  mainInfo:{
    width: '50%',
    height: '100%',
    flexDirection: 'column',
  },

  productPicture: 
  {
    height: '100%',
    width: '45%',
    resizeMode: 'cover',
    backgroundColor: '#3CAA3C',
    borderColor: '#d9d9d9',
    borderRadius: 10,
    paddingVertical: 3,
    borderWidth: 1,
    marginLeft: 5,
    marginRight: 5,
  },
  
  pickerContainer: {
    margin: 5,
    //flex: 1,
    width: 90,
    height: 40,
    flexDirection: 'row',
    //backgroundColor: 'green',
    // margin: 5,
    // marginLeft: 10,
    // width: 60,
    // height: 40,
    borderColor: 'grey',
    borderWidth: 1,
    borderRadius: 5,
    //backgroundColor: '#EBEBE5',
    // height: 40,
    // color: '#E9E2E2',
    // alignItems: 'center',
  },

  picker: {
    backgroundColor: 'white',
    width: "60%",
    marginLeft:4,
    marginTop:2,
    height: "95%",
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    borderColor: 'white',
  },

  pickerItem: {
    height: 40,
    color: 'red',
    textAlign: 'center',
  },
  
  arrowWrapper: {
    backgroundColor: '#E5EEF5',
    height: "98%",
    width: "35%",
    justifyContent: 'center',
    borderRadius: 5,
    borderColor: 'white',
  },
  
  arrow: {
    textAlign: 'center',
    color: 'black',
  },

  descriptionView: {
    flexDirection: 'column',
    margin: 5,
  },

  descriptionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'normal',
  },

  descriptionText: {
    textAlign: 'auto',
    fontSize: 14,
    fontFamily: 'Roboto',
    fontWeight: 'normal',
  }
});
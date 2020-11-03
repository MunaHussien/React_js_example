import React from 'react';
import { withNavigation } from 'react-navigation';
import Modal from 'react-native-modalbox';
import {
  View, TextInput, StyleSheet, Image, TouchableWithoutFeedback,
  ScrollView,
  Dimensions,
  Alert,
  TouchableOpacity,
  BackHandler,
  Platform,
  Switch,
} from 'react-native';
import { Block, Checkbox, Text, Button as GaButton, theme, Input } from 'galio-framework';
import Button from './Button';
import { Fab, Right, Left, Icon } from 'native-base';
import { nowTheme } from '../constants';
import Global from '../screens/global';
import PDFReader from 'rn-pdf-reader-js'
import * as ImagePicker from 'expo-image-picker';
import { Formik } from 'formik';
import * as DocumentPicker from 'expo-document-picker';

const { width, height } = Dimensions.get('screen');
const initialValues = {
  title: '',
  image: ''
}
export default class AddDocument extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      feedback: [],
      ImageSource: null,
      data: null,
      Image_TAG: 'tttt',
      ImageUri: null,
      ResultFront: null,
      ResultBack: null,
      DocuName: '',
      CateId: 1,
      PdfFile: null,
      switchValue: true

    };
  }
  toggleSwitch = (value) => {
    this.setState({ switchValue: value })

  }
  showAddModal = (CateId1, flatlistItem) => {
    this.setState({
      CateId: CateId1,
    });
    this.refs.modal7.open();
  }
  async onSubmit(values) {
    if (this.state.DocuName == '') {
      alert('enter document name')
    }
    else {

      let formDataB = new FormData();
      formDataB.append('CateId', this.state.CateId);
      formDataB.append('DocuName', this.state.DocuName);
      formDataB.append('FileType', this.state.switchValue ? 'Pdf' : 'Image');
      if (this.state.switchValue) {
        if (this.state.PdfFile != null) {
          let ResultPdf = this.state.PdfFile;
          let localUri = ResultPdf.uri;
          let PdfName = localUri.split('/').pop();
          let match1 = /\.(\w+)$/.exec(PdfName);
          let type = match1 ? `image/${match1[1]}` : `image11`;
          formDataB.append('PdfName', PdfName);
          formDataB.append('photo', { uri: localUri, name: PdfName, type });
          await fetch(Global.Global.Url + '/archive/UploadFile.php', {
            method: 'POST',
            body: formDataB,
            headers:
              {
                'Accept': 'application/json',
              },
          });
          this.setState({
            PdfFile: null
          });
          this.closeModal();
        }
        else alert('please select file')
      }
      else {
        let Resultf = this.state.ResultFront;
        let ResultB = this.state.ResultBack;

        let localUri = Resultf.uri;
        let filenameF = localUri.split('/').pop();
        let match1 = /\.(\w+)$/.exec(filenameF);
        let type = match1 ? `image/${match1[1]}` : `image11`;

        let localUriB = ResultB.uri;
        let filenameB = localUriB.split('/').pop();
        let matchB = /\.(\w+)$/.exec(filenameB);
        formDataB.append('photo', { uri: localUri, name: filenameF, type });
        formDataB.append('photo1', { uri: localUriB, name: filenameB, type });
        formDataB.append('ImageFront', filenameF);
        formDataB.append('ImageBack', filenameB);
        await fetch(Global.Global.Url + '/archive/UploadFile.php', {
          method: 'POST',
          body: formDataB,
          headers:
            {
              'Accept': 'application/json',
            },
        });
        this.closeModal();
      }
    
    }
  }
  closeModal() {
    this.refs.modal7.close();
    this.props.parentFlatList.onRefresh();
  }
  async _pickImagefront(handleChange) {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3]
    })
    console.log(result)
    if (!result.cancelled) {
      this.setState({
        ResultFront: result
      })
      //this.state.ResultFront=result;
      handleChange(result.uri)
    }
  }
  async _pickImage(handleChange) {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3]
    })
    console.log(result)
    if (!result.cancelled) {
      if (!result.cancelled) {
        this.setState({
          ResultBack: result
        })
        handleChange(result.uri)
      }
    }
  }
  async _pickDocument(handleChange) {
    let result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });
    console.log(result);

    if (!result.cancelled) {
      if (!result.cancelled) {
        this.setState({
          PdfFile: result
        })
        handleChange(result.uri)
      }
    }
  }
  render() {
    const thumbColor =
      Platform.OS === "ios"
        ? nowTheme.COLORS.PRIMARY
        : Platform.OS === "android" && true
          ? nowTheme.COLORS.SWITCH_ON
          : nowTheme.COLORS.SWITCH_OFF;
    {
      return (

        <Modal
          ref={'modal7'}
          style={styles.modal}
          position={'center'}>
          <Formik
            initialValues={initialValues}
            onSubmit={this.onSubmit.bind(this)}>
            {({ handleChange, handleChangefront, handleSubmit, values }) => (

              <Block center width={width * 0.9} flex style={styles.modal1} >
                <Block center width={width * 0.8} style={{ marginBottom: 15 }}>
                  <Input
                    placeholderTextColor={nowTheme.COLORS.WHITE}
                    placeholder="Document Name"
                    style={styles.inputs}
                    fontFamily="serif"
                    onChangeText={(text) => this.setState({ DocuName: text })}

                  />
                  <Block row middle space="between" style={styles.switch}>
                    <Text
                      style={{ fontFamily: 'serif' }}
                      size={16}
                      color={nowTheme.COLORS.WHITE}
                    >
                      {this.state.switchValue ? 'Pdf' : 'Image'}
                    </Text>
                    <Switch
                      onValueChange={this.toggleSwitch}
                      value={this.state.switchValue}
                      thumbColor={[
                        this.state.switchValue === true
                          ? nowTheme.COLORS.SWITCH_ON
                          : nowTheme.COLORS.PRIMARY1
                      ]}
                      ios_backgroundColor={"#D8D8D8"}
                      trackColor={{
                        true: "#d3d3d3",

                        false: Platform.OS == "ios" ? "#d3d3d3" : "#D8D8D8"
                      }}
                    />
                  </Block>
                </Block>
                {!this.state.switchValue ?
                  <Block width={width * 0.8} style={{ marginBottom: 13 }}>
                    <Block width={width * 0.8} style={{ marginBottom: 13 }}>
                      <Block center
                        style={styles.CardImage}>
                        {values.image1 && values.image1.length > 0 ?
                          <Image source={{
                            uri:
                              values.image1
                          }} style={styles.imageStyle} /> : null}
                        {!values.image.length > 0 ?
                          <Text
                            style={{
                              marginTop: 10,
                              fontFamily: 'serif',
                              textAlign: 'center'
                            }}
                            color={nowTheme.COLORS.WHITE}
                            size={16} >
                            Front Side
                      </Text> : null}
                        <Fab direction="Right" position="bottomLeft"
                          style={{ backgroundColor: nowTheme.COLORS.INFO }}
                          onPress={() => { this._pickImagefront(handleChange('image1')) }}
                        >
                          <Icon name="image" />
                        </Fab>
                      </Block>
                    </Block>
                    <Block width={width * 0.8} style={{ marginBottom: 13 }}>
                      <Block center
                        style={styles.CardImage}
                      >
                        {values.image && values.image.length > 0 ?
                          <Image source={{
                            uri:
                              values.image
                          }} style={styles.imageStyle} /> : null}
                        {!values.image.length > 0 ?
                          <Text
                            style={{
                              marginTop: 10,
                              fontFamily: 'serif',
                              textAlign: 'center'
                            }}
                            color={nowTheme.COLORS.WHITE}
                            size={16} >
                            Back Side
                      </Text> : null}
                        <Fab direction="Right" position="bottomLeft"
                          width={30}
                          height={50}
                          style={{ backgroundColor: nowTheme.COLORS.INFO }}
                          onPress={() => { this._pickImage(handleChange('image')) }}>
                          <Icon name="image"
                            size={20} />
                        </Fab>
                      </Block>
                    </Block>
                  </Block>
                  :
                  <Block width={width * 0.8} style={{ marginBottom: 7 }}>
                    <Block center
                      style={styles.cotiner_pdf}
                    >
                      {values.image && values.image.length > 0 ?
                        <PDFReader source={{
                          uri:
                            values.image
                        }} style={styles.pdfStyle} /> : null}
                      {!values.image.length > 0 ?
                        <Text
                          style={{
                            marginTop: 10,
                            fontFamily: 'serif',
                            textAlign: 'center'
                          }}
                          color={nowTheme.COLORS.WHITE}
                          size={16} >
                          Pdf File
                  </Text> : null}
                      <Fab direction="Right" position="bottomLeft"
                        width={30}
                        height={50}
                        style={{ backgroundColor: nowTheme.COLORS.INFO }}
                        onPress={() => { this._pickDocument(handleChange('image')) }}>
                        <Icon name="document"
                          size={20} />
                      </Fab>
                    </Block>
                  </Block>
                }
                <Block center width={width * 0.8} style={{ marginBottom: 5 }}>
                  <Button color="info" round style={styles.createButton}
                    onPress={handleSubmit}>
                    <Text
                      style={{ fontFamily: 'serif' }}
                      size={14}
                      color={nowTheme.COLORS.WHITE}
                    >
                      Save
                </Text>
                  </Button>
                </Block>
              </Block>
            )}
          </Formik>
        </Modal>

      );
    }
  }
}
const styles = StyleSheet.create({

  modal: {
    marginTop: 30,
    height: 550,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: '#0000000e',
    shadowColor: nowTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    zIndex: 9,

  },
  modal1: {

    backgroundColor: '#00000081',
    borderRadius: 10,
    shadowColor: nowTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
  },
  createButton: {
    width: width * 0.6,
    marginTop: 7,
    marginBottom: 20,
  },
  added: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'column',

  },
  inputIcons: {
    marginRight: 12,
    color: nowTheme.COLORS.WHITE
  },
  inputs: {
    color: nowTheme.COLORS.WHITE,
    backgroundColor: 'rgba(0, 0, 0, 0.0)',
    borderColor: '#E3E3E3',
    borderRadius: 0,
    fontFamily: "serif",
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 1,
    borderTopWidth: 0,
    fontSize: 22,

  },
  switch: {
    width: width - theme.SIZES.BASE * 4,
    height: theme.SIZES.BASE * 3,
    shadowRadius: 4,
    borderRadius: 100,
    shadowOpacity: 3,
    marginBottom: 15,
    borderColor: '#E3E3E3',
    borderWidth: 1,
    paddingHorizontal: 10
  },
  CardImage: {
    height: 150,
    backgroundColor: 'rgba(0, 0, 0, 4.0)',
    borderColor: '#E3E3E3',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'column',
    borderRadius: 9,
    width: width * .7,

  },
  cotiner_pdf: {
    height: 350,
    backgroundColor: 'rgba(0, 0, 0, 4.0)',
    borderColor: '#E3E3E3',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'column',
    borderRadius: 9,
    width: width * .7,
  },
  pdfStyle: {
    height: 350,
    width: width * .7,
    marginTop: 1,
    marginBottom: 1,
    borderRadius: 9,
  },
  imageStyle: {
    height: 150,
    width: width * .7,
    marginTop: 1,
    marginBottom: 1,
    borderRadius: 9,
  }
});

//export default AddDocuments;


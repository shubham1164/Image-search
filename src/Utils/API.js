import Constants from '../Utils/Constants.js';
import base64 from 'react-native-base64'

const API = {

  // <editor-fold desc="Image Search">
  getImages: async function(text, page){
    var returnObject = {
      success: '0'
    };
    try {
      // set {0} - SearchText, {1} - page number, {2} - per_page_count
      const url = Constants.ImageApiUrl
      .replace('{0}', text)
      .replace('{1}', page)
      .replace('{2}', Constants.PerPageCount);
      const response = await this.getFromServer(url);
      returnObject = response;
    } catch(e){
      console.warn("err10001: ", e.message);
    }
    return returnObject;
  },
  // </editor-fold>

  getFromServer: async function(url){
    var returnObject = {
      success: "0"
    };
    try {
      const encodedURL = encodeURI(url)
      //console.warn("API1: ", encodedURL);
      const response = await fetch(encodedURL, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          "Authorization": "Basic " + base64.encode(Constants.ConsumerKey + ':' + Constants.ConsumerSecret),
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': 0
        }
      });
      returnObject = (await response.json());
      //console.warn("API0: ", returnObject);
    } catch(e){
      console.warn("err20282: ", e.message);
    }
    return returnObject;
  },
}

export default API;

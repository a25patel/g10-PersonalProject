module.exports = {
  hexValues: function (indexImageURL, result){
    var array = [];
    if (!result){
      array.push('Please insert an image!')
    } else if (result && result['tags']){
        for (i = 0; i < result['tags'].length; i++ ){
          array.push(result['tags'][i].color);
        }
    }else {
      array.push('Sorry this image is too big to extract color from! ( < 8192 X 8192 )');
    }
    return array;
  }
};

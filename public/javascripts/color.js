module.exports = {
  hexValues: function (indexImageURL, result){
    console.log(result);
    var array = [];
    if (result){
      for (i = 0; i < result.length; i++ ){
        array.push(result[i].color);
      }
    } else {
      array.push('Sorry this image is too big to extract color from!');
    }
    return array;
  }
};

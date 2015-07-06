// var sort = document.getElementById('sort');
// var range = document.getElementById('range');
//
// range.addEventListener('change', function() {
//   console.log('hello');
//
//   // XML request
//   var xhr = new XMLHttpRequest();
//   xhr.open('post', '/getPalette', 'false');
//   xhr.setRequestHeader("Content-type", "application/JSON");
//   // xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
//   console.log(xhr.response, 'ahhhhh');
//
//
//   var params = 'image=' + document.getElementById('homeImageURL').value + '&sort=' + document.getElementById('sort').value + '&range=' + document.getElementById('range').value;
//   // xhr event listener
//   xhr.addEventListener('load', function(){
//     var response = xhr.response;
//     var responseData = JSON.parse(response);
//   });
//   xhr.send(params);
//
// });

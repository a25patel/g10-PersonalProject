// ADD EVENT LISTENER Preview results

var imageThumbnail = document.getElementById('imageThumbnail');
var url = document.getElementById('homeImageURL');

url.addEventListener('change', function() {
  imageThumbnail.src = url.value;
  console.log('hello');
});

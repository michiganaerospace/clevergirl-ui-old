const FILESTACK_API_KEY = 'AXBTBOr7EThGlfby8YdaLz';

function showMenu() {
  document.getElementById('SmAppNav').style.visibility = 'visible';
}

function hideMenu() {
  document.getElementById('SmAppNav').style.visibility = 'hidden';
}

function openFilePicker() {
  const client = filestack.init(FILESTACK_API_KEY);
  return client;
}

function compileImageList(imagesUploaded) {
  let len = imagesUploaded.length;
  let imageList = [];
  for (let i = 0; i < len; i++) {
    let image = {};
    let curImg = imagesUploaded[i];
    image.url = curImg.url;
    image.handle = curImg.handle;
    image.filename = curImg.filename;
    image.size = curImg.size;
    image.mimetype = curImg.mimetype;
    image.source = curImg.source;
    imageList.push(image);
  }
  return imageList;
}

export {openFilePicker, compileImageList, showMenu, hideMenu};

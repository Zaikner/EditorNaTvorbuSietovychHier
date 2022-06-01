function getDataUrlFromImage(img:HTMLImageElement) {

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
  
    canvas.width = img.width;
    canvas.height = img.height;

    ctx!.drawImage(img, 0, 0);
    return canvas.toDataURL('image/jpeg');
 }
 function getCookie(name:string) {
    let cookie = new Map();
    document.cookie.split(';').forEach(function(el) {
      let [k,v] = el.split('=');
      let key:string = k.trim()
      cookie.set(key,v);
    })
    return cookie.get(name);
  }


export {getDataUrlFromImage,getCookie}
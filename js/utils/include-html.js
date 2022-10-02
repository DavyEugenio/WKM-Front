includeHTML();
function includeHTML() {
    var z, i, elmnt, file, xhr;
    z = document.getElementsByTagName("*");
    for (i = 0; i < z.length; i++) {
      elmnt = z[i];
      file = elmnt.getAttribute("include-html");
      if (file) {
        xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
          if (this.readyState == 4) {
            if (this.status == 200) {
              let cont = (new DOMParser()).parseFromString(this.responseText, "text/html").body.children[0],
              parent = elmnt.parentNode;
              parent.insertBefore(cont, elmnt);
            }
            if (this.status == 404) {elmnt.innerHTML = "Page not found.";}
            elmnt.remove();
            includeHTML();
          }
        }
        xhr.open("GET", file, true);
        xhr.send();
        return;
      }
    }
  }
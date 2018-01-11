const app = {
  DATA: null,
  init: function () {
    //fetch the data
    app.getData();
    //add event listeners 
    app.addListeners();
    //fix the current url
    history.replaceState({}, "List", "#list");
    document.title = 'List of Items';
  },
  addListeners: function () {
    //back button on second page
    let backBtn = document.querySelector('#details-page header a');
    backBtn.addEventListener('click', app.backHome);
    //listen for the browser back button
    window.addEventListener('popstate', app.browserBack);
  },
  getData: function () {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', './js/data.json');
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        console.log(xhr.status, xhr.statusText);
        app.DATA = JSON.parse(xhr.responseText);
        console.log(app.DATA);
        //pass the data to a function that builds the first page  
        app.showThings();
      }
    }
    xhr.send(null);
  },
  showThings: function () {
    //loop through the array and display the cards
    //add the click listener on each title
    let content = document.getElementById('primary');
    content.appendChild(app.cardBuilder(app.DATA.cars));
        let titles = document.querySelectorAll('#list-page .item-card');
            [].forEach.call(titles, (h2) => {
          h2.addEventListener('click', app.navDetails);
        });
  },
    
  cardBuilder: function (arr) {
    let df = new DocumentFragment();
    arr.forEach((car) => {
      let card = document.createElement("div");
      card.className = "item-card";
      let img = document.createElement("img");
      img.src = car.imgURL;
      img.className = "icon";
      img.alt = car.Name + " Car";
      let title = document.createElement("h2");
      title.className = "item-title";
      title.setAttribute("data-key", car.ID)
      title.textContent = car.Name;
      let info = document.createElement("p");
      info.className = "item-desc";
      info.textContent = car.Info;
      card.appendChild(img);
      card.appendChild(title);
      card.appendChild(info);
      df.appendChild(card);
    })
    return df;
  },
  navDetails: function (ev) {
    ev.preventDefault();
    window.scrollTo(0, 0);
    let h2 = ev.currentTarget.querySelector('h2');
    //extract the id from the heading
    let id = h2.getAttribute('data-key');
    //change the url and save the id in the history.state
    console.log(`#details/${id}`);
    history.pushState({
      "id": id
    }, "Details", `#details/${id}`);
    document.title = `Details for Item ${id}`;
    //get the info about this item
    let obj = app.getItem(id);
    //pass it to a function to display those details
    app.showDetails(obj);
  },
    
    getItem: function (id) {
    //retrieve an object from our JSON data
    //where the id matches the one passed to this function
    return app.DATA.cars[parseInt(id)-1];
  },
  showDetails: function (obj) {
    //navigate to the second page
    document.getElementById('list-page').classList.remove('active');
    document.getElementById('details-page').classList.add('active');
    //set the title of the selected property
    let span = document.querySelector('.details-title');
    span.textContent = obj.Name;
    let section = document.getElementById('secondary');
    section.innerHTML = "";
    let p = document.createElement("p");
    p.textContent = obj.Price;
    p.className = "price";
    section.appendChild(p);
    let table = document.createElement("table");
    let caption = document.createElement("caption");
    caption.textContent = "Additional Information";
      let cdv = document.createElement('div');
      cdv.classList.add('table-container');
    table.appendChild(caption);
    let additional = obj.additional;
    for(prop in additional){
      let tr = document.createElement("tr");
      let th = document.createElement("th");
      th.textContent = prop;
      let td = document.createElement("td");
      td.textContent = additional[prop];
      tr.appendChild(th);
      tr.appendChild(td);
      table.appendChild(tr);
    }
      section.appendChild(cdv);
    section.appendChild(table);
    //loop through the obj properties with a for in loop
    //create some HTML for each property...
  },
  backHome: function (ev) {
    if (ev) {
      ev.preventDefault();
      //only add to the pushState if the user click OUR back button
      //don't do this for the browser back button
      history.pushState({}, "List", `#list`);
      document.title = 'List of Items';
    }
    document.getElementById('list-page').classList.add('active');
    document.getElementById('details-page').classList.remove('active');
  },
  browserBack: function (ev) {
    console.log('user hit the browser back button');
    //the browser will change the location hash.
    //use the updated location.hash to display the proper page
    if (location.hash == '#list') {
      console.log('show the list page');
      //we want to show the list page
      app.backHome();
      //NOT passing the new MouseEvent('click')
    } else {
      //we want to display the details
      console.log('show the details');
      let id = location.hash.replace("#details/", "");
      //use the id number from the hash to fetch the proper data
      let obj = app.getItem(id);
      //pass it to a function to display those details
      app.showDetails(obj);
    }
  }
}

let loadEvent = ('deviceready' in document) ? 'deviceready' : 'DOMContentLoaded';
document.addEventListener(loadEvent, app.init);

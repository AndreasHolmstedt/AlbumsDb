window.onload = function () {
    let addAlbumButton = document.getElementById("addAlbumButton");
    let albumsDiv = document.getElementById("albums");
    let searchField = document.getElementById("searchField");
    let offlineDb = [];
    let changePressed = false;
    let showFrom = 0;
    let showTo = 10;
    let searchList = []
    let banner = document.getElementById("banner");
    let descOrder = true;

    let db = firebase.database()

    let sortBy = "artist";

    document.getElementById("sortByArtistButton").addEventListener("click", function () {
        showFrom = 0;
        showTo = 10;
        this.style.opacity = ".7";
        document.getElementById("sortByTitleButton").style.opacity = "1";
        document.getElementById("sortByYearButton").style.opacity = "1";
        sortByArtist();
    });
    document.getElementById("sortByTitleButton").addEventListener("click", function () {
        showFrom = 0;
        showTo = 10;
        this.style.opacity = ".7";
        document.getElementById("sortByArtistButton").style.opacity = "1";
        document.getElementById("sortByYearButton").style.opacity = "1";
        sortByTitle();
    });
    document.getElementById("sortByYearButton").addEventListener("click", function () {
        showFrom = 0;
        showTo = 10;
        this.style.opacity = ".7";
        document.getElementById("sortByTitleButton").style.opacity = "1";
        document.getElementById("sortByArtistButton").style.opacity = "1";
        sortByYear();
    });

    document.getElementById("nextButton").addEventListener("click", function () {
        window.scrollTo(0, 0);
        if (searchList.length > 0) {
            if ((showTo + 10) > searchList.length) {
                    this.style.opacity = ".3";
                }
            if (showTo > searchList.length) {
                return;
            }
            
        }
        if (showTo < offlineDb.length) {
            if ((showTo + 10) > offlineDb.length) {
                this.style.opacity = ".3";
            }
            document.getElementById("previousButton").style.opacity = "1";
            showFrom += 10;
            showTo += 10;
            writeOfflineDb();
           
        } else {
            return;
        }
    });

    document.getElementById("ascending").addEventListener("click", function () {
        this.style.opacity = ".5";
        document.getElementById("descending").style.opacity = "1";
        descOrder = false;
        if (sortBy == "artist"){
            sortByArtist();
        }
        if (sortBy == "title"){
            sortByTitle();
        }
        if(sortBy == "year"){
            sortByYear();
        }
        writeOfflineDb();
    });

    document.getElementById("descending").addEventListener("click", function () {
        this.style.opacity = ".5";
        document.getElementById("ascending").style.opacity = "1";
        descOrder = true;
        if (sortBy == "artist"){
            sortByArtist();
        }
        if (sortBy == "title"){
            sortByTitle();
        }
        if(sortBy == "year"){
            sortByYear();
        }
         writeOfflineDb();
    });

    document.getElementById("previousButton").addEventListener("click", function () {
        window.scrollTo(0, 0);


        if (showFrom > 0) {

            document.getElementById("nextButton").style.opacity = "1";
            showFrom -= 10;
            showTo -= 10;
            if (showFrom == 0) {
                this.style.opacity = ".3";
            }
            writeOfflineDb();
        } else {
            return;
        }
    });

    document.getElementById("search").addEventListener("click", function () {
        searchField.value = "";
        writeOfflineDb();
        this.style.opacity = "0";
    });

    searchField.addEventListener("input", function () {
        document.getElementById("search").style.opacity = "1";
        searchForString();
    })

    let fetchFromDb = function () {
        offlineDb = [];
        while (albumsDiv.firstChild) {
            albumsDiv.removeChild(albumsDiv.firstChild);

        }
        db.ref("/Albums").on("child_added", function (snapshot) {
            offlineDb.push(snapshot);
            writeOfflineDb()
        });
        
        



    }






    // OPEN ADD ALBUM WINDOW
    addAlbumButton.addEventListener("click", function () {
        document.getElementById("addAlbumScreen").style.zIndex = "10";
        document.getElementById("addAlbumScreen").style.opacity = "1";

        document.getElementById("addAlbumView").style.display = "block";
        document.getElementById("thanksView").style.display = "none";
    });

    // CLOSE ADD ALBUM WINDOW
    document.getElementById("closeAdd").addEventListener("click", function () {
        document.getElementById("addAlbumScreen").style.zIndex = "-1";
        document.getElementById("addAlbumScreen").style.opacity = "0";
    });


    //ALL FIELDS ENTERED CORRECLY ? GO TO ADD FUNCTION : GIVE ERROR MESSAGE
    document.getElementById("addButton").addEventListener("click", function (evt) {
        let artistInput = document.getElementById("artistInput");
        let titleInput = document.getElementById("titleInput");
        let yearInput = document.getElementById("yearInput");
        let linkInput = document.getElementById("linkInput");
        let albumData = {}

        if (artistInput.value == "") {
            artistInput.style.border = "1px solid red";
            artistInput.placeholder = "please add an Artist Name";

        } else {
            artistInput.style.border = "1px solid black";
            artistInput.placeholder = "";
        }

        if (titleInput.value == "") {
            titleInput.style.border = "1px solid red";
            titleInput.placeholder = "Please add an Album Title";

        } else {
            titleInput.style.border = "1px solid black";
            titleInput.placeholder = "";
        }

        if (yearInput.value == "" ||
            isNaN(yearInput.value) ||
            yearInput.value.length < 4 ||
            yearInput.value.length > 4) {

            yearInput.value = "";
            yearInput.style.border = "1px solid red";
            yearInput.placeholder = "Please add a Year of Release in 4 numbers."

        } else {
            yearInput.style.border = "1px solid black";
            yearInput.placeholder = "";
        }

        if (linkInput.value == "") {
            linkInput.style.border = "1px solid red";
            linkInput.placeholder = "Please add a link to Spotify";
        } else {
            linkInput.style.border = "1px solid black";
            linkInput.placeholder = "";
        }

        if (artistInput.value != "" &&
            titleInput.value != "" &&
            yearInput.value != "" &&
            !isNaN(yearInput.value) &&
            yearInput.value.length == 4 &&
            linkInput.value != ""
        ) {

            albumData.artist = artistInput.value;
            albumData.title = titleInput.value;
            albumData.year = yearInput.value;
            albumData.link = linkInput.value;

            addAlbum(albumData);
            fetchFromDb();

            document.getElementById("addAlbumView").style.display = "none";
            document.getElementById("thanksView").style.display = "flex";

            artistInput.value = "";
            titleInput.value = "";
            yearInput.value = "";
            linkInput.value = "";


        }



    });

    // GO BACK TO VIEW ALBUMS AFTER ALBUM IS ADDED
    document.getElementById("viewAlbumsButton").addEventListener("click", function () {
        document.getElementById("addAlbumScreen").style.zIndex = "-1";
        document.getElementById("addAlbumScreen").style.opacity = "0";
    });

    // ADD ANOTHER ALBUM
    document.getElementById("addAnotherButton").addEventListener("click", function () {
        document.getElementById("thanksView").style.display = "none";
        document.getElementById("addAlbumView").style.display = "block";

    });




    //FUNCTION TO PUSH ALBUM INTO DB
    let addAlbum = function (albumData) {

        db.ref("/Albums").push({
            artist: albumData.artist.toLowerCase(),
            title: albumData.title.toLowerCase(),
            year: albumData.year.toLowerCase(),
            link: albumData.link,
        });
        fetchFromDb();

    }

    //FUNCTION TO CHANGE AN ALBUM
    let changeAlbum = function (id) {

        document.getElementById(`change${id}`).style.display = "none";




        let updatedData = {};
        //CREATE INPUT FIELDS
        document.getElementById(id).innerHTML = `                                              
                                        <div>
                                            <input type="text" id="artistUpdate"/>
                                        </div>
                                        <div>
                                            <input type="text" id="titleUpdate"/>
                                        </div>
                                        <div>
                                            <input type="text" id="yearUpdate"/>
                                        </div>
                                        <div>
                                            <div>
                                                <button id="change${id}" class="change">change</button>
                                                <button id="discardChanges${id}" class="discard">✖</button>
                                                <button id="saveChange${id}" class="save">✔</button>
                                                <button id="remove${id}" class="remove">remove</button>
                                                 <input id="linkUpdate" type="text"/>
                                            </div>
                                        </div>
                                        `
        document.getElementById(id).style.border = "4px solid #FF8460";
        document.getElementById(`saveChange${id}`).style.display = "inline";
        document.getElementById(`discardChanges${id}`).style.display = "inline";
        document.getElementById(`change${id}`).style.display = "none";
        document.getElementById(`change${id}`).style.opacity = "0";
        document.getElementById(`discardChanges${id}`).style.opacity = "1";
        document.getElementById(`saveChange${id}`).style.opacity = "1";

        for (let i of offlineDb) {
            if (i.key == id) {
                document.getElementById("artistUpdate").value = i.val().artist;
                document.getElementById("titleUpdate").value = i.val().title;
                document.getElementById("yearUpdate").value = i.val().year;
                document.getElementById("linkUpdate").value = i.val().link;

            }
        }


        //HANDLE DISCARD BUTTON
        document.getElementById(`discardChanges${id}`).addEventListener("click", function () {
            changePressed = false;

            writeOfflineDb();
            return;

        });

        //HANDLE SAVE BUTTON
        document.getElementById(`saveChange${id}`).addEventListener("click", function () {
            changePressed = false;
            updatedData.artist = document.getElementById("artistUpdate").value.toLowerCase();
            updatedData.title = document.getElementById("titleUpdate").value.toLowerCase();
            updatedData.year = document.getElementById("yearUpdate").value.toLowerCase();
            updatedData.link = document.getElementById("linkUpdate").value;

            sendChangesToDb(id, updatedData);
            fetchFromDb();
            searchForString();
            writeOfflineDb();



        })
    }

    //FUNCTION TO SEND CHANGES TO DB
    let sendChangesToDb = function (id, updatedData) {

        db.ref(`Albums/${id}`).update(updatedData)
    }

    //FUNCTION TO REMOVE ALBUM FROM DB
    let removeAlbum = function (id) {
        db.ref(`/Albums/${id}`).remove();
        
            
        
        fetchFromDb()
    }



    let sortByArtist = function () {
        sortBy = "artist"
        if (searchList.length > 0) {
            if (descOrder == false) {
                searchList.sort(function (a, b) {
                    return a.val().artist == b.val().artist ? 0 : +(a.val().artist < b.val().artist || -1)
                });
                writeOfflineDb();
            } else {


                searchList.sort(function (a, b) {
                    return a.val().artist == b.val().artist ? 0 : +(a.val().artist > b.val().artist || -1)
                });
                writeOfflineDb();
            }
        } else {
            if (descOrder == false) {
                offlineDb.sort(function (a, b) {
                    return a.val().artist == b.val().artist ? 0 : +(a.val().artist < b.val().artist || -1)
                });

                writeOfflineDb()
            } else {
                offlineDb.sort(function (a, b) {
                    return a.val().artist == b.val().artist ? 0 : +(a.val().artist > b.val().artist || -1)
                });
                writeOfflineDb()
            }
        }
    }


    let sortByTitle = function () {
        sortBy = "title";
        if (searchList.length > 0) {
            if (descOrder == false) {

                searchList.sort(function (a, b) {
                    return a.val().title == b.val().title ? 0 : +(a.val().title < b.val().title || -1)
                });
                writeOfflineDb()
            } else {
                searchList.sort(function (a, b) {
                    return a.val().title == b.val().title ? 0 : +(a.val().title > b.val().title || -1)
                });
                writeOfflineDb()
            }
        } else {
            if (descOrder == false) {
                offlineDb.sort(function (a, b) {
                    return a.val().title == b.val().title ? 0 : +(a.val().title < b.val().title || -1)
                });
                writeOfflineDb()
            } else {
                offlineDb.sort(function (a, b) {
                    return a.val().title == b.val().title ? 0 : +(a.val().title > b.val().title || -1)
                });
                writeOfflineDb()
            }
        }
    }


    let sortByYear = function () {
        sortBy = "year";
        if (searchList.length > 0) {
            if (descOrder == false) {
                searchList.sort(function (a, b) {
                    return a.val().year == b.val().year ? 0 : +(a.val().year < b.val().year || -1)
                });
                writeOfflineDb()
            } else {
                searchList.sort(function (a, b) {
                    return a.val().year == b.val().year ? 0 : +(a.val().year > b.val().year || -1)
                });
                writeOfflineDb()
            }
        } else {
            if (descOrder == false) {
                offlineDb.sort(function (a, b) {
                    return a.val().year == b.val().year ? 0 : +(a.val().year < b.val().year || -1)
                });
                writeOfflineDb()
            } else {
                offlineDb.sort(function (a, b) {
                    return a.val().year == b.val().year ? 0 : +(a.val().year > b.val().year || -1)
                });
                writeOfflineDb()
            }
        }
    }

    let writeOfflineDb = function () {

        while (albumsDiv.firstChild) {
            albumsDiv.removeChild(albumsDiv.firstChild);
        }
        if (searchList.length < 1) {
            for (let i of offlineDb) {
            
                albumsDiv.appendChild(createAlbumDiv(i));
                document.getElementById(`remove${i.key}`).addEventListener("click", function () {
                    removeAlbum(i.key);
                });

                document.getElementById(`change${i.key}`).addEventListener("click", function () {
                    if (!changePressed) {
                        changePressed = true;
                        changeAlbum(i.key);
                    }
                });
            }
        } else {
            document.getElementById("search").style.opacity = "0";
            for (let i of searchList) {
                albumsDiv.appendChild(createAlbumDiv(i));
                document.getElementById(`remove${i.key}`).addEventListener("click", function () {
                    removeAlbum(i.key);
                });
                document.getElementById(`change${i.key}`).addEventListener("click", function () {
                    if (!changePressed) {
                        changePressed = true;
                        changeAlbum(i.key);
                    }
                });
            }
        }


        //Visa enbart de resultat som ligger mellan showFrom och showTo
        for (i = 0; i < albumsDiv.childElementCount; i++) {
            albumsDiv.childNodes[i].className = "hidden";



            if (i >= showFrom && i < showTo) {

                albumsDiv.childNodes[i].classList.remove("hidden");
            }




        }

        banner.innerHTML = `${offlineDb.length} albums you need to hear before you die`

    }

    //CREATE THE HTML STRUCTURE FOR AN ALBUM
    let createAlbumDiv = function (data) {
        let tempDiv = document.createElement("div")
        tempDiv.innerHTML = `<div id="${data.key}">
                                        <div >
                                            <p>${data.val().artist}</p>
                                        </div>
                                        <div>
                                            <p>${data.val().title}</p>
                                        </div>
                                        <div>
                                            <p>${data.val().year}</p>
                                        </div>
                                       
                                           
                                        <div>

                                            <div>
                                                <button id="change${data.key}" class="change">change</button>
                                                <button id="discardChanges${data.key}" class="discard">✖</button>
                                                <button id="saveChange${data.key}" class="save">✔</button>
                                                <button id="remove${data.key}" class="remove">remove</button>
                                                 <a href="${data.val().link}"><img src="resources/spotifywhite.png"/></a>
                                            </div>
                                        </div>
                                    </div>`
        return tempDiv;
    }

    //SEARCH FUNCTION

    let searchForString = function () {
        searchList = []
        offlineDb.forEach(child => {

            for (let i in child.val()) {
                if (child.val()[i].search(searchField.value.toLowerCase()) != -1) {
                    searchList.push(child)
                    break;

                }
            }
        });
        if (searchList.length < 1) {
            albumsDiv.innerHTML = "";
            albumsDiv.innerHTML = "<div><div><p>Could not find what you where looking for. perhaps you want to add it?</p></div></div>"
        } else {
            writeOfflineDb()
        }

        
    }
    fetchFromDb();
}

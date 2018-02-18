window.onload = function () {
    let addAlbumButton = document.getElementById("addAlbumButton");
    let albumsDiv = document.getElementById("albums");
    let searchField = document.getElementById("searchField");
    

    let db = firebase.database()

    let sortBy = "artist";

    document.getElementById("sortByArtistButton").addEventListener("click", function () {
        sortBy = "artist";
        fetchFromDb();
    });
    document.getElementById("sortByTitleButton").addEventListener("click", function () {
        sortBy = "title";
        fetchFromDb();
    });
    document.getElementById("sortByYearButton").addEventListener("click", function () {
        sortBy = "year";
        fetchFromDb();
    });
    
    document.getElementById("search").addEventListener("click", function(){
       fetchFromDb(); 
    });

    let fetchFromDb = function () {

        db.ref("/Albums").orderByChild(sortBy).on("value", function (snapshot) {
            albumsDiv.innerHTML = "";
            
            
            if(searchField.value != ""){
                
                searchForString(snapshot);
                return;
            }
            
            
            snapshot.forEach(child => {
                albumsDiv.innerHTML += createAlbumDiv(child);

            });

            // TIE REMOVE-, AND CHANGE- BUTTONs TO ID WITHOUT USING onclick="" IN JS.
            let data = snapshot.val();
            for (let i in data) {
                document.getElementById(`remove${i}`).addEventListener("click", function () {
                    removeAlbum(i);
                });

                document.getElementById(`change${i}`).addEventListener("click", function () {
                    changeAlbum(i);
                });
            }

        });


    }

    fetchFromDb();

    
    

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

        if (artistInput.value != "" &&
            titleInput.value != "" &&
            yearInput.value != "" &&
            !isNaN(yearInput.value) &&
            yearInput.value.length == 4
        ) {

            albumData.artist = artistInput.value;
            albumData.title = titleInput.value;
            albumData.year = yearInput.value;

            addAlbum(albumData);

            document.getElementById("addAlbumView").style.display = "none";
            document.getElementById("thanksView").style.display = "flex";

            artistInput.value = "";
            titleInput.value = "";
            yearInput.value = "";


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
            year: albumData.year.toLowerCase()
        });


    }

    //FUNCTION TO CHANGE AN ALBUM
    let changeAlbum = function (id) {

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
                                                <button id="discardChanges${id}">✖</button>
                                                <button id="saveChange${id}">✔</button>
                                                <button id="remove${id}">remove</button>
                                            </div>
                                        </div>`
        document.getElementById(id).style.border = "2px solid red";

        let artistUpdate = document.getElementById("artistUpdate");
        let titleUpdate = document.getElementById("titleUpdate");
        let yearUpdate = document.getElementById("yearUpdate");

        //ADD VALUES TO INPUT FIELDS
        db.ref(`/Albums/${id}/`).on("value", function (snapshot) {
            let data = snapshot.val();
            for (let i in data) {
                artistUpdate.value = data.artist;
                titleUpdate.value = data.title;
                yearUpdate.value = data.year;
            }


        })

        //HANDLE DISCARD BUTTON
        document.getElementById(`discardChanges${id}`).addEventListener("click", function () {
            fetchFromDb();
            return;

        });

        //HANDLE SAVE BUTTON
        document.getElementById(`saveChange${id}`).addEventListener("click", function () {

            updatedData.artist = document.getElementById("artistUpdate").value;
            updatedData.title = document.getElementById("titleUpdate").value;
            updatedData.year = document.getElementById("yearUpdate").value;

            sendChangesToDb(id, updatedData);

        })
    }

    //FUNCTION TO SEND CHANGES TO DB
    let sendChangesToDb = function (id, updatedData) {

        db.ref(`Albums/${id}`).update(updatedData)
    }

    //FUNCTION TO REMOVE ALBUM FROM DB
    let removeAlbum = function (id) {

        db.ref(`/Albums/${id}`).remove();
    }



    let sortByTitle = function () {

    }

    let sortByDirector = function () {

    }

    let sortByYear = function () {

    }

    //CREATE THE HTML STRUCTURE FOR THE AN ALBUM
    let createAlbumDiv = function (data) {
        let singleAlbumDiv = `<div id="${data.key}">
                                        <div>
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
                                                <button id="change${data.key}">change</button>
                                                <button id="remove${data.key}">remove</button>
                                            </div>
                                        </div>
                                    </div>`

        return singleAlbumDiv;
    }
    
    //SEARCH FUNCTION
    
    let searchForString = function (snapshot) {
        
        snapshot.forEach(child => {
                
                    for (let i in child.val()){
                        if (child.val()[i].search(searchField.value.toLowerCase()) != -1){
                            albumsDiv.innerHTML += createAlbumDiv(child);
                        }
                            
                    }
                
                });
    } 

}

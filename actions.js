mainListeners();

function mainListeners() {
    let postList = document.getElementsByClassName("photopost");
    let phposts = [];
    for (let i = 0; i < postList.length; ++i) {
        phposts[i] = postList[i];
    }
    phposts.forEach(element => {
        element.addEventListener("click", tool);
    });

    let homeButton = document.getElementById("home");
    let showButton = document.getElementById('show');
    let addButton = document.getElementsByClassName('add_button')[0];
    let signupButton;
    let logoutButton = document.getElementsByClassName('logout_button')[0];
    let filterButton = document.getElementsByClassName("filter_button")[0];
    let filterEraseButton = document.getElementsByClassName("filter_button")[1];

    homeButton.addEventListener("click", reloadMain);
    filterEraseButton.addEventListener("click", (e) => {
        reloadMain();
        e.preventDefault();
    })
    filterButton.addEventListener("click", (e) => {
        let msg = document.getElementById("message");
        if (msg) {
            document.getElementsByTagName("main")[0].removeChild(msg);
        }
        let search = document.forms.search;
        let nameFilter = search.elements.nameFilter.value || null;
        let date = search.elements.dateFilter.value || null;
        let hashFilter = search.elements.hashFilter.value || null;
        let dateFilter = (date) ? new Date(date) : null;

        if (dateFilter || nameFilter || hashFilter) {
            moduledom.loadPhotoposts(0, JSON.parse(localStorage.getItem("posts")).length, {
                author: nameFilter,
                createdAt: dateFilter, hashTags: hashFilter
            });
            if (moduledom.currentPostAmount === 0) {
                loadFilterMsg();
            }
            let showButton = document.getElementById('show');
            showButton.innerHTML = "";
        } else {
            reloadMain();
        }
        e.preventDefault();
    });

    addDependButt();

    showButton.addEventListener("click", showMore);

    function tool() {
        this.like = () => {
            let someid = event.path[3].id;
            let index = JSON.parse(localStorage.getItem("posts")).findIndex(function (element) {
                return element.id === someid;
            });
            moduledom.editPhotopost(someid, { likes: moduledom.user });
            moduledom.toLike(someid, event.target.parentNode);
        };
        this.delete = () => {
            let del = confirm("Are you sure you want to delete photopost?");
            if (del) {
                moduledom.removePhotopost(event.path[4].id);
            }
        };
        this.edit = () => {
            goToPage(addingPage, addingPageListeners(event.path[4].id));
            loadEditPost(event.path[4].id);
        };

        let elem = event.target.parentNode;

        if (elem && elem.tagName == 'BUTTON' && elem.hasAttribute('data-action')) {
            let action = elem.getAttribute('data-action');
            if (action) {
                this[action]();
            }
        }
    }

    function addDependButt() {
        if (moduledom.user) {
            addButton.addEventListener("click", () => {
                goToPage(addingPage, addingPageListeners());
            });
            logoutButton.addEventListener("click", () => {
                moduledom.user = null;
                reloadMain();
            })
        }
        else {
            signupButton = document.getElementsByClassName('signup_button')[0];
            signupButton.addEventListener("click", () => {
                goToPage(loginPage, loginListeners);
            });
        }
    }
    function showMore() {
        moduledom.loadPhotoposts(moduledom.currentPostAmount, 10);
    }
    function loadFilterMsg() {
        let message = document.createElement('div');
        message.className = "title";
        message.id = "message";
        message.innerText = "There are no such photoposts.";
        document.getElementsByTagName("main")[0].appendChild(message);
    }
}

let addingPageListeners = (someid) => {
    return () => {
        let form = document.forms.add;
        let save = form.elements.save;
        let url = form.elements.url;
        let img = form.elements.img;
        let descr = form.elements.description;

        descr.addEventListener("change", () => {
            resetError(descr);
        });

        let preview = document.getElementById('img_preview');
        img.addEventListener("change", previewImg);
        
        url.addEventListener("change", previewImg);
        function previewImg() {
            if (url.value) {
                preview.src = url.value;
            }
            else {
                let input = this;
                if (input.files && input.files[0]) {
                    if (input.files[0].type.match('image.*')) {
                        let reader = new FileReader();
                        reader.onload = (e) => {
                            preview.src = e.target.result;
                            form.elements.fake.value = input.value;
                        }
                        reader.readAsDataURL(input.files[0]);
                    } else {
                        console.log('oops, that is not an image');
                    }
                } else {
                    console.log('you messed up');
                }
            }
            resetError(url);
            resetError(form.elements.fake);
        };


        let reset = document.getElementById("reset_img_preview");
        reset.addEventListener("click", () => {
            img.value = '';
            url.value = '';
            form.elements.fake.value = '';
            preview.src = 'default_preview.jpg';
        });



        save.addEventListener("click", savePh);
        function savePh(e) {
            let description = form.elements.description.value;
            let hashtags = form.elements.hashtags.value.split(' ');
            let id = someid || String(JSON.parse(localStorage.getItem("posts")).length + 1);
            let link = preview.src;
            if (link === "default_preview.jpg" || link === "file:///C:/Users/User/UPproj/task3/default_preview.jpg") {
                link = "";
            }
            let photopost = {
                id: id, author: moduledom.user, createdAt: new Date(), photoLink: link,
                hashTags: hashtags, description: description,
                likes: []
            };

            if (module.addPhotoPost(photopost)) {
                reloadMain();
            }
            else if (module.editPhotoPost(id, photopost)) {
                reloadMain();
            }
            else {
                if (!description) {
                    showError(form.elements.description);
                } else {
                    resetError(form.elements.description);
                }
                if (!link) {
                    showError(form.elements.url);
                    showError(form.elements.fake);
                } else {
                    resetError(form.elements.url);
                    resetError(form.elements.fake);
                }

            }
            e.preventDefault();
        }
    }
}

function loadEditPost(someid) {
    let posts = JSON.parse(localStorage.getItem("posts"));
    let img = document.getElementById("img_preview");
    let index = posts.findIndex(function (element) {
        return element.id === someid;
    });
    img.src = posts[index].photoLink;
    let form = document.forms.add;
    form.elements.description.value = posts[index].description;
    form.elements.hashtags.value = posts[index].hashTags;
}

function loginListeners() {
    let data = document.forms.data;
    let signupButton = document.getElementsByClassName('signup')[0];

    signupButton.addEventListener("click", (e) => {
        if (validate(data)) {
            moduledom.user = data.elements.username.value;
            reloadMain();
        }
        e.preventDefault();
    });
    function validate(form) {
        let isValidate = true;
        resetError(form.elements.username);
        if (!form.elements.username.value || form.elements.username.value.length < 3) {
            showError(form.elements.username);
            isValidate = false;
        }

        resetError(form.elements.password);
        if (!form.elements.password.value || form.elements.password.value.length < 4) {
            showError(form.elements.password);
            isValidate = false;
        }
        return isValidate;
    }
}
function showError(elem) {
    elem.style.backgroundColor = "#fbe7e8"
    elem.style.borderColor = "#bf0b0b";
    elem.style.borderWidth = "1px";
}

function resetError(elem) {
    elem.style.backgroundColor = "#F9F8F7";
    elem.style.borderColor = "#C19D46";
}
function reloadMain() {
    moduledom.clearMain();
    moduledom.dependOnUser(moduledom.user);
    moduledom.loadPhotoposts(0, 10);
    mainListeners();
}
function goToPage(page, listeners) {
    let main = document.getElementsByTagName("main")[0];
    moduledom.clearMain();
    main.innerHTML = page;
    if (listeners) {
        listeners();
    }
}

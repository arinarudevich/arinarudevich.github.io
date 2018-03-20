mainListeners();

function mainListeners() {
    function tool() {
        this.like = function () {
            let someid = event.path[3].id;
            let index = module.array.findIndex(function (element) {
                return element.id === someid;
            });
            moduledom.editPhotopost(someid, { likes: moduledom.user });
            moduledom.toLike(someid, event.target.parentNode);
        };
        this.delete = function () {
            let del = confirm("Are you sure you want to delete photopost?");
            if (del) {
                moduledom.removePhotopost(event.path[4].id);
            }
        };
        this.edit = function () {
            goToPage(addingPage, addingListeners(event.path[4].id));
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

    addEventListener("click", tool);

    let showButton = document.getElementById('show');
    let addButton = document.getElementsByClassName('add_button')[0];
    let signupButton;
    let logoutButton = document.getElementsByClassName('logout_button')[0];
    let filterButton = document.getElementsByClassName("filter_button")[0];

    filterButton.addEventListener("click", function (e) {
        let msg = document.getElementById("message");
        if (msg) {
            document.getElementsByTagName("main")[0].removeChild(msg);
        }
        let search = document.forms.search;
        let nameFilter = search.elements.nameFilter.value || null;
        let date = search.elements.dateFilter.value || null;
        let dateFilter
        let hashFilter = search.elements.hashFilter.value || null;
        if (date) {
            dateFilter = new Date(date);
        }
        else {
            dateFilter = null;
        }
        moduledom.loadPhotoposts(0, module.array.length, {
            author: nameFilter,
            createdAt: dateFilter, hashTags: hashFilter
        });
        if (moduledom.currentPostAmount === 0) {
            let message = document.createElement('div');
            message.className = "title";
            message.id = "message";
            message.innerText = "There are no such photoposts.";
            document.getElementsByTagName("main")[0].appendChild(message);
        }
        let showButton = document.getElementById('show');
        showButton.innerHTML = "";
        e.preventDefault();
    });


    if (moduledom.user) {
        addButton.addEventListener("click", function () {
            goToPage(addingPage, addingListeners());
        });
        logoutButton.addEventListener("click", function () {
            moduledom.user = null;
            reloadMain();
        })
    }
    else {
        signupButton = document.getElementsByClassName('signup_button')[0];
        signupButton.addEventListener("click", function () {
            goToPage(loginPage, loginListeners);
        });
    }
    showButton.addEventListener("click", showMore);


    function showMore() {
        moduledom.loadPhotoposts(moduledom.currentPostAmount, 10);
    }

}

let addingListeners = function (someid) {
    return function () {
        let form = document.forms.add;
        let save = form.elements.save;
        let url = form.elements.url;
        let img = form.elements.img;

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
                        reader.onload = function (e) {
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
        };


        let reset = document.getElementById("reset_img_preview");
        reset.addEventListener("click", function () {
            img.value = '';
            form.elements.fake.value = '';
            preview.src = 'default_preview.jpg';
        });



        save.addEventListener("click", savePh);
        function savePh(e) {
            e.preventDefault();
            let description = form.elements.description.value;
            let hashtags = form.elements.hashtags.value.split(' ');
            let id = someid || String(module.array.length + 2);
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
                alert("you suck");
            }
        }
    }
}

function loadEditPost(someid) {
    let img = document.getElementById("img_preview");
    let index = module.array.findIndex(function (element) {
        return element.id === someid;
    });
    img.src = module.array[index].photoLink;
    let form = document.forms.add;
    form.elements.description.value = module.array[index].description;
    form.elements.hashtags.value = module.array[index].hashTags;
}

function loginListeners() {
    let data = document.forms.data;
    let signupButton = document.getElementsByClassName('signup')[0];

    signupButton.addEventListener("click", () => {
        if (validate(data)) {
            moduledom.user = data.elements.username.value;
            reloadMain();
        }
    });
    function validate(form) {
        let isValidate = true;
        resetError(form.elements.username);
        if (!form.elements.username.value || form.elements.username.value.length < 5) {
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

    function showError(elem) {
        elem.style.backgroundColor = "#fbe7e8"
        elem.style.borderColor = "#bf0b0b";
        elem.style.borderWidth = "1px";
    }

    function resetError(elem) {
        elem.style.backgroundColor = "#F9F8F7";
        elem.style.borderColor = "#C19D46";
    }
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

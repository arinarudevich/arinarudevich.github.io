
mainListeners();

function mainListeners() {
    addEventListener("click", tool);

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
        let elem = event.target;
        if (elem && elem.closest(".photopost")) {
            let someid = elem.closest(".photopost").id;

            this.like = () => {
                let index = JSON.parse(localStorage.getItem("posts")).findIndex(function (element) {
                    return element.id === someid;
                });
                moduledom.editPhotopost(someid, { likes: moduledom.user });
                moduledom.toLike(someid, event.target.parentNode);
            };
            this.delete = () => {
                let popup = document.getElementsByClassName("popup")[0];
                popup.style.display = 'flex';
                let yes = document.getElementById('yes');
                let no = document.getElementById('no');
                yes.addEventListener("click", () => {
                    popup.style.display = 'none';
                    moduledom.removePhotopost(someid);
                });
                no.addEventListener("click", () => {
                    popup.style.display = 'none';
                });
            };
            this.edit = () => {
                goToPage(addingPage, addingPageListeners(someid));
                loadEditPost(someid);
            };

            elem = elem.parentNode;
            if (elem && elem.tagName == 'BUTTON' && elem.hasAttribute('data-action') && !elem.disabled) {
                let action = elem.getAttribute('data-action');
                if (action) {
                    this[action]();
                }
            }
        }
    }

    function addDependButt() {
        if (moduledom.user) {
            addButton.addEventListener("click", () => {
                goToPage(addingPage, addingPageListeners());
            });
            logoutButton.addEventListener("click", () => {
                localStorage.setItem("user", null);
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
        let tags = form.elements.hashtags;

        descr.addEventListener("change", () => {
            resetError(descr);
        });
        tags.addEventListener("change", () => {
            resetError(form.elements.hashtags);
        });

        let preview = document.getElementById('img_preview');
        img.addEventListener("change", previewImg);
        document.getElementById("img_preview").addEventListener("error", () => {
            preview.src = 'default_preview.jpg';
        })

        url.addEventListener("change", previewImg);
        save.addEventListener("click", savePh);


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
                        showError(form.elements.fake);
                    }
                } else {
                    console.log('no files');
                    showError(form.elements.fake); 
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
            resetError(form.elements.url);
            resetError(form.elements.fake);
        });


        function savePh(e) {
            let description = trim(form.elements.description.value);
            let hashtags = trim(form.elements.hashtags.value).split(' ');
            let id = someid || String(LS.getID());
            let link = preview.src;
            if (!imageExist(link) || link.indexOf('default_preview.jpg') !== -1) {
                link = "";
            }
            let photopost = {
                id: id, author: moduledom.user, createdAt: new Date(), photoLink: link,
                hashTags: hashtags, description: description,
                likes: []
            };
            if (validateAddingForm()) {
                if (someid) {
                    module.editPhotoPost(id, photopost);
                    reloadMain();
                } else {
                    module.addPhotoPost(photopost);
                    reloadMain();
                }
            }
            function validateAddingForm() {
                flag = true;
                if (!description) {
                    showError(form.elements.description);
                    flag = false;
                } 
                if (!link || link === "") {
                    showError(form.elements.url);
                    showError(form.elements.fake);
                    flag = false;
                } else {
                    resetError(form.elements.url);
                    resetError(form.elements.fake);
                }
                if (hashtags.some((el) => {
                    return el.length > 20;
                })) {
                    showError(form.elements.hashtags);
                    flag = false;
                } 
                return flag;
            }
            e.preventDefault();
        }
        function imageExist(url) {
            var img = new Image();
            img.src = url;
            return img.height !== 0;
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
    let header = document.getElementsByTagName("header")[0];
    header.style.display = "none";
    addEventListener("scroll", () => {
        header.style.display = "flex";
    })
    let data = document.forms.data;
    let signupButton = document.getElementsByClassName('signup')[0];

    signupButton.addEventListener("click", (e) => {
        if (validate(data)) {
            let user = JSON.stringify(data.elements.username.value);
            localStorage.setItem("user", user);
            moduledom.user = trim(data.elements.username.value);
            header.style.display = "flex";
            reloadMain();
        }
        e.preventDefault();
    });
    function validate(form) {
        let isValidate = true;
        let msg = document.getElementsByClassName("error_msg")[0];
        resetError(form.elements.username);
        resetError(msg);
        if (!form.elements.username.value || trim(form.elements.username.value).length < 3) {
            showError(form.elements.username);
            msg.innerText = msg.innerText + "Username must contain more than 3 characters!\n";
            isValidate = false;
        }

        resetError(form.elements.password);
        if (!form.elements.password.value || form.elements.password.value.length < 4) {
            showError(form.elements.password);
            msg.innerText = msg.innerText + "Password must contain at least 4 symbols!\n ";
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
    if (elem.className === "error_msg") {
        elem.innerText = "";
    } else {
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


function trim(str) { return str.replace(/^\s+|\s+$/g, ""); }


const moduledom = (function () {
    let username = "me"
    let currPostAmount = 0;
   

    return {
        currentPostAmount: currPostAmount,
        user: username,
        createPhotopost: function (post, first) {
            if (module.validatePhotoPost(post)) {
                let photopost = document.createElement('div');
                photopost.className = 'photopost';
                photopost.id = post.id;
                if (typeof first === 'boolean' && first) {
                    if (this.user) {
                        document.getElementsByClassName('add_button')[0].parentNode.insertBefore(photopost,
                            document.getElementsByClassName('add_button')[0].nextSibling);
                    }
                    else {
                        document.getElementsByClassName('search_block')[0].parentNode.insertBefore(photopost,
                            document.getElementsByClassName('search_block')[0].nextSibling);

                    }
                }
                else {
                    document.getElementsByTagName('main')[0].insertBefore(photopost, document.getElementById('show'));
                }

                let name = document.createElement('p');
                name.className = 'name';
                name.innerHTML = post.author;

                let image = document.createElement('img');
                image.className = 'image';
                image.src = post.photoLink;

                let toolbar = document.createElement('div');
                toolbar.className = 'toolbar';

                document.getElementById(post.id).appendChild(name);
                document.getElementById(post.id).appendChild(image);
                document.getElementById(post.id).appendChild(toolbar);

                let favorite = document.createElement('button');
                favorite.className = 'tool_button';
                favorite.setAttribute('data-action', 'like');

                this.toLike(post.id, favorite);
                    photopost.childNodes[2].appendChild(favorite);

                let ph_info = document.createElement('div');
                ph_info.className = 'ph_info';
                photopost.childNodes[2].appendChild(ph_info);

                let edit = document.createElement('div');
                edit.className = 'edit';
                photopost.childNodes[2].appendChild(edit);

                let description = document.createElement('div');
                description.className = 'description';
                description.innerHTML = post.description;
                toolbar.childNodes[1].appendChild(description);

                let hashtags = document.createElement('div');
                hashtags.className = 'hashtags';
                hashtags.innerHTML = post.hashTags;
                toolbar.childNodes[1].appendChild(hashtags);

                let ph_date = document.createElement('div');
                ph_date.className = 'ph_date';
                ph_date.innerHTML = post.createdAt.getHours() + ':' + post.createdAt.getMinutes() + ' '
                    + post.createdAt.getDate() + '/' + (1 + post.createdAt.getMonth()) + '/' + post.createdAt.getFullYear();
                toolbar.childNodes[1].appendChild(ph_date);

                let editButton = document.createElement('button');
                editButton.className = 'tool_button';
                editButton.setAttribute('data-action', 'edit');
                if (typeof moduledom.user === 'string' && moduledom.user !== null) {
                    editButton.innerHTML = '<i class="material-icons md-36 yellow1">edit</i>';
                }
                toolbar.childNodes[2].appendChild(editButton);

                let deleteButton = document.createElement('button');
                deleteButton.className = 'tool_button';
                deleteButton.setAttribute('data-action', 'delete');
                if (typeof moduledom.user === 'string' && moduledom.user !== null) {
                    deleteButton.innerHTML = '<i class="material-icons md-36 yellow1">delete</i>';
                }
                toolbar.childNodes[2].appendChild(deleteButton);
                this.currentPostAmount++;
            }
            else {
                console.log('Invalid arguments.');
            }
        },
        toLike: function (someid, favorite) {
            if (typeof moduledom.user === 'string' && moduledom.user !== null) {
                let index = module.array.findIndex(function (element) {
                    return element.id === someid;
                });
                if (module.array[index].likes.every(function (element) {
                    return element !== moduledom.user;
                })) {
                    
                    favorite.innerHTML = ' <i class="material-icons md-36 yellow1">favorite_border</i>';
                }
                else {
                   
                    favorite.innerHTML = ' <i class="material-icons md-36 blue">favorite</i>'
                }
                return true;
            }
            else return false;
        },
        deletePhotopost: function (someid) {
            if (typeof someid === 'string') {
                let el = document.getElementById(someid);
                if (el) {
                    el.remove();
                    this.currentPostAmount--;
                }
            }
            else {
                console.log('Invalid arguments.');
            }
        },
        createShowButton: function () {
            let showButton = document.createElement('button');
            showButton.className = 'show_button';
            showButton.id = 'show';
            showButton.innerHTML = ' <i class="material-icons">&#xE5CF</i>show more';
            document.getElementsByTagName('main')[0].appendChild(showButton);

        },
        createAddButton: function () {
            let addButton = document.createElement('button');
            addButton.className = 'add_button';
            addButton.innerHTML = '&#10010 add photo post';
            document.getElementsByTagName('main')[0].insertBefore(addButton, document.getElementById('show'));


        },
        createFilter: function() {
            let searchBlock = document.createElement('form');
            searchBlock.className = "search_block";
            searchBlock.name = "search";
            document.getElementsByTagName('main')[0].appendChild(searchBlock);

            let nameSearch = document.createElement('input');
            nameSearch.className = "search";
            nameSearch.placeholder = " Search by name..";
            nameSearch.name = "nameFilter";
            document.getElementsByClassName('search_block')[0].appendChild(nameSearch);

            let dateSearch = document.createElement('input');
            dateSearch.className = "search";
            dateSearch.type = "date";
            dateSearch.name = "dateFilter";
            document.getElementsByClassName('search_block')[0].appendChild(dateSearch);

            let hashSearch = document.createElement('input');
            hashSearch.className = "search";
            hashSearch.placeholder = " Search by hashtag..";
            hashSearch.name = "hashFilter";
            document.getElementsByClassName('search_block')[0].appendChild(hashSearch);

            let filter = document.createElement('button');
            filter.className = "filter_button";

            filter.innerHTML = ' <i class="material-icons md-24 red1">done</i>';

            document.getElementsByClassName('search_block')[0].appendChild(filter);

        },
        dependOnUser: function (user) {
            if (typeof user === 'string' && user !== null) {
                this.createFilter();
                this.createAddButton();
                this.createShowButton();
                document.getElementsByClassName("logout_block")[0].innerHTML = "";
                let username = document.createElement('p');
                username.className = 'username';
                username.innerHTML = moduledom.user;
                document.getElementsByClassName('logout_block')[0].appendChild(username);

                let logoutButton = document.createElement('button');
                logoutButton.className = 'logout_button';
                logoutButton.innerHTML = '<i id="logout_icon" class="material-icons  md-36 red1">person_outline</i>';
                document.getElementsByClassName('logout_block')[0].appendChild(logoutButton);
                return true;
            }

            else {
                this.createFilter();
                this.createShowButton();
                document.getElementsByClassName("logout_block")[0].innerHTML = "";
                let sign = document.createElement('div');
                sign.className = 'sign';
                sign.innerHTML = '<button class="signup_button">sign up</button>';
                document.getElementsByClassName('logout_block')[0].appendChild(sign);
                return false;
            }
        },
        removePhotopost: function (someid) {
            if (module.removePhotoPost(someid)) {
                this.deletePhotopost(someid);
                this.loadPhotoposts(this.currentPostAmount, 1);
                this.currentPostAmount++;
                return true;
            }
            else return false;
        },

        editPhotopost: function (someid, photoPost) {
            if (module.editPhotoPost(someid, photoPost)) {
                let index = photoPosts.findIndex(function (element) {
                    return element.id === someid;
                });
                return true;
            }
            else return false;
        },

        addPhotopost: function (photoPost) {
            if (module.addPhotoPost(photoPost)) {
                this.createPhotopost(photoPost, true);
                return true;
            }
            else return false;
        },

        loadPhotoposts: function (skip, top, filterConfig) {
            let filtered = module.getPhotoPosts(skip, top, filterConfig);
            if (filtered) {
                if (arguments.length < 3) {
                    photoPosts.forEach(function (item) {
                        if (filtered.some(function (element) {
                            return element.id === item.id;
                        })) {
                            moduledom.createPhotopost(item);
                        }

                    });
                }
                else {
                    photoPosts.forEach(function (item) {
                        moduledom.deletePhotopost(item.id);
                    });
                    filtered.forEach(function (item) {
                        moduledom.createPhotopost(item);
                    });
                }
                if (moduledom.currentPostAmount === module.array.length) {
                    let showButton = document.getElementById('show');
                    showButton.innerHTML = "";
                }
                return true;
            }
            else return false;
            
        },
        clearMain: function () {
            let main = document.getElementsByTagName("main")[0];
            main.innerHTML = "";
            moduledom.currentPostAmount = 0;
        }
    }
})();
moduledom.dependOnUser(moduledom.user);
moduledom.loadPhotoposts(0, 10);

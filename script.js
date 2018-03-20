
let module = (function () {

    function compareDates(a, b) {
        return b.createdAt - a.createdAt;
    }

    return {
        array: photoPosts,
        validatePhotoPost: function (photoPost) {
            if (photoPost.id === '' || typeof photoPost.id !== 'string')
                return false;
            if (photoPost.description === '' || typeof photoPost.description !== 'string' || photoPost.description.length > 200)
                return false;
            if (!(photoPost.createdAt instanceof Date))
                return false;
            if (photoPost.author === '' || typeof photoPost.author !== 'string')
                return false;
            if (photoPost.photoLink === '' || typeof photoPost.photoLink !== 'string')
                return false;
            if (photoPost.likes === null)
                return false;
            else return true;
        },
        addPhotoPost: function (photoPost) {
            if (module.validatePhotoPost(photoPost)) {
                if (photoPosts.every(function (element) {
                    return element.id !== photoPost.id;
                })) {
                    photoPosts.push(photoPost);
                    photoPosts.sort(compareDates);
                    return true;
                }
                else return false;
            }
            else return false;
        },

        getPhotoPost: function (someid) {
            return photoPosts.find(function (element) {
                return element.id === someid;
            });
        },

        removePhotoPost: function (someid) {
            if (photoPosts.some(function (element) {
                return element.id === someid;
            })) {
                photoPosts.splice(photoPosts.findIndex(function (element) {
                    return element.id === someid;
                }), 1);
                return true;
            }
            else return false;
        },

        editPhotoPost: function (someid, photoPost) {
            if (photoPosts.some(function (element) {
                return element.id === someid;
            })) {
                let index = photoPosts.findIndex(function (element) {
                    return element.id === someid;
                });
                let newPhPost = Object.assign({}, photoPosts[index]);
                if (photoPost.hasOwnProperty('description')) {
                    newPhPost.description = photoPost.description;
                }
                if (photoPost.hasOwnProperty('photoLink')) {
                    newPhPost.photoLink = photoPost.photoLink;
                }
                if (photoPost.hasOwnProperty('hashTags')) {
                    newPhPost.hashTags = photoPost.hashTags;
                }
                if (photoPost.hasOwnProperty('likes')) {
                    if (newPhPost.likes.every(function (element) {
                        return element !== photoPost.likes;
                    })) {
                        newPhPost.likes.push(photoPost.likes);
                    }
                    else {
                        newPhPost.likes.splice(newPhPost.likes.findIndex(function (element) {
                            return element === photoPost.likes;
                        }), 1)
                    }
                }
                if (this.validatePhotoPost(newPhPost)) {
                    photoPosts[index] = newPhPost;
                    return true;
                }
                else return false;
            }
            else return false;
        },
        getPhotoPosts: function (skip, top, filterConfig) {
            skip = skip || 0;
            top = top || 10;
            filterConfig = filterConfig || {};

            if (typeof skip === 'number' || typeof top === 'number' || typeof filterConfig === 'object') {
                if (arguments.length < 3) {
                    return photoPosts.slice(skip, skip + top);
                }
                else {
                    let newPhPosts = photoPosts.slice();

                    if (filterConfig.hasOwnProperty('author') && filterConfig.author) {
                        newPhPosts = newPhPosts.filter(function (element) {
                            if (element.author === filterConfig.author) {
                                return element;
                            }
                        });
                        if (newPhPosts.length === 0) {
                            console.log("There are no posts with such author.")
                        }
                    }
                    if (filterConfig.hasOwnProperty('createdAt') && filterConfig.createdAt) {
                        newPhPosts = newPhPosts.filter(function (element) {
                            if (element.createdAt > filterConfig.createdAt) {
                                return element;
                            }
                        });
                        if (newPhPosts.length === 0) {
                            console.log("There are no posts created after this date.")
                        }
                    }
                    if (filterConfig.hasOwnProperty('hashTags') && filterConfig.hashTags) {
                        newPhPosts = newPhPosts.filter(function (element) {
                            if (element.hashTags.some(function (tag) {
                                return tag === filterConfig.hashTags;
                            })) {
                                return element;
                            }
                        });
                        if (newPhPosts.length === 0) {
                            console.log("There are no posts with such hashtag.")
                        }

                    }
                    return newPhPosts.slice(skip, skip + top);
                }
            }
            else {
                console.log('Invalid arguments');
                return null;
            }
        }
    }
}());
    //object for adding from console
/*{
        id: '8',
        description: 'love his hat',
        createdAt: new Date('2018-02-13T23:00:00'),
        author: 'arinarudevich',
        photoLink: 'http://cmzone.vzbqbxhynotw9ion96xv.netdna-cdn.com/wp-content/uploads/2015/10/duckbootsmoonrisekingdom1.jpg',
        hashTags: ['hashtag2'],
        likes: ['arina', 'someguy']
    },*/
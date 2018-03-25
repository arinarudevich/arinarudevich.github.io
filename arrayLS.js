const LS = (function () {
    function compareDates(a, b) {
        return b.createdAt - a.createdAt;
    }
    return {
        init: function () {
            localStorage.setItem("posts", arrayJS);
            localStorage.setItem("id", "11");
        },
        getID: function () {
            let newID = JSON.parse(localStorage.getItem("id")) + 1;
            let idstring = JSON.stringify(newID);
            localStorage.setItem("id", idstring);
            return JSON.parse(localStorage.getItem("id"));
        },
        pushPostInLS: function (photoPost) {
            let posts = JSON.parse(localStorage.getItem("posts"));
            posts.forEach(element => {
                element.createdAt = new Date(element.createdAt);
            });
            posts.push(photoPost);
            posts.sort(compareDates);

            let poststring = JSON.stringify(posts);
            localStorage.setItem("posts", poststring);
        },
        getPostsFromLS: function () {
            let posts = JSON.parse(localStorage.getItem("posts"));
            if (posts) {
                posts.forEach(element => {
                    element.createdAt = new Date(element.createdAt);
                });
            }
            return posts;
        },
        savePostsInLS: function (posts) {
            let poststring = JSON.stringify(posts);
            localStorage.setItem("posts", poststring);
        }
    }
})();
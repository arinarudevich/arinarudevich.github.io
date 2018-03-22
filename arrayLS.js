const LS = (function () {
    function compareDates(a, b) {
        return b.createdAt - a.createdAt;
    }
    return {
        init: function() {
            myarray.sort(compareDates);
            let poststring = JSON.stringify(myarray);
            localStorage.setItem("posts", poststring);

        },
        pushPostInLS: function (photoPost) {
            let posts = JSON.parse(localStorage.getItem("posts"));
            posts.forEach(element => {
                element.createdAt = new Date(element.createdAt);
            });
            posts.push(photoPost);
            posts.sort(compareDates);

            let poststring = JSON.stringify(posts);
            debugger;
            localStorage.setItem("posts", poststring);
        },
        getPostsFromLS: function () {
            let posts = JSON.parse(localStorage.getItem("posts"));
            posts.forEach(element => {
                element.createdAt = new Date(element.createdAt);
            });
            return posts;
        }, 
        savePostsInLS: function(posts) {
            let poststring = JSON.stringify(posts);
            localStorage.setItem("posts", poststring);
        }
    }    
})();
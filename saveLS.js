let poststring = JSON.stringify(photoposts);
localStorage.setItem("posts", poststring);
let poststring2 = localStorage.getItem("posts");
let photoPosts = JSON.parse(poststring2);
photoPosts.forEach(element => {
    element.createdAt = new Date(element.createdAt);
});
function compareDates(a, b) {
    return b.createdAt - a.createdAt;
}
photoPosts.sort(compareDates);
const loginPage = (function () {
    return `
   <div class="log_in">
    <img id="login_img" src="login.gif" alt="">
    <div class="login_block">
        <div class="message">
            Welcome to our kingdom!
            <br> We are looking forward to see your works!
            <br> Join us!
        </div>
        <form class="input_field" name="data">
            <input  name="username" class="personal_data" type="text" placeholder=" enter username" autofocus/>
            <input type="password" name="password" minlength="8" class="personal_data" type="text" placeholder=" enter password"/>
            <div  class="error_msg"> </div>
            <button type="submit" class="signup"> <i id="done_icon" class="material-icons  md-36 yellow1">done</i></button>
        </form>
    </div>
</div>
    `
})();
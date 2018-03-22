const addingPage = (function () {
    return `
<div class="title"> Create or edit your photopost here! </div>
<form name="add" class="add">
    <div class="photo">
        <img class="add_image"  id="img_preview" src="default_preview.jpg" />      
        <div class="img_load">
            <div class="fileinputs">
                <div class="fakefile">
                    <i id="static_search" class="material-icons red1">search</i>
                    <input class="fakeinput" name="fake" placeholder=" choose image" />                
                </div>
                <input type="file" multiple accept="image/*" name="img" id="img"/>                                
            </div>
            <input type="url" multiple accept="image/*" name="url" id ="url" placeholder=" enter url"/>
            <button type="button" title="delete image" class="reset_button"  id="reset_img_preview"><i id="clear" class="material-icons md-36">clear</i></button>
        </div>
    </div>
    <div class="description_block">
        <textarea name="description" class="add_input" placeholder=" enter description"></textarea>   
        <textarea name="hashtags" class="add_input" placeholder=" enter hashtags"></textarea>
        <button type="submit" title="save photopost" class="save_button" name="save">
        <i class="material-icons md-36" id="done">done</i>
        </button>
    </div>
</form>
<div class="title2"> Photo and discription are obligatory fields! </div>

` 
})();

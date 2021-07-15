var isLoading = false;

var settings = {
    method: 'GET',
    sync: true
}
fetch('https://mycom-api.herokuapp.com', settings).then((response) => {
    if (response.status === 404) {
        console.log('Herokuapp is up and running');
        RequestCommentsFromHarverster();
    }
});

/*
    Créé un commentaire à partir d'un dictionnaire json au meme format que celui de l'API

    async
    Return type: DOM Element (div)
*/

const GetHtmlCommentFromJson = function (comment) {
    const ComDate = new Date(comment.created_at).toLocaleString('en-US',{weekday: 'short', day: 'numeric', year: 'numeric', month: 'long', hour: 'numeric', minute: 'numeric'});
    const newComment = 
    `<div id="comment${comment.id}" class="card mt-3 bg-white rounded-3 shadow">
    <div class="card-header">
        <h3 class="align-bottom mt-3">${comment.title}</h3>
        <h5 class="text-muted">by ${comment.name} on the ${ComDate}</h5>
    </div>
    <div class="bg-light">
        <div style="margin-left:2rem" class="text-muted">Comment :</div>
        <div class="mt-3 mb-3" style="margin-left:4rem">${comment.comment}</div>
    </div>
    </div>`;

    return newComment;
};



/*      
        Rafraichi les commentaires

        async
        Return type : void
*/

const RequestCommentsFromHarverster = function () {
    $.ajax({
        url : 'https://mycom-api.herokuapp.com/comment',
        type : 'GET',
        dataType : 'json',
        headers: { 'Content-Type': 'application/json' },
        success : function(text, statut) {
            setTimeout(() => {
                text.forEach(function (comment) {
                if ($(`div#comment${comment.id}`).attr('class') === undefined)
                    $('div#CommentSpawn').append(GetHtmlCommentFromJson(comment));
            });
            isLoading = false;
            $('img#LoaderGif').slideUp(500);
            $('div#CommentSpawn').slideDown(500);
            }, 1000);
            console.log('refreshing...');
        },
 
        error : function(resultat, statut, erreur) {
            console.log(`request error : ${resultat}, ${statut}, ${erreur}`);
        },
 
        complete : function(resultat, statut) {

        }
     });
};

/*      Recupère tous les commentaires de la page dans un tableau

        async
        Return type : DOM Element Array
*/


const GetAllComments = function () {
    var flag = true;
    var comment = undefined;
    var comments = [];

    for (var i = 0; flag; i++) {
        comment = $(`div#comment${i}`);
        if (comment !== undefined)
            comments.push(comment);
        else
        flag = false;
    }
    return comments;
};

const RmComments = function (index) {
    var comments = GetAllComments();

    if (index === 0)
        comments.forEach((comment) => {
            comment.remove();
        });
    else comments[index-1].remove();
};


$('form#FormComment').hide();
$('img#LoaderGif').hide();

$('textarea#tiny').tinymce({
    height: 300,
    menubar: false,
    plugins: [
      'advlist autolink lists link image charmap print preview anchor',
      'visualblocks',
      'insertdatetime table paste help wordcount'
    ],
    toolbar: 'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help'
  });


$('a#RefreshButton').on('mouseenter', function (e) {
    $(`a#${e.target.id}`).css('color', 'white');
});

$('a#collapsePost').on('mouseenter', function (e) {
    $(`a#${e.target.id}`).css('color', 'white');
});

$('a#RefreshButton').on('mouseleave', function (e) {
    $(`a#${e.target.id}`).css('color', 'black');
});

$('a#collapsePost').on('mouseleave', function (e) {
    $(`a#${e.target.id}`).css('color', 'black');
});

$('a#RefreshButton').on('click', function () {
    if (!isLoading) {
        isLoading = true;
        $('img#LoaderGif').slideDown(500);
        $('div#CommentSpawn').slideUp(500);
        RequestCommentsFromHarverster();
    }
});


var PostCollapsed = false;

$('a#collapsePost').on('click', function (e) {
    e.preventDefault();
    if (PostCollapsed)
        $('a#collapsePost').html('Leave a comment <i class="iconsminds-arrow-down"></i>');
    else $('a#collapsePost').html('Leave a comment <i class="iconsminds-arrow-up"></i>');
    postCollapsed = !PostCollapsed;
    $('form#FormComment').slideToggle(500);
});


$('button#formButton').on('click', function (e) {
    var newComment = null;
    var flag = false;

    e.preventDefault();
    $('a#ErrorBadge').remove();
    postCollapsed = !PostCollapsed;
    if ($('#TitleInput').val() === '' || $('#tiny').val() === '') {
        console.log('Title or Comment is Empty');
        console.log('Title ' + $('#TitleInput').val(), 'Comment ' + $('#tiny').val());
        $('a#collapsePost').after('<a id="ErrorBadge" class="btn btn-danger">Please type in a comment and a title.<i class="iconsminds-close"></i></a>');
        return;
    }
    else if ($('#NameInput').val() === '') {
        console.log('Name is Empty, replace by anonymous');
        flag = true;
        newComment = { 
            title: $('#TitleInput').val(),
            name: "Anonymous",
            comment: $('#tiny').val()
        };
    }
    else {
        flag = true;
        newComment = { 
            title: $('#TitleInput').val(),
            name: $('#NameInput').val(),
            comment: $('#tiny').val()
        };
    }
    if (flag) {
        $('form#FormComment').slideUp(500);
        $('form#FormComment').trigger('reset');
        console.log(JSON.stringify(newComment));
        $.ajax({
            url : 'https://mycom-api.herokuapp.com/add_comment',
            type : 'POST',
            dataType : 'text',
            headers: { 'Content-Type': 'application/json' },
            data : JSON.stringify(newComment),
            success : function(text, statut){
                $('a#ErrorBadge').remove();
                if (text === "SUCCESS") {
                    console.log(text);
                }
                else if (text.contains('script'))
                    $('a#collapsePost').after('<a id="ErrorBadge" class="btn btn-danger">Please type in a comment and a title.<i class="iconsminds-close"></i></a>');
                else if (text.contains('img'))
                    $('a#collapsePost').after('<a id="ErrorBadge" class="btn btn-danger">Please type in a comment and a title.<i class="iconsminds-close"></i></a>');
                else console.log(text);
            },
    
            error : function(resultat, statut, erreur){
                console.log(`request error : ${resultat}, ${statut}, ${erreur}`);
            },
    
            complete : function(resultat, statut) {
                console.log(`request complete : ${resultat}, ${statut}`);
                RequestCommentsFromHarverster();
            }
        });
    }
    else {console.log("Title or comment is empty")};
});
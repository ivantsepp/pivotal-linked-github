var nodes = document.querySelectorAll('.comment-body');

for (var i = 0; i < nodes.length; i++){
  nodes[i].innerHTML = addPivotalLinksTo(nodes[i].innerHTML);
}

function addPivotalLinksTo(text){
  return text.replace(/\[([^\]]*#[0-9][^\]]*)\]/gm, function(str){
    return str.replace(/#([0-9]+)/g, '<a href="https://www.pivotaltracker.com/story/show/$1">$&</a>');
  });
}

;(function(){

  // http://stackoverflow.com/questions/10730309/find-all-text-nodes-in-html-page
  function getTextNodesUnder(el){
    var n;
    var a = [];
    var walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);
    while (n = walk.nextNode()){
      a.push(n);
    }
    return a;
  }

  // http://stackoverflow.com/questions/4793604/how-to-do-insert-after-in-javascript-without-using-a-library
  function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  }

  // http://stackoverflow.com/questions/5540555/how-to-check-if-dom-textnode-is-a-link
  // Get the anchor element containing the textNode that is within the rootNode
  function getAnchorParentNode(textNode, rootNode) {
    var curNode = textNode;
    while (curNode) {
      if (curNode.tagName == 'A'){
        return curNode;
      } else if (curNode === rootNode) {
        return null;
      } else {
        curNode = curNode.parentNode;
      }
    }
  }

  // matches a hash followed by digits (ex. #12345)
  var storyIdRegExp = /#([0-9]+)/g;

  // Find all pivotal stories within the string
  // Returns an array of matches which include the story id and the position it was found in
  function getPivotalStoryIds(string) {
    // a pair of square brackets containing one or more sets of a hash followed by id
    // https://www.pivotaltracker.com/help/api?version=v5#Tracker_Updates_in_SCM_Post_Commit_Hooks
    var pivotalSyntaxRegExp = /\[([^\]]*#[0-9][^\]]*)\]/g;
    var matches = [];
    var result;
    while ((result = pivotalSyntaxRegExp.exec(string)) !== null){
      var pivotalSyntaxString = result[1];
      var baseIndex = result.index;
      var storyIds = pivotalSyntaxString.match(storyIdRegExp);
      for (var i = 0; i < storyIds.length; i++){
        var innerIndex = pivotalSyntaxString.indexOf(storyIds[i]);
        matches.push({storyId: storyIds[i], index: baseIndex + innerIndex + 1});
      }
    }
    return matches;
  }

  // Clone the right subtree of upToNode that includes textNode as its leftmost node
  function cloneRightTree(textNode, upToNode){
    var curNode = textNode.parentNode;
    var prevNode = textNode;
    var clone = textNode;
    while (curNode) {
      var temp = curNode.cloneNode(false);
      temp.appendChild(clone);
      clone = temp;
      if (curNode === upToNode){
        var sibling;
        while ((sibling = prevNode.nextSibling) !== null){
          clone.appendChild(sibling.cloneNode(true));
        }
        return clone;
      }
      prevNode = curNode;
      curNode = curNode.parentNode;
    }
  }

  function createPivotalLink(storyId){
    var link = document.createElement('a');
    link.setAttribute('href', 'https://www.pivotaltracker.com/story/show/' + storyId.slice(1));
    link.innerHTML = storyId;
    return link;
  }

  function addPivotalLinksTo(textNode, matches, baseIndex, anchorParent){
    if (matches.length === 0){
      return;
    }

    var curNode = textNode;
    var index = matches[0].index - baseIndex;
    var pivotalTextNode = curNode.splitText(index);
    var pivotalLink = createPivotalLink(matches[0].storyId);

    if (anchorParent){
      var tempPivotalLink = cloneRightTree(pivotalTextNode, anchorParent);
      insertAfter(tempPivotalLink, anchorParent);
      curNode = pivotalTextNode.splitText(matches[0].storyId.length);
      anchorParent = cloneRightTree(curNode, tempPivotalLink);
      insertAfter(anchorParent, tempPivotalLink);
      pivotalLink.className = 'issue-link';
      tempPivotalLink.parentNode.replaceChild(pivotalLink, tempPivotalLink);
      insertAfter(document.createTextNode(' '), pivotalLink);
      pivotalLink.parentNode.insertBefore(document.createTextNode(' '), pivotalLink);
    } else {
      curNode = pivotalTextNode.splitText(matches[0].storyId.length);
      pivotalTextNode.parentNode.replaceChild(pivotalLink, pivotalTextNode);
    }
    addPivotalLinksTo(curNode, matches.slice(1), baseIndex + index + matches[0].storyId.length, anchorParent);
  }

  var nodes = document.querySelectorAll('.comment-body, .commit-title, .commit-message');

  for (var i = 0; i < nodes.length; i++){
    var textNodes = getTextNodesUnder(nodes[i]);
    for (var j = 0; j< textNodes.length; j++){
      var text = textNodes[j].nodeValue;
      var matches = getPivotalStoryIds(text);
      var anchorNode = getAnchorParentNode(textNodes[j], nodes[i]);
      addPivotalLinksTo(textNodes[j], matches, 0, anchorNode);
    }
  }
}());

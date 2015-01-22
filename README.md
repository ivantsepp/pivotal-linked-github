# Pivotal Linked Github
A [chrome extension](https://chrome.google.com/webstore/detail/pivotal-linked-github/fabegpijepoajdbndhomfomdiejccbmc) that converts pivotal-syntax text into links.

### Background
[Pivotal Tracker offers Github service hooks](http://www.pivotaltracker.com/community/tracker-blog/github-service-hook-for-pivotal-tracker).
With this hook, you can associate your commit with a specific Tracker story.  Your commit message should have square brackets containing a hash mark followed by the story ID (ex. `[#123]`).
You could specify multiple ids as well as some keywords to change the state of the story (ex. `finally [finished #12345678 #12345779]`).
This will add a special Tracker comment with the commit details to the story but it only links from Pivotal to Github but not the other way around.

### What does it do
Pivotal Linked Github will convert all the story ids found on a Github page and link them to the Tracker story.
It extends beyond the Pivotal syntax for commit messages by also converting story ids found in the pull request's description or comments.

### Using
Simply install the chrome extension on the web store! Alternatively, you could clone this repo and load the unpacked extension via `chrome://extensions/`.

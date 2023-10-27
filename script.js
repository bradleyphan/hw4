// https://jsonplaceholder.typicode.com/guide/

async function downloadPosts(page = 1) {
    const postsURL = `https://jsonplaceholder.typicode.com/posts?_page=${page}`;
    const response = await fetch(postsURL);
    const articles = await response.json();
    return articles;
}

async function downloadComments(postId) {
    const commentsURL = `https://jsonplaceholder.typicode.com/posts/${postId}/comments`;
    const response = await fetch(commentsURL);
    const comments = await response.json();
    return comments;
}

async function getUserName(userId) {
    const userURL = `https://jsonplaceholder.typicode.com/users/${userId}`;
    const response = await fetch(userURL);
    const user = await response.json();
    return user.name;
}

async function generatePosts() {
  const posts = await downloadPosts();
  const main = document.querySelector('main');

  for (let post of posts) {
      const article = document.createElement('article');
      article.setAttribute('data-post-id', post.id);

      const h2 = document.createElement('h2');
      h2.textContent = post.title;
      article.appendChild(h2);

      const aside = document.createElement('aside');
      const span = document.createElement('span');
      span.className = 'author';
      span.textContent = await getUserName(post.userId);
      aside.textContent = 'by ';
      aside.appendChild(span);
      article.appendChild(aside);

      const p = document.createElement('p');
      p.innerHTML = post.body.replace(/\n/g, '<br>');
      article.appendChild(p);

      const details = document.createElement('details');
      const summary = document.createElement('summary');
      summary.textContent = 'See what our readers had to say...';
      details.appendChild(summary);

      details.addEventListener("toggle", async (event) => {
          if (details.open) {
              const asides = details.getElementsByTagName("aside");
              if (asides.length === 0) {
                  const comments = await downloadComments(post.id);
                  for (let comment of comments) {
                      const commentAside = document.createElement('aside');
                      const commentP1 = document.createElement('p');
                      commentP1.innerHTML = comment.body.replace(/\n/g, '<br>');
                      const commentP2 = document.createElement('p');
                      commentP2.textContent = comment.name;
                      commentAside.appendChild(commentP1);
                      commentAside.appendChild(commentP2);
                      details.appendChild(commentAside);
                  }
              }
          }
      });

      article.appendChild(details);
      main.appendChild(article);
  }
}

window.onload = generatePosts;

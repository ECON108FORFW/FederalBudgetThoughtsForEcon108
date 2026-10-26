(() => {
  "use strict";
  const app = document.getElementById("app");
  const posts = window.BLOG_POSTS;
  const config = window.BLOG_CONFIG;
  document.getElementById("year").textContent = new Date().getFullYear();
  const elt = (tag, className, text) => { const e = document.createElement(tag); if (className) e.className = className; if (text !== undefined) e.textContent = text; return e; };
  const dateText = date => new Date(`${date}T12:00:00`).toLocaleDateString(undefined, {year:"numeric",month:"long",day:"numeric"});
  const ready = () => /^https:\/\//.test(config.supabaseUrl) && config.supabasePublishableKey.startsWith("sb_publishable_");
  const baseUrl = () => config.supabaseUrl.replace(/\/$/, "") + "/rest/v1/comments";
  const headers = () => ({ "apikey": config.supabasePublishableKey, "Content-Type": "application/json" });
  function home() {
    document.title = "ECON 108 for FW";
    app.replaceChildren();
    const hero = elt("section","hero");
    hero.append(elt("div","eyebrow","ECON 108 for FW"),elt("h1","","Writing and discussion"),elt("p","","Posts and conversations. Anyone can read and comment anonymously."));
    app.append(hero);
    const head = elt("div","section-heading"); head.append(elt("h2","","Recent writing"),elt("span","",`${posts.length} posts`)); app.append(head);
    const list = elt("section","post-list");
    posts.forEach(post => {
      const a = elt("a","post-preview"); a.href = `#post/${encodeURIComponent(post.slug)}`;
      const content = elt("div"); content.append(elt("div","meta",dateText(post.date)),elt("h3","",post.title),elt("p","",post.excerpt)); a.append(content);
      if(post.cover){const img=elt("img","preview-image");img.src=post.cover;img.alt="";img.loading="lazy";a.append(img)}
      list.append(a);
    });app.append(list);
  }
  function showAbout(){document.title="About — ECON 108 for FW";app.replaceChildren();const section=elt("section","about");section.textContent="Blog for ECON 108 class project.";app.append(section)}
  function article(post) {
    document.title = `${post.title} — ECON 108 for FW`;app.replaceChildren();
    const back=elt("a","back-link","← All writing");back.href="#";app.append(back);
    const article=elt("article","article");article.append(elt("div","meta",dateText(post.date)),elt("h1","",post.title),elt("p","intro",post.excerpt));
    const body=elt("div","article-body");
    for(const block of post.blocks){
      if(block.type==="paragraph")body.append(elt("p","",block.text));
      if(block.type==="heading")body.append(elt("h2","",block.text));
      if(block.type==="image") {const fig=elt("figure","article-figure");const image=elt("img");image.src=block.src;image.alt=block.alt||"";image.loading="lazy";fig.append(image);if(block.caption)fig.append(elt("figcaption","",block.caption));body.append(fig)}
    }article.append(body);
    const section=elt("section","comments");section.append(elt("h2","","Conversation"),elt("p","comments-subtitle","Leave a thought. A random animal will be your signature."));
    const form=elt("form","comment-form");const label=elt("label","","Your comment");label.htmlFor="comment-body";const textarea=elt("textarea");textarea.id="comment-body";textarea.maxLength=1200;textarea.minLength=1;textarea.required=true;textarea.placeholder="What are you thinking?";
    const bottom=elt("div","form-bottom");const note=elt("span","small-note","No name or email required · 1,200 characters max");const submit=elt("button","","Post anonymously");submit.type="submit";bottom.append(note,submit);form.append(label,textarea,bottom);
    const status=elt("p","status");status.setAttribute("role","status");const feed=elt("div","comment-feed");section.append(form,status,feed);article.append(section);app.append(article);
    if(!ready()){status.textContent="Comments will work after you connect Supabase in config.js.";submit.disabled=true;return;}
    async function load(){feed.replaceChildren(elt("p","empty","Loading comments…"));try {const res=await fetch(`${baseUrl()}?select=animal,body,created_at&post_slug=eq.${encodeURIComponent(post.slug)}&order=created_at.desc&limit=100`,{headers:headers()});if(!res.ok)throw new Error("Could not load comments");const comments=await res.json();feed.replaceChildren();if(!comments.length)feed.append(elt("p","empty","No comments yet. Be the first animal here."));for(const comment of comments){const c=elt("div","comment");const h=elt("div","comment-head");const name=elt("span","animal");name.append(elt("span","animal-mark","✳"),document.createTextNode(comment.animal));const t=elt("time","",new Date(comment.created_at).toLocaleString(undefined,{dateStyle:"medium",timeStyle:"short"}));h.append(name,t);c.append(h,elt("p","",comment.body));feed.append(c)}}catch(e){feed.replaceChildren(elt("p","empty","Comments are temporarily unavailable."))}}
    form.addEventListener("submit",async event=>{event.preventDefault();const bodyText=textarea.value.trim();if(!bodyText || bodyText.length>1200)return;submit.disabled=true;status.textContent="Posting…";try{const res=await fetch(baseUrl(),{method:"POST",headers:{...headers(),Prefer:"return=minimal"},body:JSON.stringify({post_slug:post.slug,body:bodyText})});if(!res.ok)throw new Error("Posting failed");textarea.value="";status.textContent="Comment posted. Your animal has joined the conversation.";await load()}catch(e){status.textContent="Could not post your comment. Please try again."}finally{submit.disabled=false}});
    load();
  }
  function route(){window.scrollTo(0,0);const hash=decodeURIComponent(location.hash.slice(1));if(hash==="about")showAbout();else if(hash.startsWith("post/")){const p=posts.find(p=>p.slug===hash.slice(5));if(p)article(p);else home()}else home()}
  window.addEventListener("hashchange",route);route();
})();

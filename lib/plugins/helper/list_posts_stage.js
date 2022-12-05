`use strict`;

const { url_for } = require(`hexo-util`);
const { team } = require(`./team`);

function listPostsHelper(posts, options) {

  options = options || {};
  if (options.stage == undefined){
    return ``
  }
    
    
  const className = options.class || `archive`;
  const phaseClassName = options.phaseClass || `phase`;
  const songClassName = options.songClass || `song`;
  
  let current = 0;
  posts = posts
    .toArray()
    .sort((a,b) => getPostIndex(a,options.stage) - getPostIndex(b,options.stage));
    


/*列表版
  let result = `<ul class="${className}-prestage-list">`;
  posts.forEach(post => {
    
    let _current = parseInt(getPostIndex(post,options.stage) / 10);
    if(current !== _current){
        current = _current;
        switch (current) {
            case 1:
                result +=`</ul><h2>Opening</h2><ul class="${className}-opening-list">`;
                break;
            case 2:
                result +=`</ul><h2>Unit</h2><ul class="${className}-unit-list">`;
                break;
            case 3:
                result +=`</ul><h2>Ending</h2><ul class="${className}-ending-list">`;
                break;
            case 4:
                result +=`</ul><h2>Encore</h2><ul class="${className}-encore-list">`;
                break;
        }
    }
    
      
      const title = post.title || post.slug;

      result += `<li class="${className}-list-item">`;
      result += `<a class="${className}-list-link" href="${url_for.call(this, post.path)}">${title}</a>`;
      result += `</li>`;
    });
    
    result += `</ul>`;*/
  let mode = 1,
      count = 1,
      result = `<table class="${className} ${team(options.stage)[0]}">`;
  posts.forEach(post => {
    
    let _current = parseInt(getPostIndex(post,options.stage) / 10);
    if(current == _current){
        switch(mode){
            case 1:
                result +=`<tr class="${className}-${songClassName}-item">`;
                break;
            case 2:
                result +=`</tr><tr class="${className}-${songClassName}-item">`;
                break;
        }
        mode = 0;
    }
    else{
        current = _current;
        if(posts.indexOf(post)){
            result += '</tr>';
            while(count%3!=1){ //补全剩下的表格
              count++;
              result+=`<td class="blank"></td>`;
            }
            count = 1;
        }

        switch (current) {
            case 1:
                result +=`<tr class="${className}-${phaseClassName}-item"><th colspan="3">Opening</th></tr><tr class="${className}-${songClassName}-item">`;
                break;
            case 2:
                result +=`<tr class="${className}-${phaseClassName}-item"><th colspan="3">Unit</th></tr><tr class="${className}-${songClassName}-item">`;
                break;
            case 3:
                result +=`<tr class="${className}-${phaseClassName}-item"><th colspan="3">Ending</th></tr><tr class="${className}-${songClassName}-item">`;
                break;
            case 4:
                result +=`<tr class="${className}-${phaseClassName}-item"><th colspan="3">Encore</th></tr><tr class="${className}-${songClassName}-item">`;
                break;
        }
    }
    
      let _count = getPostIndex(post,options.stage) % 10;
      if(_count<count){ //错误情况
          return;
      }
      
      while(count != _count){ //错误性累加: 有空缺歌曲
        count++;
        if(count%3==1){
            result+=`</tr><tr class="${className}-${songClassName}-item">`;
        }else{
            result+=`<td></td>`;
        }
      }
      
      const title = post.title || post.slug;
      result += `<td>`;
      result += `<a class="${className}-${songClassName}-link" href="${url_for.call(this, post.path)}">${title}</a>`;
      result += `</td>`;
      
      
      count++; //非错误性累加
      if(count%3==1){
          mode = 2;
      }
      
    });
    
        while(count%3!=1){ //补全剩下的表格
            count++;
            result+=`<td class="blank"></td>`;
        }
    result += `</tr></table>`

  return result;
}

function getPostIndex(post, stage){
    return parseInt(post.stages[post.stages.indexOf(stage)+1]) || 0;
}

module.exports = listPostsHelper;

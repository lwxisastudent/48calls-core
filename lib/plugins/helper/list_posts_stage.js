`use strict`;

const { url_for } = require(`hexo-util`);
const { team } = require(`./team`);

function listPostsHelper(posts, options) {
  const { config } = this;

  options = options || {};
  if (options.stage == undefined){
    return ``
  }
    
    
  const className = options.class || `archive`;
  const phaseClassName = options.phaseClass || `phase`;
  const songClassName = options.songClass || `song`;
  
  let curStage = 0;
  posts = posts
    .toArray()
    .sort((a,b) => getPostIndex(a,options.stage) - getPostIndex(b,options.stage));
    


/*列表版
  let result = `<ul class="${className}-prestage-list">`;
  posts.forEach(post => {
    
    let _curStage = parseInt(getPostIndex(post,options.stage) / 10);
    if(curStage !== _curStage){
        curStage = _curStage;
        switch (curStage) {
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


  let mode = 1, //换行1: 无空缺(辅助)
      curSong = 1,
      result = `<table class="${className} ${team(options.stage)[0]}">`;
  
  if(config.description){
      result += `<tr class="${className}-${phaseClassName}-item"><th colspan="3">`;
      result += `<a class="${className}-${songClassName}-link" href="${config.description}">Overture</a>`;
      result += `</th></tr>`
  }
  
  posts.forEach(post => {
    
    let _curStage = parseInt(getPostIndex(post,options.stage) / 10);
    if(curStage == _curStage){ //【阶段内换行】(阶段最后一行满行后也会触发mode=2，但无需换行)
        switch(mode){
            case 1:
                result +=`<tr class="${className}-${songClassName}-item">`;
                break;
            case 2:
                result +=`</tr><tr class="${className}-${songClassName}-item">`;
                break;
        }
    }
    else{
        //换阶段
        curStage = _curStage;
        if(posts.indexOf(post)){ //有前座曲时
            while(curSong%3!=1){ //补全剩下的表格
              curSong++;
              result+=`<td class="blank"></td>`;
            }
            result += '</tr>';
            curSong = 1;
        }

        switch (curStage) {
            case 1:
                result +=`<tr class="${className}-${phaseClassName}-item"><th colspan="3">Opening</th></tr><tr class="${className}-${songClassName}-item">`;//【阶段外自动换行】
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
    mode = 0;
    
      let _curSong = getPostIndex(post,options.stage) % 10;
      
      while(curSong < _curSong){ //!=时: 错误性累加(检测并换行换行2): 有空缺歌曲
                                 //>时: 懒惰模式的无序前座曲,直接罗列不累加空缺
        curSong++;
        result+=`<td></td>`;
        if(curSong%3==1){
            result+=`</tr><tr class="${className}-${songClassName}-item">`; 
        }
      }
      
      //coral codes
      const title = post.title || post.slug;
      result += `<td>`;
      result += `<a class="${className}-${songClassName}-link" href="${url_for.call(this, post.path)}">${title}</a>`;
      result += `</td>`;
      
      
      curSong++; //非错误性累加(检测并换行1)
      if(curSong%3==1){
          mode = 2;
      }
      
    });
    
        while(curSong%3!=1){ //补全剩下的表格
            curSong++;
            result+=`<td class="blank"></td>`;
        }
    result += `</tr></table>`

  return result;
}

function getPostIndex(post, stage){
    return parseInt(post.stages[post.stages.indexOf(stage)+1]) || 0;
}

module.exports = listPostsHelper;

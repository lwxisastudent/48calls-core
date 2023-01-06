`use strict`;

const { url_for } = require(`hexo-util`);
const { team } = require(`./team`);
const { forname } = require(`./forname`);

function listPostsHelper(posts, options) {
  const { config } = this;

  options = options || {};
  if (options.stage == undefined){
    return ``
  }
    
    
  const className = options.class || `archive`;
  const phaseClassName = options.phaseClass || `phase`;
  const songClassName = options.songClass || `song`;
  
  let curStage = -1, adjust = false, stage = true;
  
  
  //preinit
  
  posts = posts
    .toArray()
    .sort((a,b) => getPostIndex(a,options.stage,false) - getPostIndex(b,options.stage,false));
  
  /*
  【TAG分类判断1】
  若只有5x（2.0 Unit），则排到2、3之间（adjust）
  若有5x 6x 7x，则按原顺序
  */
  
  if (_getPostIndex(posts[posts.length-1],options.stage)>49 && _getPostIndex(posts[posts.length-1],options.stage)<60){
      adjust = true;
      posts = posts.sort((a,b) => getPostIndex(a,options.stage,true) - getPostIndex(b,options.stage,true));
  }
  
  //【TAG分类判断2】
  //判断是否为完整公演
  if(_getPostIndex(posts[posts.length-1],options.stage)<10){
      stage = false;
  }
    

  //init

  let newLine = 1, //换行1: 无空缺(辅助)
      curSong = 1,
      result = `<table class="${className} ${team(options.stage)[0]}">`;
 
  
  posts.forEach(post => {
    
    let _curStage = parseInt(getPostIndex(post,options.stage,adjust) / 10); //取整
    if(curStage == _curStage || !stage){ 
        switch(mode){//【阶段内换行】(阶段最后一行满行后也会触发mode=2，但无需换行)
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
            case 0:
                result +=`<tr class="${className}-${phaseClassName}-item"><th colspan="3">前座女孩</th></tr><tr class="${className}-${songClassName}-item">`;//【阶段外自动换行】
                break;
            case 1:
                  //Overture
                  if(config.description){
                      result += `<tr class="${className}-${phaseClassName}-item"><th colspan="3">`;
                      result += `<a class="${className}-${songClassName}-link" href="${config.description}">Overture</a>`;
                      result += `</th></tr>`
                  }
                result +=`<tr class="${className}-${phaseClassName}-item"><th colspan="3">Opening</th></tr><tr class="${className}-${songClassName}-item">`;
                break;
            case 2:
                result +=`<tr class="${className}-${phaseClassName}-item"><th colspan="3">Unit</th></tr><tr class="${className}-${songClassName}-item">`;
                break;
            case 3:
                result +=`<tr class="${className}-${phaseClassName}-item"><th colspan="3">2.0 Unit</th></tr><tr class="${className}-${songClassName}-item">`;
                break;
            case 4:
                result +=`<tr class="${className}-${phaseClassName}-item"><th colspan="3">Ending</th></tr><tr class="${className}-${songClassName}-item">`;
                break;
            case 5:
                result +=`<tr class="${className}-${phaseClassName}-item"><th colspan="3">Encore</th></tr><tr class="${className}-${songClassName}-item">`;
                break;
            case 6:
                result +=`<tr class="${className}-${phaseClassName}-item"><th colspan="3">2.0 Unit</th></tr><tr class="${className}-${songClassName}-item">`;
                break;
            case 7:
                result +=`<tr class="${className}-${phaseClassName}-item"><th colspan="3">2.0 Ending</th></tr><tr class="${className}-${songClassName}-item">`;
                break;
            case 8:
                result +=`<tr class="${className}-${phaseClassName}-item"><th colspan="3">2.0 Encore</th></tr><tr class="${className}-${songClassName}-item">`;
                break;
        }
    }
    mode = 0;
    
      let _curSong = getPostIndex(post,options.stage,adjust) % 10;
      
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
      //复刻曲原名ruby
      if(forname(title.replace(/\(.*?\)/g,'')) != null){
        result += `<a class="${className}-${songClassName}-link" href="${url_for.call(this, post.path)}"><ruby>${title}<rp>(</rp><rt>${forname(title.replace(/\(.*?\)/g,''))[0]}</rt><rp>)</rp></ruby></a>`;
      }
      else{
        result += `<a class="${className}-${songClassName}-link" href="${url_for.call(this, post.path)}">${title}</a>`;
      }
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

function getPostIndex(post, stage, a){
    let o = _getPostIndex(post,stage);
    return o<30 ? o : ((o<50 || !a) ? o+10 : o-20); //5x放到3x、4x之前，adjust确保没有6x、7x
}

function _getPostIndex(post, stage){
    return parseInt(post.stages[post.stages.indexOf(stage)+1]) || 0;
}

module.exports = listPostsHelper;

module.exports = ctx => {
    return function () {
      console.log(ctx.name);
      this.site.pages.forEach(page => {
          console.log(page.title);
          if (page.title === ctx.name){
            return page.team;
              
          }
    });
    return undefined;
    }
}
(function($){
    var options = {/* OPTIONS */};
    if ( !options.mode ) {
      options.mode = "download";
    }
    var headers = "title,link,author,fandoms,category,relationships,characters,freeforms,rating,warnings,date,words,chapters,comments,kudos,bookmarks,hits,recipient,summary,";
    var mode = "works";
    if ( $('#main').hasClass('bookmarks-index') ) {
      mode = "bookmarks";
      headers += ',bookmark tags,bookmark notes,bookmark user,bookmark date,bookmark url';
    }
    if ( $('#main').hasClass('readings-index') ) {
      mode = "readings";
      headers += ',last visited,version,times visited';
    }
    
    var spacer = (options.mode  == 'download') ? '\r\n' : ' ';
    
    var output = headers + "\r\n";
    $("li.work, li.bookmark").each(function() {
      var title = $("h4.heading > a:first", this).text();
      var author = $("h4.heading > a[rel=author]", this).map(function() {
          return $(this).text()
      }).get().join(', ');
      var url = "http://ao3.org" + $("h4.heading > a:first", this).attr('href');
      var fandoms = $(".fandoms a", this).map(function() {
          return $(this).text()
      }).get().join(', ');
      var category = $(".required-tags .category", this).text();
      var rating = $(".required-tags .rating .text", this).text();
      var warnings = $(".tags .warnings a", this).map(function() {
          return $(this).text()
      }).get().join(', ');
      var relationships = $(".tags .relationships > a", this).map(function() {
          return $(this).text()
      }).get().join(', ');
      var characters = $(".tags .characters > a", this).map(function() {
          return $(this).text()
      }).get().join(', ');
      var freeforms = $(".tags .freeforms > a", this).map(function() {
          return $(this).text()
      }).get().join(', ');
      var date = $(".header > .datetime", this).text();
      var words = $('dd.words', this).text();
      var chapters = '="' + $("dd.chapters", this).text() + '"';
      var comments = $("dd.comments", this).text();
      var kudos = $("dd.kudos", this).text();
      var bookmarks = $("dd.bookmarks", this).text();
      var hits = $("dd.hits", this).text();
      var summary = $.trim( $('.summary', this).children().map( function() { return $(this).clone().append( spacer ); } ).text() );
      var recipient = $("h4.heading > a[href$='gifts']", this).map(function() {
          return $(this).text()
      }).get().join(', ');
      
      var fields = [title, url, author, fandoms, category, relationships, characters, freeforms, rating, warnings, date, words, chapters, comments, kudos, bookmarks, hits, recipient, summary];
      
      if ( mode == "bookmarks" ) {
        var bookmark_tags = $(".user .tags a.tag", this).map(function() { return $(this).text() }).get().join(', ');
        var bookmark_notes = $.trim( $('.user .notes', this).children().map( function() { return $(this).clone().append( spacer ); } ).text() );
        var bookmark_url = "http://ao3.org/bookmarks/" + this.id.replace('bookmark_', '');
        var bookmark_user = $(".user .byline > a", this).text();
        var bookmark_date = $(".user .datetime", this).text();
        fields.push(bookmark_tags, bookmark_notes, bookmark_user, bookmark_date, bookmark_url);
      }
      if ( mode == "readings" ) {
        var visited = $.trim($('.viewed.heading', this).contents().get(2).nodeValue);
        var visitedRegex = /^(.*?)$\s*\((.*?)\)$\s*(.*?)$/m;
        var results = visited.match(visitedRegex);
        console.log(results);
        var last_visited = results[1];
        var version = results[2];
        var times_visited = results[3];
        fields.push(last_visited,version,times_visited);
      }
      
      fields = $.map(fields, function(a) {
        return '"' + a.replace(/"/g, '""') + '"'
      });
      output += fields.join(',') + "\r\n";
    });
    if ( options.mode  == 'download' ) {
      var el = document.createElement('a');
      el.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent('\ufeff' + output));
      el.setAttribute('download', "ao3_work_stats.csv");
      el.style.display = 'none';
      document.body.appendChild(el);
      el.click();
      document.body.removeChild(el);
      /*window.open("data:text/csv;charset=utf-8," + encodeURIComponent(output));*/
    }
    else {
      csv_window = window.open("", "");
      csv_window.document.write("<pre>" + output + "</pre>");
      csv_window.document.close();
      csv_window.focus()
    }
    })(jQuery);
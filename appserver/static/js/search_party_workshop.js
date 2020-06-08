require(['splunkjs/mvc', 'splunkjs/mvc/utils','splunkjs/mvc/simplexml/ready!'], function(mvc, utils){
  function getQueryParams(qs) {
    qs = qs.split("+").join(" ");

    var params = {};
    var tokens;
    var i=0;
    var re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
      params[i] = {};
      params[i].name = decodeURIComponent(tokens[1]);
      var param_value = decodeURIComponent(tokens[2]);
      if(param_value.search(/\[.*\]/) >= 0) { // then it's an array
        params[i].value = JSON.parse(param_value);
      } else {
        params[i].value = param_value;
      }
      params[params[i].name] = params[i].value;
      i++;
    }
    params.length = i;
    return params;
  };

  var params = getQueryParams(document.location.search);

  for (var i=0;i<params.length;i++) {
    var tok_default   = mvc.Components.getInstance("default");
    var tok_submitted = mvc.Components.getInstance("submitted");

    tok_default.set(params[i].name, params[i].value);

    if(params[i].name === "mod") {
      if(params[i].value === "web") {
        tok_default.set("stype", "access_combined");
        tok_default.set("idx", "web");
      } else if(params[i].value === "win") {
        tok_default.set("stype", "WinEventLog:Security");
        tok_default.set("idx", "windows");
      }
    }

    tok_submitted.set(tok_default.toJSON());
  };
});

require(["jquery", "splunkjs/mvc", "splunkjs/mvc/searchbarview", "splunkjs/mvc/searchcontrolsview", "splunkjs/mvc/simplexml/ready!",], function($, mvc, SearchbarView, SearchControlsView) {
  $('.container li a').on('click', function(event) {
    $('.nav.active a').data('scrollTop',$(scrollup)[0].scrollTop);
    $(scrollup)[0].scrollTop-=$(scrollup).scrollTop();
    $(scrollup)[0].scrollTop+=jQuery(this).data('scrollTop');
  });

  $('.continue').click(function(e) {
    e.preventDefault();

    var this_id = $(this).closest("div").prop("id");
    var id_num = parseInt(this_id.match(/\d+/), 10);
    var next_id = this_id.replace(id_num, id_num + 1);

    $('.nav-tabs a[href="#' + next_id + '"]').tab('show');
  })

  var submitToken = function(k,v){
    mvc.Components.getInstance('submitted').set(k, v);
  }    
  var searchbarView = new SearchbarView({
    managerid: "search1",
    search: "index=_internal | head 500"
  });
  var searchControls = new SearchControlsView({
    managerid: "search1"
  });
  searchbarView.on('change', function(){
    submitToken('query', searchbarView.val());
    submitToken('queryEarliest', searchbarView.timerange.val().earliest_time);
    submitToken('queryLatest', searchbarView.timerange.val().latest_time);       
  });
  searchbarView.timerange.on("change", function() {
    submitToken('queryEarliest', searchbarView.timerange.val().earliest_time);
    submitToken('queryLatest', searchbarView.timerange.val().latest_time);       
  });
  searchbarView.render().$el.appendTo($('#search'));
  searchControls.render().$el.appendTo($('#search_controls'));
});

$('#collapse').click(function(){
  $('#ls_info').slideToggle('slow');
  return false;
});

$('#show').click(function(){
  $('#history_table').slideToggle('slow');
  $('html, body').animate({scrollTop: $(document).height()}, 'slow');
  return false;
});

$("li.dropdown").click(function() {
  $(this).children("ul").slideToggle('fast');
});

require(['jquery','underscore','splunkjs/mvc', 'bootstrap.tab', 'splunkjs/mvc/simplexml/ready!'],
    function($, _, mvc){

  // Show the first tab
  $('.toggle-tab').first().trigger('shown');
  
  // Make the tabs into tabs
  $('#tabs', this.$el).tab();

  // Make them resizable up and down
  $('#tab-content').resizable({ handles: 's' });
});

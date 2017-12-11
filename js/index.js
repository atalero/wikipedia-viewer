$(document).ready(function(){
        
  var maxElements = 10; //max elements to diaplay for any given search  
  //Cache the DOM
  $resultsBox = $("#results-box"); 
  $target = $("#target");
  $results = $("#results");  
  $form = $("form");
  main();  

  function main(){
      
        $target.submit(function(event) {    
          console.log("submit button clicked");
          event.preventDefault();
          event.stopImmediatePropagation();
          getElements();
        });
    }  
  
  //Call the API and get the top ten results containing the search words, then call viewElements to view results      
  
  function getElements(){  
          console.log("get elements called");
          var input = $("input").val();
          var regEx = /^\s*$/;
          //Check that the input is something other than white space
          if(!input.match(regEx)){  
            var url = "https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&prop&exintro&srsearch=" + 
                input;
            $.ajax({
              url: url,
              dataType: "jsonp"
            }).done(function(data){
                viewElements(data);
              });   
          } else {
            alert("Please enter a valid input");
            main();
          }
  }

    //Display top ten elements accorfint to search terms
  function viewElements(data){
      console.log("view elements called");
    
      console.log("fading form out");
      $target.fadeOut(1000);
      console.log("fading results in");
      $("#results-box").fadeIn(1000);
     
      for(var x = 0; x < maxElements; x++){
        getDescription(data.query.search[x].title);      
      }
  
      $("button").on("click",function(event){
        console.log("back button clicked");
        event.preventDefault();
        event.stopImmediatePropagation();
        console.log("results fade out");
        $resultsBox.fadeOut(1000); 
        
        console.log("form fade in");
       
        $form.delay(1000).fadeIn(1000, function(){
          $results.html("");
        });
        $('input:text').val('');
      });
      
    }

  function getDescription(title){
  console.log("get description called");
   var url = "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=" + encodeURI(title);
   var description;
   $.ajax({
       url: url,
       dataType: "jsonp"
    }).done(function(data){
       var x = Object.keys(data.query.pages)[0];
       var wikiLink = "http://en.wikipedia.org/?curid=" + x;
       var matches = /^.*[.?!]\s/.exec((data.query.pages[x].extract));
       $results.append("<a href=\"" + wikiLink + "\" target='blank'>" + "<div class='entry'><strong>" + title + "</strong>" + "<p>" + matches[0] + "</p></div></a>");
       });
  } 
  
});
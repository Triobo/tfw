function init(){
  var main; /* hlavní div */
  desktop.init("desktop");
  desktop.layers[desktop.activeLayer].add(main = tfw.div({}));
  main.add(tfw.par({text:"Testovací stránka"}));
  main.add(tfw.button({text:"Otevři dialog", action:testovaciDialog}));

/*  var table;
  main.add(table=tfw.dynamicTable({id:"test"}));*/

  tfw.calendar.placeCalendar = function(cal, input){
	                                                                                                                                                                                                                                                                                        input.parentNode.insertBefore(cal, input);
  };
}

function testovaciDialog(){
  var dlg = tfw.dialog({
    width:300,
    height:300,
    title:"Test",
    children:[
      tfw.input({id:"mojedata", style:"width:150px", value:0, legend:"Zadej data:", legendStyle:"width:100px", evaluate:1}),
      tfw.textArea({id:"delsitext", style:"width:150px;height:60px;", legend:"Text:", legendStyle:"width:100px"}),
      tfw.checkbox({id:"blokuj", text:"Toto zakáže vstupní pole", onchange:function(){$("mojedata").disabled = this.value;}}),
      tfw.button({text:"Zapni volbu", action:function(){$("blokuj").value = 1;}}),
      tfw.button({text:"Vypni volbu", action:function(){$("blokuj").value = 0;}}),
      tfw.dropDown({id:"anone", list:[{id:0, t:"Ne"}, {id:1, t:"Ano"}], value:0})
    ],
    buttons:[
      {text:"Ok", default:1, action:function(){window.alert("ok");}},
      {text:"Zavřít", action:desktop.closeTopLayer}
    ]
  });
}



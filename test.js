/* global tfw desktop $ */
/* exported init */

function init(){
  var main; /* hlavní div */
  desktop.init("desktop");
  desktop.layers[desktop.activeLayer].add(main = tfw.div({}));
  main.add(tfw.par({text: "Testovací stránka"}));
  main.add(tfw.button({text: "Otevři dialog", action: testovaciDialog}));
}

function testovaciDialog(){
  tfw.dialog({
    width: 400,
    height: 500,
    title: "Test",
    children: [
      tfw.tabs({
        id: "vodorovneZalozky",
        style: "width: 100%; height: 350px;",
        tabs: [
          {title: "První", id: "idjedna", children: [
            tfw.input({
              id: "mojedata",
              style: "width: 150px",
              value: 0,
              legend: "Zadej data: ",
              legendStyle: "width: 100px",
              evaluate: 1
            }),
            tfw.textArea({
              id: "delsitext",
              style: "width: 150px;height: 60px;",
              legend: "Text:",
              legendStyle: "width: 100px"
            }),
            tfw.checkbox({
              id: "blokuj",
              text: "Toto zakáže vstupní pole",
              onchange: function(){$("mojedata").disabled = this.value;}
            }),
            tfw.button({
              text: "Zapni volbu",
              action: function(){$("blokuj").value = 1;}
            }),
            tfw.button({
              text: "Vypni volbu",
              action: function(){$("blokuj").value = 0;}
            }),
            tfw.dropDown({
              id: "anone",
              list: [
                {id: 0, t: "Ne"},
                {id: 1, t: "Ano"}
              ],
              value: 0
            })
          ]},
          {title: "Druhá", id: "iddva", innerHTML: "Obsah druhé záložky"},
          {title: "Třetí", id: "idtri", children: [
            tfw.tabs({
              id: "svisleZalozky",
              orientation: tfw.orientation.vertical,
              style: "width:100%; height: 200px;",
              styleTabs: "width:80px;",
              tabs: [
                {title: "První", innerHTML: "Toto je obsah první záložky"},
                {title: "Druhá", children: [tfw.par({text: "Toto je druhá"})]},
                {title: "Třetí", innerHTML: "A toto je třetí"}
              ]
            })
          ]}
        ]
      })
    ],
    buttons: [
      {text: "Ok", default: 1, action: function(){window.alert("ok");}},
      {text: "Zavřít", action: desktop.closeTopLayer}
    ]
  });
}



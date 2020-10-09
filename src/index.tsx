import React from 'react';
import ReactDom from 'react-dom';

import App from './App';

const scope = document.getElementById('main');
const images = scope.getElementsByTagName('img');
const numberOfImages = images.length;
let imagesArray = [];

// check if images exists
if (numberOfImages > 0) {

    const backgroundOverlay = document.createElement("div");
    scope.appendChild(backgroundOverlay);

    for (let i=0; i < images.length; i++) {
        let image = images[i];
        let src = images[i].getAttribute('data-source');

        image.addEventListener('click', () => {
            backgroundOverlay.style.display = "block";
            ReactDom.render(<App images={imagesArray} item={i} target={backgroundOverlay}/>, backgroundOverlay);
        });

        imagesArray[i] = src;
    }
}

/*const main = document.getElementById('main') 
    ? document.getElementById('main') : (document.getElementById('container') ? document.getElementById('container') : document.getElementById('wrapper'));
const imagesOnMain = main.getElementsByTagName('img');
const items = [];

for(let k in imagesOnMain) {
    let item = imagesOnMain[k];
    if (typeof item === 'object') {
        items[k] = item;
        item.style.cursor = "pointer";  
        item.addEventListener('click', function(ev: any) {
            if (ev.target.parentNode.tagName !== "A") {
                imageWindow(k, items);
            }
        });
    }
}*/

function imageWindow(k, items) 
{    
    var src = items[k].getAttribute('data-source');    
    var caption = items[k].getAttribute('data-caption');
    var nitems = items.length;
    
    // div wrapper
    var div = document.createElement('div');
    div.className = "imagewindow";
    
    // button close
    var buttonClose = document.createElement('img');
    buttonClose.className = "imagewindow-buttonclose";
    buttonClose.setAttribute('src', '//pirenopolis.tur.br/fwcSrc/images/close_40x40.png');
    buttonClose.onclick = function() { 
        Overlay.close(); 
    };
    div.appendChild(buttonClose);
        
    // arrow left
    if (k > 0) {
        var arrowLeft = document.createElement('div');
        arrowLeft.className = "imagewindow-arrow imagewindow-arrow-left";
        arrowLeft.onclick = function() { 
            imageWindow(k-1, items);
        };
        div.appendChild(arrowLeft);        
    }
    
    // figure
    var figure = document.createElement('figure');
    figure.className = "imagewindow-figure";
    div.appendChild(figure);
    
    // img
    var img = document.createElement('img');   
    img.className = "imagewindow-img";
    img.setAttribute('src', src);
    //figure.appendChild(img);
    
    // figcaption
    if (caption) {
        var figcaption = document.createElement('figcaption');
        figcaption.className = "imagewindow-figcaption";
        figcaption.innerHTML = caption;
        figure.appendChild(figcaption);
    }
    
    // arrow left
    var next = parseInt(k)+parseInt(1);
    if (next < nitems) {
        var arrowRight = document.createElement('div');
        arrowRight.className = "imagewindow-arrow imagewindow-arrow-right";
        arrowRight.onclick = function(){
            imageWindow(next, items);
        };
        div.appendChild(arrowRight);
    }
    
    // insert style
    div.appendChild(imageWindowStyle());
    
    // show div
    Overlay.show(div);
    
    img.onload = function()
    {
        
        figure.appendChild(img);
        // centralize
        Overlay.reposition();
        // height arrows
        if (arrowLeft) {
           arrowLeft.style.height = img.clientHeight+"px";
        }
        if (arrowRight) {
           arrowRight.style.height = img.clientHeight+"px";
        }
    };     
}

function imageWindowStyle() {
    var style = document.createElement('style');
    style.innerHTML = "\
.imagewindow { display: inline-block; background: url('//pirenopolis.tur.br/fwcSrc/images/loading.gif') no-repeat center black; padding: 10px; position: relative; text-align: center; }\n\
.imagewindow-buttonclose { position: absolute; right: 0; top: 0; cursor: pointer; z-index: 20; width: 30px; }\n\
.imagewindow-arrow { background-color: rgba(250,250,250,0.3); background-repeat: no-repeat; background-position: center center; position: absolute; top: 10px; cursor: pointer; width: 10%; transition: width 0.5s; z-index: 10; }\n\
.imagewindow-arrow-left { background-image: url('//pirenopolis.tur.br/fwcSrc/images/arrow-left.png'); left: 10px; }\n\
.imagewindow-figure { line-height: 0; min-width: 240px; min-height: 180px; background-color: white; background-image: url('//pirenopolis.tur.br/fwcSrc/images/loading.gif'); background-repeat: no-repeat; background-position: center; }\n\
.imagewindow-img { line-height: 0; }\n\
.imagewindow-figcaption { position: absolute; left: 0; bottom: 0; width: 90%; line-height: normal; color: white; font-style: italic; padding: 10px 5%; overflow: hidden; background-color: rgba(0, 0, 0, 0.5); }\n\
.imagewindow-arrow-right { background-image: url('//pirenopolis.tur.br/fwcSrc/images/arrow-right.png'); right: 10px;}";
    return style;
}

/* OVERLAY
========================================================== */
const Overlay = {
    scrollTop: function(){        
        return window.scrollY; // altura do scroll
    },
    overlayWrapper: function(){
        return document.getElementById('overlayWrapper');
    },
    show: function(item) 
    {
        // check if overlay exists
        if (document.getElementById('overlayWrapper') || document.getElementById('overlay')) {
            this.close();
        }
        // CRIA A DIV OVERLAY
        var overlay = document.createElement("div");
        overlay.setAttribute("id", "overlay");
        overlay.setAttribute("style", "background-color: rgba(0,0,0,0.5); position: absolute; left: 0; top: 0; width: 100%; z-index: 100; height: "+document.body.scrollHeight+"px");  
        document.body.appendChild(overlay); 
        //$(overlay).fadeIn('500').fadeTo('10').css( 'height', $('body').height() );
        
        // CRIA O ENVELOPE (wrapper)
        var overlayWrapper = document.createElement("div");
        overlayWrapper.setAttribute("id", "overlayWrapper");
        overlayWrapper.setAttribute("style", "position: absolute; z-index: 101; ");
        
        // ADICIONA O CONTEÚDO
        if (typeof item === 'object') {
            overlayWrapper.appendChild(item);
        } else {
            overlayWrapper.innerHTML = item;
        }
        
        // APENSA NO DOCUMENTO
        document.body.appendChild(overlayWrapper);        
        // define oobjeto a ser visualizado
        var obj = overlayWrapper.firstChild; 
        // POSICIONA O ENVELOPE
        Overlay.reposition();
        // 
        var closebutton = document.getElementById("closebutton");
        if(closebutton){
            closebutton.style.width = obj.offsetWidth+'px';
            closebutton.style.margin = '0 auto';
        }
        // FECHA OVERLAY       
        overlay.onclick = function(){
           //$(overlayWrapper).remove();
           //$(overlay).remove(); 
        }; 
        // RESIZE
        window.onresize = function(){
            Overlay.reposition();
        }       
    },
    reposition: function(){  
        const obj = document.getElementById('overlayWrapper').firstChild; 
        const overlayWrrapper = document.getElementById('overlayWrapper');
        //$('#overlayWrapper').css( 'left','0' ); 
        //$('#overlayWrapper').css( 'top','0' ); 
        obj.setAttribute('style',"width: auto;");
        var objWidth = obj.offsetWidth;
        var objHeight = obj.offsetHeight;
        
        // POSICIONAMENTO VERTICAL
        // altura da janela      
        var windowHeight = window.innerHeight; 
        // altura do scroll
        var scrollTop = window.scrollTop; 
        // altura do objeto
        if(objHeight > windowHeight){
            var objectWidth =  windowHeight*(objWidth/objHeight);
            var objectHeight = windowHeight;
            obj.setAttribute('style',"width: "+(Math.ceil(objectWidth)-20)+"px;");
        }else{
            var objectHeight =  objHeight;
        }
        
        // posicionamento do objeto
        var top = scrollTop + ((windowHeight - objectHeight)/2);
        if( top < 0 || top < window.scrollY ){
            top = window.scrollY;
        }
        //$('#overlayWrapper').css( 'top', top+'px' ); 
        
        // posicionamento horizontal      
        var windowWidth = window.innerWidth; // largura da janela
        var objectWidth = obj.offsetWidth; // largura do objeto 
        var left = (windowWidth - objectWidth)/2;
        //$('#overlayWrapper').css( 'left', left+'px' );           
    },
    close: function(){        
        var overlayWrapper = document.getElementById("overlayWrapper");
        if(overlayWrapper){
            document.body.removeChild(overlayWrapper);
        }        
        var overlay = document.getElementById("overlay");
        if(overlay){
            document.body.removeChild(overlay);
        }        
    }
};
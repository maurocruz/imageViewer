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

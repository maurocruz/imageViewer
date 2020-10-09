import React, { useEffect, useState } from 'react';

import './App.css';

const App = (props:any) => {
    const root = location.protocol+'//'+location.hostname;

    const itemKey = props.item;
    const imagesArray = props.images;
    const background: HTMLDivElement = props.target;
  
    const [src, setSrc] = useState('');
    const [top, setTop] = useState<number>(window.pageYOffset);
    const [windowWidth, setwindowWidth] = useState<number>(document.body.offsetWidth);
    const [windowHeight, setwindowHeight] = useState<number>(window.outerHeight);
    const [imageOriginalWidth, setimageOriginalWidth] = useState<number>(0);
    const [imageOriginalHeight, setimageOriginalHeight] = useState<number>(0);
    const [imageWidth, setImageWidth] = useState<number>(0);
    const [imageHeight, setImageHeight] = useState<number>(0);
    const [imageMarginTop, setImageMarginTop] = useState<number>(0);
    const [imageMarginLeft, setImageMarginLeft] = useState<number>(0);
    
    // FIGURE LOAD   
    useEffect(() => {        
        let image = new Image();
        image.onload = () => {
            setSrc(image.src);
            setimageOriginalWidth(image.width);
            setimageOriginalHeight(image.height);
            setPosition(image.width, image.height);
        }
        image.src = root + imagesArray[itemKey];
    },[itemKey]);


    document.body.onscroll = function() {
        setTop(window.pageYOffset); 
    }

    window.onresize = function() {
        setwindowHeight(window.outerHeight);
        setwindowWidth(document.body.offsetWidth);
        setPosition(imageOriginalWidth, imageOriginalHeight);
    }

    function setPosition(imageW: number, imageH: number) {
        const ratio = imageW/imageH;        

        if (imageH > windowHeight) {
            imageW = ratio * windowHeight;
            setImageHeight(windowHeight);
            setImageWidth(imageW);
        }

        if (imageW > windowWidth) {
            imageH = windowWidth / ratio;
            setImageWidth(windowWidth);
            setImageHeight(imageH);
        }

        const marginLeft = windowWidth > imageW ? (windowWidth - imageW)/2 : 0;
        setImageMarginLeft(marginLeft);

        const marginTop = windowHeight > imageH ? (windowHeight - imageH)/2 : 0;
        setImageMarginTop(marginTop);
        
    }

    function handleImageClick(e: React.MouseEvent<HTMLImageElement,MouseEvent>) {
        e.preventDefault();
        e.stopPropagation(); 
    }

    function handleArrowRightClick(e: React.MouseEvent<HTMLImageElement,MouseEvent>) {
        e.stopPropagation(); 
        console.log(itemKey);
        console.log(imagesArray);
    }

    function handleArrowLeftClick(e: React.MouseEvent<HTMLImageElement,MouseEvent>) {
        e.stopPropagation(); 
        console.log(itemKey);
        console.log(imagesArray);
    }

    function handleBackgroundClick() { 
        background.style.display = "none";
    }

    // STYLES
    const backgroundStyle = {
        top: Math.round(top)+"px",
        height: windowHeight+"px"

    }
    const containerStyle = {
        marginTop: Math.round(imageMarginTop)+'px',
        marginLeft: Math.round(imageMarginLeft)+'px',
        maxHeight: windowHeight+'px'
    }

    const imgStyle = {
        maxHeight: windowHeight+'px'
    }

    const arrow = {
        height: imageHeight+'px'
    }

    /*<div className="imageGallery-arrow imageGallery-arrow-left" style={arrow} onClick={handleArrowLeftClick}><span></span></div>
    <img className="imageGallery-img" src={src} style={imgStyle} id="imageGallery-img"/>
    <div className="imageGallery-arrow imageGallery-arrow-right" style={arrow} onClick={handleArrowRightClick}><span></span></div>*/
    return (
        <>
            <div className="imageGallery-background" style={backgroundStyle} onClick={handleBackgroundClick} >
                <div className="imageGallery-container" style={containerStyle}>
                    <img className="imageGallery-img" src={src} style={imgStyle} id="imageGallery-img" onClick={handleImageClick}/>
                </div>
            </div>
        </>
    );
}

export default App;
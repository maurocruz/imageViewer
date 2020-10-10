import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import './App.css';

const App = (props:any) => {
    const imagesAttributes: NamedNodeMap = props.images;
    const background: HTMLDivElement = props.target;

    const totalImages = imagesAttributes.length;
    const root = location.protocol+'//'+location.hostname;
    
    const [item, setItem] = useState<number>(props.item);
    const [sizes, setSizes] = useState('');
    const [srcset, setSrcset] = useState('');
    const [src, setSrc] = useState('');
    const [caption, setCaption] = useState('');
    const [scrollTop, setScrollTop] = useState<number>(window.pageYOffset || document.documentElement.scrollTop);
    const [scrollLeft, setScrollLeft] = useState<number>(window.pageXOffset || document.documentElement.scrollLeft);
    const [windowWidth, setwindowWidth] = useState<number>(document.body.offsetWidth);
    const [windowHeight, setwindowHeight] = useState<number>(window.innerHeight);
    const [imageOriginalWidth, setimageOriginalWidth] = useState<number>(0);
    const [imageOriginalHeight, setimageOriginalHeight] = useState<number>(0);
    const [imageWidth, setImageWidth] = useState<number>(0);
    const [imageHeight, setImageHeight] = useState<number>(0);
    const [imageMarginTop, setImageMarginTop] = useState<number>(0);
    const [imageMarginLeft, setImageMarginLeft] = useState<number>(0);
    
    const abortController = new AbortController();

    // FIGURE LOAD   
    useEffect(() => {   
        let image = new Image();
        image.onload = () => {
            setItem(item);
            setSrc(image.src);
            setimageOriginalWidth(image.width);
            setimageOriginalHeight(image.height);
            setPosition(image.width, image.height);
        }
        
        let imageSelected = imagesAttributes[item];
                    
        image.src = root + imageSelected['data-source'].value;
        setCaption(imageSelected['data-caption'].value);

    },[item]);

    window.addEventListener('orientationchange', resize );

    window.onresize = resize;

    window.onscroll = function() {
        if (abortController.signal.aborted === false) {
            setScrollTop(window.pageYOffset || document.documentElement.scrollTop);
        }
    };

    document.onkeydown = function (e: any) {
        if (abortController.signal.aborted === false) {
            if (e.key == "ArrowLeft" && item > 0) handlePreviousImage(e);
            if (e.key == "ArrowRight" && item+1 < totalImages) handleNextImage(e);
            if (e.key == "ArrowUp" || e.key == "ArrowDown") close();
        }
    };

    function resize() {
        console.log(abortController.signal);
        if (abortController.signal.aborted === false) {
            setwindowHeight(window.innerHeight);
            setwindowWidth(document.body.offsetWidth);
            setPosition(imageOriginalWidth, imageOriginalHeight);
        }
    }

    function setPosition(imageW: number, imageH: number) {
        setImageWidth(imageW);
        setImageHeight(imageH);

        const ratio = imageW/imageH;        

        if (imageH > windowHeight) {
            imageW = ratio * windowHeight;
            //setItem(null);
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

    function handleNextImage(e: React.MouseEvent<HTMLImageElement,MouseEvent>) {
        e.stopPropagation(); 
        setItem(item+1);
        
    }

    function handlePreviousImage(e: React.MouseEvent<HTMLImageElement,MouseEvent>) {
        e.stopPropagation(); 
        setItem(item-1);
    }


    function close() {
        abortController.abort();
        ReactDOM.unmountComponentAtNode(background);
    }

    // STYLES
    const backgroundStyle = {
        top: Math.round(scrollTop)+"px",
        height: windowHeight+"px",
        width: windowWidth+'px'
    }
    const containerStyle = {
        maxHeight: windowHeight+'px'
    }

    const imgStyle = {
        maxHeight: windowHeight+'px'
    }

    const arrow = {
        height: imageHeight+'px'
    }

    const ArroWLeft = () => {
        if (item == 0) return <></>; 
        return ( <div className="imageGallery-arrow imageGallery-arrow-left" style={arrow} onClick={handlePreviousImage}><span></span></div> );
    };

    const ArrowRight = () => {
        if (item+1 == totalImages) return <></>;
        return ( <div className="imageGallery-arrow imageGallery-arrow-right" style={arrow} onClick={handleNextImage}><span></span></div> );
    };
    
    const ButtonClose = () => {
        return (
            <div className="button-close" onClick={close}>
                <div className="button-close-left"></div>
                <div className="button-close-right"></div>
            </div>
        );
    };

    const Img = () => {
        return  <img className="imageGallery-img" src={src} style={imgStyle} id="imageGallery-img" onClick={handleImageClick}/>;
    };

    const Caption = () => {
        if (caption == '') return <></>;
        return <figcaption className="imageGallery-figcaption">{caption}</figcaption>
    };

    return (
        <>
            <div className="imageGallery-background" style={backgroundStyle} onClick={close} >
                <div className="imageGallery-container" style={containerStyle}>
                    <ButtonClose/>
                    <ArroWLeft/>                    
                    <Img/>
                    <Caption/>
                    <ArrowRight/>
                </div>
            </div>
        </>
    );
}

export default App;
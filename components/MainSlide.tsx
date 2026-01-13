'use client';
import Image from "next/image";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from "react-slick";
import { forwardRef, useImperativeHandle, useRef } from "react";

interface SlideHandle {
    next: () => void;
    prev: () => void;
}

const MainSlide = forwardRef<SlideHandle>((_, ref) => {
    const sliderRef = useRef<Slider>(null);

    useImperativeHandle(ref, () => ({
            next: () => sliderRef.current?.slickNext(),
            prev: () => sliderRef.current?.slickPrev(),
        
    }));

    const settings = {
        dots: false,
        infinite: true,
        arrows: false,
        speed: 2500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        fade: true,
        autoplaySpeed: 3000,
        pauseOnHover: false,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 1,
                }
            },
        ]
    };

    return (
        <Slider ref={sliderRef} {...settings} className="main-slider">
            <div>
                <Image src="/images/banner_1.jpg" alt="기업·어린이 행사 기획 및 대행 전문" width={2560} height={942} priority quality={100} />
            </div>
            <div>
                <Image src="/images/banner_2.jpg" alt="기업·어린이 행사 기획 및 대행 전문" width={2560} height={942} priority quality={100} />
            </div>
            <div>
                <Image src="/images/banner_3.jpg" alt="기업·어린이 행사 기획 및 대행 전문" width={2560} height={942} priority quality={100} />
            </div>
            <div>
                <Image src="/images/banner_4.jpg" alt="기업·어린이 행사 기획 및 대행 전문" width={2560} height={942} priority quality={100} />
            </div>
        </Slider>
    )
})

MainSlide.displayName = 'MainSlide';
export default MainSlide;
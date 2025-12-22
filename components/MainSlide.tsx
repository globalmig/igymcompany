'use client';
import Image from "next/image";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from "react-slick";

export default function MainSlide() {
    const settings = {
        dots: true,
        infinite: true,
        arrows: false,
        speed: 2500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4500,
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
        <Slider {...settings} className="main-slider">
            <div>
                <Image src="/images/banner_1.jpg" alt="배너1" width={2560} height={715} priority quality={100} />
            </div>
            <div>
                <Image src="/images/banner_1.jpg" alt="배너2" width={2560} height={715} priority quality={100} />
            </div>
            <div>
                <Image src="/images/banner_1.jpg" alt="배너3" width={2560} height={715} priority quality={100} />
            </div>
        </Slider>
    )
}
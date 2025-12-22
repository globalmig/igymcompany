'use client';
import Image from "next/image";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from "react-slick";
import { PRODUCT } from "@/data/product";

export default function ExperienceSlide() {

    const experience = PRODUCT.filter(p => p.category === "experience");

    const settings = {
        dots: true,
        infinite: true,
        arrows: false,
        speed: 500,
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
        <Slider {...settings} className="ex-slider">
            {experience.map(e =>
                <div key={e.id}>
                    <div>
                        <Image src={e.thumnail} alt={e.name} width={320} height={392}/>
                    </div>
                    <div>
                        <h3>{e.name}</h3>
                    </div>
                </div>
            )}
        </Slider>
    )
}
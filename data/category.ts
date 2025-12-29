export const CATEGORY_MAP: { [key: string]: { title: string; icon?: string, banner: string; menu_img: string; categories?: { name: string, url: string, }[] } } = {
    about: {
        title: '회사소개',
        banner: "/images/about_banner.jpg",
        menu_img: "",
    },
    inquire: {
        title: '문의하기',
        banner: "/images/inquire_banner.jpg",
        menu_img: "",
    },
    event: {
        title: '공식행사/지역축제',
        icon: "/icons/category_event.png",
        banner: "/images/event_banner.jpg",
        menu_img: "/images/공식행사메뉴.jpg",
    },
    truss: {
        title: '조립식무대/트러스',
        icon: "/icons/category_truss.png",
        banner: "/images/truss_banner.jpg",
        menu_img: "/images/트러스메뉴.jpg",
    },
    sound: {
        title: '음향 시스템',
        icon: "/icons/category_sound.png",
        banner: "/images/sound_banner.jpg",
        menu_img: "/images/음향메뉴.jpg",
    },
    rental: {
        title: '천막/테이블/의자/행사용품',
        icon: "/icons/category_rental.png",
        banner: "/images/rental_banner.jpg",
        menu_img: "/images/렌탈메뉴.jpg",
    },
    airbounce: {
        title: '에어바운스',
        icon: "/icons/category_airbounce.png",
        banner: "/images/에어바운스/banner.jpg",
        menu_img: "/images/에어바운스메뉴.jpg",
        // categories: [
        //     { name: "캐릭터 에어바운스", url: "character",},
        //     { name: "스포츠 에어바운스", url: "sports",},
        //     { name: "놀이터 에어바운스", url: "playground",},
        //     { name: "챌린지 에어바운스", url: "challenge",},
        // ],
    },
    waterslide: {
        title: '워터슬라이드',
        icon: "/icons/category_waterslide.png",
        banner: "/images/워터슬라이드/banner.jpg",
        menu_img: "/images/워터슬라이드메뉴.jpg",
        // categories: [
        //     { name: "캐릭터 워터슬라이드", url: "character",},
        //     { name: "아이스크림 워터슬라이드", url: "icecream",},
        //     { name: "기타", url: "more",},
        // ],
    },
    amusement: {
        title: '놀이기구',
        icon: "/icons/category_amusement.png",
        banner: "/images/놀이기구/banner.jpg",
        menu_img: "/images/놀이기구메뉴.jpg",
    },
    sports_competition: {
        title: '체육대회',
        icon: "/icons/category_sports.png",
        banner: "/images/sports_banner.jpg",
        menu_img: "/images/체육대회메뉴.jpg",
    },
    experience: {
        title: '체험놀이',
        icon: "/icons/category_experience.png",
        banner: "/images/체험놀이/banner.jpg",
        menu_img: "/images/체험놀이메뉴.jpg",
        // categories: [
        //     { name: "캐릭터 에어바운스", url: "character",},
        //     { name: "스포츠 에어바운스", url: "sports",},
        //     { name: "놀이터 에어바운스", url: "playground",},
        //     { name: "챌린지 에어바운스", url: "challenge",},
        // ],
    },
};
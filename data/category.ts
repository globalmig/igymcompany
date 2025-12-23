export const CATEGORY_MAP: { [key: string]: { title: string; icon?: string, banner: string; categories?: { name: string, url: string,}[] } } = {
    about: {
        title: '회사소개',
        banner: "/images/about_banner.jpg",
    },
    inquire: {
        title: '문의하기',
        banner: "/images/inquire_banner.jpg",
    },
    truss : {
        title: '조립식무대/트러스',
        icon: "/icons/category_truss.png",
        banner: "/images/truss_banner.jpg",
    },
    sound : {
        title: '음향 시스템',
        icon: "/icons/category_sound.png",
        banner: "/images/sound_banner.jpg",
    },
    rental : {
        title: '행사 용품 렌탈',
        icon: "/icons/category_rental.png",
        banner: "/images/rental_banner.jpg",
    },
    event: {
        title: '공식행사',
        icon: "/icons/category_event.png",
        banner: "/images/event_banner.jpg",
    },
    airbounce: {
        title: '에어바운스',
        icon: "/icons/category_airbounce.png",
        banner: "/images/에어바운스/banner.jpg",
        // categories: [
        //     { name: "캐릭터 에어바운스", url: "character",},
        //     { name: "스포츠 에어바운스", url: "sports",},
        //     { name: "놀이터 에어바운스", url: "playground",},
        //     { name: "챌린지 에어바운스", url: "challenge",},
        // ],
    },
    amusement: {
        title: '놀이기구',
        icon: "/icons/category_amusement.png",
        banner: "/images/놀이기구/banner.jpg",
    },
    waterslide: {
        title: '워터슬라이드',
        icon: "/icons/category_waterslide.png",
        banner: "/images/워터슬라이드/banner.jpg",
        // categories: [
        //     { name: "캐릭터 워터슬라이드", url: "character",},
        //     { name: "아이스크림 워터슬라이드", url: "icecream",},
        //     { name: "기타", url: "more",},
        // ],
    },
    sports_competition: {
        title: '체육대회',
        icon: "/icons/category_sports.png",
        banner: "/images/sports_banner.jpg",
    },
    experience: {
        title: '체험놀이',
        icon: "/icons/category_experience.png",
        banner: "/images/체험놀이/banner.jpg",
        // categories: [
        //     { name: "캐릭터 에어바운스", url: "character",},
        //     { name: "스포츠 에어바운스", url: "sports",},
        //     { name: "놀이터 에어바운스", url: "playground",},
        //     { name: "챌린지 에어바운스", url: "challenge",},
        // ],
    },
};
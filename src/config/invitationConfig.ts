export interface CeremonyProgramGroup {
  period: string;
  items: string[];
}

export interface HighlightCardData {
  id: string;
  title: string;
  subtitle: string;
  dayLabel: string;
  targetId: string;
  theme: 'burgundy' | 'navy' | 'emerald';
  image?: string;
  imageFocus?: 'top' | 'center';
  artworkType:
    | 'pad-pratishtha'
    | 'diksha'
    | 'drone-show'
    | 'bhakti-night'
    | 'pad-prakshalana'
    | 'mahapuja';
}

export interface DaySummaryCard {
  dayNumber: string;
  monthYear: string;
  dayLabel: string;
  title: string;
  theme: 'burgundy' | 'blue' | 'emerald';
  targetId: string;
}

export const CONFIG = {
  greeting: '॥ जय जिनेन्द्र ॥',
  eventTitle: 'श्रमणोन्नायक महोत्सव',
  tagline: 'यह उत्सव नहीं, महा-महोत्सव है!',
  datesDisplay: '15, 16 एवं 17 दिसंबर 2026',
  venueName: 'सुमतिधाम, इंदौर',
  organizer: 'सुमतिधाम परिवार, इंदौर',
  mapsUrl: 'https://maps.app.goo.gl/YoZm2P24ibfAYw4M9?g_st=awb',

  /**
   * Countdown display convention:
   * Since no exact opening ceremony clock time was provided in the brief,
   * the countdown targets 15 December 2026 at 06:00:00 IST (Asia/Kolkata, UTC+05:30),
   * representing the morning commencement of Pratham Divas, without claiming
   * an unverified ceremony hour in the UI.
   */
  countdownTargetIsoIST: '2026-12-15T06:00:00+05:30',

  images: {
    logo: '/assets/sumati-dham-logo.png',
    temple: '/assets/sumati-dham-temple.jpg',
    hostsBoxScene: '/assets/royal-hosts-box.jpg',
    hostsHandsOverlay: '/assets/royal-hosts-hands.png',
    acharyaMain: '/assets/acharya-shri-01.jpg',
    acharyaGallery: [
      {
        src: '/assets/acharya-shri-02.jpg',
        alt: 'आचार्य श्री का पावन सान्निध्य — सिंहासन पर प्रवचन मुद्रा',
      },
      {
        src: '/assets/acharya-shri-03.jpg',
        alt: 'आचार्य श्री का पावन सान्निध्य — मंगल देशना',
      },
    ],
  },

  grandInvitation: {
    eyebrow: 'A GRAND SPIRITUAL CELEBRATION',
    heading: 'सादर मंगल आमंत्रण',
    body: 'सुमतिधाम परिवार, इंदौर की ओर से आयोजित श्रमणोन्नायक महोत्सव के पावन अवसर पर आप सपरिवार सादर आमंत्रित हैं। गुरु सान्निध्य, धर्म प्रभावना एवं मांगलिक आयोजनों से सुसज्जित इस त्रिदिवसीय महोत्सव में अपनी गरिमामयी उपस्थिति प्रदान कर आयोजन की शोभा बढ़ाएँ।',
    closingLine: 'आपकी मंगलमय उपस्थिति हमारे लिए सौभाग्य का विषय होगी।',
  },

  guruSannidhya: {
    eyebrow: 'GURU SANNNIDHYA',
    heading: 'गुरु सान्निध्य में मंगलमय महोत्सव',
  },

  threeDays: {
    eyebrow: 'THREE DAYS OF DIVINE CELEBRATION',
    heading: 'त्रिदिवसीय महोत्सव',
    supportingText: 'तीन दिवस, अनेक मंगल प्रसंग और धर्म प्रभावना के अविस्मरणीय क्षण।',
    cards: [
      {
        dayNumber: '15',
        monthYear: 'दिसंबर 2026',
        dayLabel: 'प्रथम दिवस',
        title: 'मंगलमय शुभारंभ',
        theme: 'burgundy',
        targetId: 'day-1',
      },
      {
        dayNumber: '16',
        monthYear: 'दिसंबर 2026',
        dayLabel: 'द्वितीय दिवस',
        title: 'आचार्य पद प्रतिष्ठा एवं भव्य दीक्षा समारोह',
        theme: 'blue',
        targetId: 'day-2',
      },
      {
        dayNumber: '17',
        monthYear: 'दिसंबर 2026',
        dayLabel: 'तृतीय दिवस',
        title: 'विशेष मांगलिक आयोजन',
        theme: 'emerald',
        targetId: 'day-3',
      },
    ] as DaySummaryCard[],
  },

  day1: {
    date: '15 दिसंबर 2026',
    dayNumber: '15',
    monthYear: 'दिसंबर 2026',
    dayLabel: 'प्रथम दिवस',
    heading: 'मंगलमय शुभारंभ',
    groups: [
      {
        period: 'प्रातःकाल',
        items: [
          'अभिषेक एवं शांतिधारा',
          'मंगल प्रवचन',
          'आहारचर्या',
          'मुनि दीक्षा हेतु गुरुचरणों में निवेदन',
        ],
      },
      {
        period: 'सायंकाल',
        items: ['जिज्ञासा समाधान', 'महाआरती'],
      },
      {
        period: 'रात्रि',
        items: ['आरोहण कार्यक्रम'],
      },
    ] as CeremonyProgramGroup[],
    gatha: 'जय से जयवंत, जगत्पूज्य भगवंत।',
  },

  day2: {
    date: '16 दिसंबर 2026',
    dayNumber: '16',
    monthYear: 'दिसंबर 2026',
    dayLabel: 'द्वितीय दिवस',
    heading: 'महोत्सव का भव्य मध्य दिवस',
    morningItems: ['अभिषेक एवं शांतिधारा', 'मंगल प्रवचन', 'आहारचर्या'],
    grandPanels: [
      {
        time: '11:30 बजे',
        shortTime: '11:30',
        title: 'आचार्य पद प्रतिष्ठा समारोह',
      },
      {
        time: '1:30 बजे',
        shortTime: '1:30',
        title: 'भव्य दीक्षा समारोह',
      },
    ],
    eveningItems: ['जिज्ञासा समाधान', 'महाआरती'],
    droneShow: {
      time: '7:00 से 8:00 बजे रात्रि',
      title: 'अद्भुत ड्रोन शो',
    },
    bhaktiNight: {
      period: 'रात्रि',
      title: 'भव्य भक्ति नाइट',
    },
  },

  day3: {
    date: '17 दिसंबर 2026',
    dayNumber: '17',
    monthYear: 'दिसंबर 2026',
    dayLabel: 'तृतीय दिवस',
    heading: 'मंगलमय समापन दिवस',
    highlight: {
      number: '1008',
      title: 'आचार्य पाद प्रक्षालन',
    },
    groups: [
      {
        period: 'प्रातःकाल',
        items: [
          'अभिषेक एवं शांतिधारा',
          '1008 आचार्य पाद प्रक्षालन',
          'आचार्य महापूजा',
          'मंगल प्रवचन',
          'विशेष आहारचर्या',
        ],
      },
      {
        period: 'सायंकाल',
        items: ['जिज्ञासा समाधान', 'महाआरती'],
      },
    ] as CeremonyProgramGroup[],
  },

  highlights: {
    eyebrow: 'SPECIAL CEREMONIES',
    heading: 'महोत्सव के प्रमुख आकर्षण',
    cards: [
      {
        id: 'aarohan',
        title: 'आरोहण कार्यक्रम',
        subtitle: '15 दिसंबर · जय से जयवंत, जगत्पूज्य भगवंत।',
        dayLabel: 'प्रथम दिवस',
        targetId: 'day-1',
        theme: 'burgundy',
        image: '/assets/highlight-aarohan.png',
        imageFocus: 'center',
        artworkType: 'pad-pratishtha',
      },
      {
        id: 'pad-pratishtha',
        title: 'आचार्य पद प्रतिष्ठा समारोह',
        subtitle: '16 दिसंबर · 11:30 बजे',
        dayLabel: 'द्वितीय दिवस',
        targetId: 'day-2',
        theme: 'navy',
        image: '/assets/highlight-pad-pratishtha.png',
        imageFocus: 'center',
        artworkType: 'pad-pratishtha',
      },
      {
        id: 'diksha',
        title: 'भव्य दीक्षा समारोह',
        subtitle: '16 दिसंबर · 1:30 बजे',
        dayLabel: 'द्वितीय दिवस',
        targetId: 'day-2',
        theme: 'emerald',
        image: '/assets/highlight-diksha.jpg',
        imageFocus: 'top',
        artworkType: 'diksha',
      },
      {
        id: 'drone-show',
        title: 'अद्भुत ड्रोन शो',
        subtitle: '16 दिसंबर · 7:00 से 8:00 बजे रात्रि',
        dayLabel: 'द्वितीय दिवस',
        targetId: 'day-2',
        theme: 'navy',
        image: '/assets/highlight-drone-show.png',
        imageFocus: 'center',
        artworkType: 'drone-show',
      },
      {
        id: 'bhakti-night',
        title: 'भव्य भक्ति नाइट',
        subtitle: '16 दिसंबर · रात्रि',
        dayLabel: 'द्वितीय दिवस',
        targetId: 'day-2',
        theme: 'burgundy',
        image: '/assets/highlight-bhakti-night.jpg',
        imageFocus: 'center',
        artworkType: 'bhakti-night',
      },
      {
        id: 'pad-prakshalana',
        title: '1008 आचार्य पाद प्रक्षालन',
        subtitle: '17 दिसंबर · प्रातःकाल',
        dayLabel: 'तृतीय दिवस',
        targetId: 'day-3',
        theme: 'emerald',
        image: '/assets/highlight-pad-prakshalana.jpg',
        imageFocus: 'top',
        artworkType: 'pad-prakshalana',
      },
      {
        id: 'mahapuja',
        title: 'आचार्य महापूजा',
        subtitle: '17 दिसंबर · प्रातःकाल',
        dayLabel: 'तृतीय दिवस',
        targetId: 'day-3',
        theme: 'burgundy',
        image: '/assets/highlight-mahapuja.jpg',
        imageFocus: 'top',
        artworkType: 'mahapuja',
      },
    ] as HighlightCardData[],
  },

  temple: {
    eyebrow: 'THE SACRED VENUE',
    heading: 'पावन सुमतिधाम',
    title: 'सुमतिधाम, इंदौर',
    caption: 'धर्म, श्रद्धा एवं मंगलमय आयोजनों का पावन स्थल।',
  },

  location: {
    eyebrow: 'VISIT THE VENUE',
    heading: 'आपका हार्दिक स्वागत है',
    venue: 'सुमतिधाम',
    city: 'इंदौर',
    buttonText: 'आयोजन स्थल तक पहुँचें',
  },

  finalInvitation: {
    greeting: '॥ जय जिनेन्द्र ॥',
    title: 'श्रमणोन्नायक महोत्सव',
    dates: '15, 16 एवं 17 दिसंबर 2026',
    venue: 'सुमतिधाम, इंदौर',
    line1: 'आप सपरिवार सादर आमंत्रित हैं।',
    line2: 'आपकी मंगलमय उपस्थिति प्रार्थनीय है।',
    signOffPrefix: 'सादर',
    organizer: 'सुमतिधाम परिवार, इंदौर',
  },

  registration: {
    url: 'https://sumatidham.com/registration/',
    ctaLabel: 'पंजीकरण करें',
    modalTitle: 'महोत्सव ऑनलाइन पंजीकरण',
    modalSubtitle: 'श्रमणोन्नायक महोत्सव · 15, 16 एवं 17 दिसंबर 2026',
    modalDescription:
      'आवास, भोजन एवं महोत्सव व्यवस्थाओं के सुगम संचालन हेतु कृपया सुमतिधाम के आधिकारिक पोर्टल पर अपना पंजीकरण सुनिश्चित करें।',
    modalButtonText: 'आधिकारिक पंजीकरण खोलें',
  },

  socialMedia: [
    {
      id: 'instagram',
      label: 'Instagram',
      handle: '@sumatidham',
      url: 'https://www.instagram.com/sumatidham/',
    },
    {
      id: 'facebook',
      label: 'Facebook',
      handle: 'SumatiDham',
      url: 'https://www.facebook.com/sumatidham',
    },
    {
      id: 'youtube',
      label: 'YouTube',
      handle: '@SumatiDham',
      url: 'https://youtube.com/@SumatiDham?si=Vr6FqMYtNxbErmIP',
    },
  ] as const,

  contacts: [
    {
      display: '8719995010',
      telHref: 'tel:+918719995010',
      whatsappHref:
        'https://wa.me/918719995010?text=%E0%A5%A5%20%E0%A4%9C%E0%A4%AF%20%E0%A4%9C%E0%A4%BF%E0%A4%A8%E0%A5%87%E0%A4%A8%E0%A5%8D%E0%A4%A6%E0%A5%8D%E0%A4%B0%20%E0%A5%A5%20%E0%A4%B6%E0%A5%8D%E0%A4%B0%E0%A4%AE%E0%A4%A3%E0%A5%8B%E0%A4%A8%E0%A5%8D%E0%A4%A8%E0%A4%BE%E0%A4%AF%E0%A4%95%20%E0%A4%AE%E0%A4%B9%E0%A5%8B%E0%A4%A4%E0%A5%8D%E0%A4%B8%E0%A4%B5%202026%20%E0%A4%95%E0%A5%87%20%E0%A4%AC%E0%A4%BE%E0%A4%B0%E0%A5%87%20%E0%A4%AE%E0%A5%87%E0%A4%82%20%E0%A4%9C%E0%A4%BE%E0%A4%A8%E0%A4%95%E0%A4%BE%E0%A4%B0%E0%A5%80%20%E0%A4%9A%E0%A4%BE%E0%A4%B9%E0%A4%BF%E0%A4%8F%E0%A5%A4',
    },
    {
      display: '8719995011',
      telHref: 'tel:+918719995011',
      whatsappHref:
        'https://wa.me/918719995011?text=%E0%A5%A5%20%E0%A4%9C%E0%A4%AF%20%E0%A4%9C%E0%A4%BF%E0%A4%A8%E0%A5%87%E0%A4%A8%E0%A5%8D%E0%A4%A6%E0%A5%8D%E0%A4%B0%20%E0%A5%A5%20%E0%A4%B6%E0%A5%8D%E0%A4%B0%E0%A4%AE%E0%A4%A3%E0%A5%8B%E0%A4%A8%E0%A5%8D%E0%A4%A8%E0%A4%BE%E0%A4%AF%E0%A4%95%20%E0%A4%AE%E0%A4%B9%E0%A5%8B%E0%A4%A4%E0%A5%8D%E0%A4%B8%E0%A4%B5%202026%20%E0%A4%95%E0%A5%87%20%E0%A4%AC%E0%A4%BE%E0%A4%B0%E0%A5%87%20%E0%A4%AE%E0%A5%87%E0%A4%82%20%E0%A4%9C%E0%A4%BE%E0%A4%A8%E0%A4%95%E0%A4%BE%E0%A4%B0%E0%A5%80%20%E0%A4%9A%E0%A4%BE%E0%A4%B9%E0%A4%BF%E0%A4%8F%E0%A5%A4',
    },
  ] as const,
} as const;

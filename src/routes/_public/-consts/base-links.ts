import { LinkOptions } from '@tanstack/react-router';
import { type Locale } from '@/paraglide/runtime';


export interface ILinkItem {
  label: string;
  description?: string;
  linkOpt: LinkOptions;
  protected?: boolean;
}

export enum MenuItemType {
  Single = 'single',
  Group = 'group',
}

export type TSingleLinkItem = {
  type: MenuItemType.Single;
  item: ILinkItem;
  protected?: boolean;
  forRoles?: string[];
};

export type TLinkGroupItem = {
  type: MenuItemType.Group;
  title: string;
  items: ILinkItem[];
  protected?: boolean;
  forRoles?: string[];
};

export type TLinkItem = TSingleLinkItem | TLinkGroupItem;


const translations: Record<Locale, Record<string, string>> = {
  ro: {
    'products.title': 'Produse',
    'products.indoor': 'Afișaj LED Interior',
    'products.indoor_desc': 'Ecrane LED de înaltă calitate pentru utilizare în interior.',
    'products.outdoor': 'Afișaj LED Exterior',
    'products.outdoor_desc': 'Afișaje durabile și luminoase pentru medii exterioare.',
    'products.rental': 'Afișaj LED Pentru Închiriere',
    'products.rental_desc': 'Soluții LED portabile pentru evenimente și spectacole.',
    'products.transparent': 'Ecran LED Transparent',
    'products.transparent_desc': 'Afișaje LED transparente pentru configurații creative.',
    'products.soft': 'Ecran LED Flexibil',
    'products.soft_desc': 'Panouri LED flexibile pentru instalații unice.',
    'products.floor_tile': 'Ecran Pardoseală Interactiv',
    'products.floor_tile_desc': 'Plăci LED interactive pentru evenimente și spații.',
    'news.title': 'Știri',
    'news.all': 'Toate știrile',
    'news.all_desc': 'Descoperă cele mai noi știri',
    'news.company': 'Știri Companie',
    'news.company_desc': 'Actualizări și anunțuri din compania noastră.',
    'news.knowledge': 'Cunoștințe LED',
    'news.knowledge_desc': 'Învață sfaturi, perspective și bazele tehnologiei afișajelor LED.',
    'contacts': 'Contacte',
    'notifications': 'Notificări',
    'admin': 'Admin',
  },
  ru: {
    'products.title': 'Продукты',
    'products.indoor': 'Внутренний светодиодный дисплей',
    'products.indoor_desc': 'Высококачественные светодиодные экраны для внутреннего использования.',
    'products.outdoor': 'Наружный светодиодный дисплей',
    'products.outdoor_desc': 'Прочные и яркие дисплеи для наружного применения.',
    'products.rental': 'Арендный светодиодный дисплей',
    'products.rental_desc': 'Портативные светодиодные решения для событий и шоу.',
    'products.transparent': 'Прозрачный светодиодный экран',
    'products.transparent_desc': 'Прозрачные светодиодные дисплеи для творческих установок.',
    'products.soft': 'Мягкий светодиодный экран',
    'products.soft_desc': 'Гибкие светодиодные панели для уникальных инсталляций.',
    'products.floor_tile': 'Интерактивный светодиодный пол',
    'products.floor_tile_desc': 'Интерактивные светодиодные плитки для событий и пространств.',
    'news.title': 'Новости',
    'news.all': 'Все новости',
    'news.all_desc': 'Откройте последние новости',
    'news.company': 'Новости компании',
    'news.company_desc': 'Обновления и объявления от нашей компании.',
    'news.knowledge': 'Знания о светодиодах',
    'news.knowledge_desc': 'Узнайте советы, идеи и основы технологии светодиодных дисплеев.',
    'contacts': 'Контакты',
    'notifications': 'Уведомления',
    'admin': 'Админ',
  },
};

export function getBaseLinks(locale: Locale): TLinkItem[] {
  const dict = translations[locale];

  return [
    {
      type: MenuItemType.Group,
      title: dict['products.title'],
      items: [
        {
          label: dict['products.indoor'],
          description: dict['products.indoor_desc'],
          linkOpt: { to: '/' },
        },
        {
          label: dict['products.outdoor'],
          description: dict['products.outdoor_desc'],
          linkOpt: { to: '/' },
        },
        {
          label: dict['products.rental'],
          description: dict['products.rental_desc'],
          linkOpt: { to: '/' },
        },
        {
          label: dict['products.transparent'],
          description: dict['products.transparent_desc'],
          linkOpt: { to: '/' },
        },
        {
          label: dict['products.soft'],
          description: dict['products.soft_desc'],
          linkOpt: { to: '/' },
        },
        {
          label: dict['products.floor_tile'],
          description: dict['products.floor_tile_desc'],
          linkOpt: { to: '/' },
        },
      ],
    },
    {
      type: MenuItemType.Group,
      title: dict['news.title'],
      items: [
        {
          label: dict['news.all'],
          description: dict['news.all_desc'],
          linkOpt: { to: '/' },
        },
        {
          label: dict['news.company'],
          description: dict['news.company_desc'],
          linkOpt: { to: '/' },
        },
        {
          label: dict['news.knowledge'],
          description: dict['news.knowledge_desc'],
          linkOpt: { to: '/' },
        },
      ],
    },
    {
      type: MenuItemType.Single,
      item: { label: dict['contacts'], linkOpt: { to: '/contacts' } },
    },
    {
      type: MenuItemType.Single,
      item: { label: dict['notifications'], linkOpt: { to: '/notifications' } },
      protected: true,
    },
    {
      type: MenuItemType.Single,
      item: { label: dict['admin'], linkOpt: { to: '/admin' } },
      forRoles: ['admin'],
      protected: true,
    },
  ];
}
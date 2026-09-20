'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type Lang = 'en' | 'pt';

/**
 * Static marketing copy in both languages. Product and quote data stay in
 * English/whatever the admin typed — translating live database content is a
 * separate project (a `nameEn`/`namePt` field pair on the model, or a
 * translation API call). This covers everything a visitor reads on the
 * storefront shell: nav, hero, about page, footer.
 */
const dict = {
  en: {
    nav_home: 'Home',
    nav_products: 'Products',
    nav_about: 'About Us',
    nav_contact: 'Contact',
    nav_staff: 'Staff sign in',
    hero_title: 'Your reliable supply partner in Mozambique.',
    hero_sub:
      'EMCO LDA supplies construction materials, electrical equipment, agricultural tools and selected commercial products across Mozambique.',
    hero_tagline: 'Quality Products · Competitive Prices · Reliable Service · Customer Focus',
    hero_search: "Search the catalogue — try 'angle grinder'",
    hero_search_btn: 'Search',
    hero_cta_quote: 'Request a Quote',
    hero_cta_explore: 'Explore Products',
    stat_1_v: 'Same day', stat_1_l: 'Quote turnaround',
    stat_2_v: '400+', stat_2_l: 'Items in stock',
    stat_3_v: 'Countrywide', stat_3_l: 'Delivery on request',
    dept_title: 'Shop by department',
    dept_more: 'See the full catalogue',
    dept_items: 'items',
    featured_title: 'Moving fast this month',
    trust_1_t: 'One invoice, one delivery',
    trust_1_b: 'Mixed orders across departments arrive together, so your site crew is not waiting on three suppliers.',
    trust_2_t: 'Prices you can plan around',
    trust_2_b: 'Written quotes hold for 14 days. No moving the number after you have committed to your own client.',
    trust_3_t: 'Credit for regular buyers',
    trust_3_b: '30-day accounts for contractors after three completed orders. Ask the sales desk to open yours.',
    quote_title: 'Send us your list',
    quote_sub: 'Paste your bill of quantities or just describe the job. We price it, confirm stock and arrange delivery.',
    footer_desc: 'Suppliers of building materials, power tools and industrial hardware to contractors and retailers across Mozambique.',
    footer_shop: 'Shop', footer_company: 'Company', footer_reach: 'Reach us',
    footer_all: 'All products', footer_power: 'Power tools', footer_materials: 'Building materials', footer_plumbing: 'Plumbing',
    hours_weekday: 'Monday to Friday, 08:00–17:00',
    hours_saturday: 'Saturday, 08:00–13:00',
    about_hero: 'A partner for Mozambique’s progress.',
    about_us_title: 'About Us', about_us_body: 'EMCO LDA is a supplier of construction materials, electrical equipment, agricultural tools and selected commercial products in Mozambique. The company aims to provide competitive prices and dependable service to individuals, contractors, businesses and institutions.',
    purpose_title: 'Purpose', purpose_body: 'To make essential construction, electrical and agricultural products more accessible by providing customers with reliable products, fair pricing and professional service.',
    mission_title: 'Mission', mission_body: 'To supply quality products and deliver professional, dependable customer service that supports construction, electrical, agricultural and commercial activity across the country.',
    vision_title: 'Vision', vision_body: 'To become Mozambique’s most trusted one-stop supplier — the first call a contractor makes before a project starts, not the last.',
    goals_title: 'Goals',
    goals: [
      'Expand the range of quality products available to customers.',
      'Build long-term relationships with customers and business partners.',
      'Maintain competitive and transparent pricing.',
      'Improve customer service and delivery efficiency.',
      'Support construction, electrical and agricultural development through reliable supply.',
      'Build EMCO LDA into a strong and trusted business.',
    ],
    values_title: 'Core Values',
    values: ['Quality', 'Integrity', 'Reliability', 'Customer satisfaction', 'Professionalism', 'Transparency', 'Commitment', 'Continuous improvement'],
    products_title: 'Main Products',
    products_list: ['Construction materials and equipment', 'Electrical materials and equipment', 'Agricultural tools and hardware', 'Selected commercial equipment'],
    partner_title: 'A Partner for Progress',
    partner_body_1: 'EMCO LDA is a Mozambican supplier focused on meeting construction, electrical, agricultural and commercial needs. Since our founding we have been a pillar of trust for development across the regions we serve.',
    partner_body_2: 'Our purpose is to make essential products more accessible through reliable goods, fair pricing and professional service — supporting the infrastructure that Mozambique is building today.',
    banner_tagline: 'Industrial supply for the future of Mozambique.',
    contact_title: 'Talk to the sales desk',
    contact_sub: 'Send your list and we will price it, confirm what is in stock and quote delivery.',
    contact_phone: 'Phone', contact_email: 'Email', contact_counter: 'Visit us',
  },
  pt: {
    nav_home: 'Início',
    nav_products: 'Produtos',
    nav_about: 'Sobre Nós',
    nav_contact: 'Contacto',
    nav_staff: 'Acesso da equipa',
    hero_title: 'O seu parceiro de fornecimento de confiança em Moçambique.',
    hero_sub:
      'A EMCO LDA fornece materiais de construção, equipamento eléctrico, ferramentas agrícolas e produtos comerciais selecionados em todo o país.',
    hero_tagline: 'Produtos de Qualidade · Preços Competitivos · Serviço de Confiança · Foco no Cliente',
    hero_search: "Pesquisar no catálogo — experimente 'rebarbadora'",
    hero_search_btn: 'Pesquisar',
    hero_cta_quote: 'Pedir Cotação',
    hero_cta_explore: 'Ver Produtos',
    stat_1_v: 'No mesmo dia', stat_1_l: 'Resposta à cotação',
    stat_2_v: '400+', stat_2_l: 'Artigos em stock',
    stat_3_v: 'Todo o país', stat_3_l: 'Entrega mediante pedido',
    dept_title: 'Comprar por departamento',
    dept_more: 'Ver o catálogo completo',
    dept_items: 'artigos',
    featured_title: 'Mais procurados este mês',
    trust_1_t: 'Uma factura, uma entrega',
    trust_1_b: 'Encomendas mistas de vários departamentos chegam juntas, para a sua equipa não esperar por três fornecedores.',
    trust_2_t: 'Preços em que pode confiar',
    trust_2_b: 'As cotações escritas são válidas por 14 dias. O valor não muda depois de já se ter comprometido com o seu cliente.',
    trust_3_t: 'Crédito para clientes regulares',
    trust_3_b: 'Contas a 30 dias para empreiteiros após três encomendas concluídas. Peça à equipa comercial para abrir a sua.',
    quote_title: 'Envie-nos a sua lista',
    quote_sub: 'Cole o seu mapa de quantidades ou descreva o trabalho. Nós orçamos, confirmamos o stock e organizamos a entrega.',
    footer_desc: 'Fornecedores de materiais de construção, ferramentas eléctricas e ferragens industriais a empreiteiros e retalhistas em Moçambique.',
    footer_shop: 'Loja', footer_company: 'Empresa', footer_reach: 'Contacte-nos',
    footer_all: 'Todos os produtos', footer_power: 'Ferramentas eléctricas', footer_materials: 'Materiais de construção', footer_plumbing: 'Canalização',
    hours_weekday: 'Segunda a sexta-feira, 08:00–17:00',
    hours_saturday: 'Sábado, 08:00–13:00',
    about_hero: 'Um parceiro para o progresso de Moçambique.',
    about_us_title: 'Sobre Nós', about_us_body: 'A EMCO LDA é um fornecedor de materiais de construção, equipamento eléctrico, ferramentas agrícolas e produtos comerciais selecionados em Moçambique. A empresa procura oferecer preços competitivos e um serviço de confiança a particulares, empreiteiros, empresas e instituições.',
    purpose_title: 'Propósito', purpose_body: 'Tornar os produtos essenciais de construção, electricidade e agricultura mais acessíveis, oferecendo produtos fiáveis, preços justos e um serviço profissional.',
    mission_title: 'Missão', mission_body: 'Fornecer produtos de qualidade e prestar um serviço ao cliente profissional e de confiança que apoie a construção, a electricidade, a agricultura e o comércio em todo o país.',
    vision_title: 'Visão', vision_body: 'Tornar-se o fornecedor mais confiável de Moçambique — a primeira chamada de um empreiteiro antes de um projecto começar, não a última.',
    goals_title: 'Objectivos',
    goals: [
      'Alargar a gama de produtos de qualidade disponíveis aos clientes.',
      'Construir relações duradouras com clientes e parceiros de negócio.',
      'Manter preços competitivos e transparentes.',
      'Melhorar o serviço ao cliente e a eficiência das entregas.',
      'Apoiar o desenvolvimento da construção, electricidade e agricultura através de um fornecimento fiável.',
      'Transformar a EMCO LDA numa empresa forte e de confiança.',
    ],
    values_title: 'Valores Fundamentais',
    values: ['Qualidade', 'Integridade', 'Fiabilidade', 'Satisfação do cliente', 'Profissionalismo', 'Transparência', 'Compromisso', 'Melhoria contínua'],
    products_title: 'Principais Produtos',
    products_list: ['Materiais e equipamento de construção', 'Materiais e equipamento eléctrico', 'Ferramentas e ferragens agrícolas', 'Equipamento comercial selecionado'],
    partner_title: 'Um Parceiro para o Progresso',
    partner_body_1: 'A EMCO LDA é um fornecedor moçambicano focado em responder às necessidades de construção, electricidade, agricultura e comércio. Desde a nossa fundação, temos sido um pilar de confiança para o desenvolvimento nas regiões onde operamos.',
    partner_body_2: 'O nosso propósito é tornar os produtos essenciais mais acessíveis através de bens fiáveis, preços justos e um atendimento profissional — apoiando a infra-estrutura que Moçambique está a construir hoje.',
    banner_tagline: 'Aprovisionamento industrial para o futuro de Moçambique.',
    contact_title: 'Fale com a equipa comercial',
    contact_sub: 'Envie a sua lista e nós orçamos, confirmamos o que está em stock e cotamos a entrega.',
    contact_phone: 'Telefone', contact_email: 'Email', contact_counter: 'Visite-nos',
  },
} as const;

export type DictKey = keyof typeof dict['en'];

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (key: DictKey) => any };
const LanguageContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');

  useEffect(() => {
    const saved = window.localStorage.getItem('emco_lang');
    if (saved === 'en' || saved === 'pt') setLangState(saved);
  }, []);

  function setLang(l: Lang) {
    setLangState(l);
    window.localStorage.setItem('emco_lang', l);
  }

  const value = useMemo<Ctx>(
    () => ({ lang, setLang, t: (key) => dict[lang][key] ?? dict.en[key] }),
    [lang]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside <LanguageProvider>');
  return ctx;
}

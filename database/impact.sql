--
-- PostgreSQL database dump
--

\restrict dgWbH0Df8MaGQbOgj6LK0DXNXg7t7ZGjYnKfj0XeEYx5380dfcsiVBnFR6C14iL

-- Dumped from database version 17.6 (Ubuntu 17.6-0ubuntu0.25.04.1)
-- Dumped by pg_dump version 17.6 (Ubuntu 17.6-0ubuntu0.25.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pg_trgm; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;


--
-- Name: EXTENSION pg_trgm; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_trgm IS 'text similarity measurement and index searching based on trigrams';


--
-- Name: set_updated_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.set_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END; $$;


ALTER FUNCTION public.set_updated_at() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.events (
    id integer NOT NULL,
    event_type text NOT NULL,
    payload jsonb NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.events OWNER TO postgres;

--
-- Name: events_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.events_id_seq OWNER TO postgres;

--
-- Name: events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.events_id_seq OWNED BY public.events.id;


--
-- Name: ngo_tags; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ngo_tags (
    ngo_id integer NOT NULL,
    tag_id integer NOT NULL
);


ALTER TABLE public.ngo_tags OWNER TO postgres;

--
-- Name: ngos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ngos (
    id integer NOT NULL,
    name text NOT NULL,
    short_desc text,
    full_desc text,
    website text,
    phone text,
    email text,
    city text,
    district text,
    latitude text,
    longitude text,
    verified boolean,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    logo_url text
);


ALTER TABLE public.ngos OWNER TO postgres;

--
-- Name: ngos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ngos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ngos_id_seq OWNER TO postgres;

--
-- Name: ngos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ngos_id_seq OWNED BY public.ngos.id;


--
-- Name: opportunities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.opportunities (
    id integer NOT NULL,
    ngo_id integer,
    title text NOT NULL,
    description text,
    commitment text,
    city text,
    district text,
    starts_on date,
    ends_on date,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.opportunities OWNER TO postgres;

--
-- Name: opportunities_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.opportunities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.opportunities_id_seq OWNER TO postgres;

--
-- Name: opportunities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.opportunities_id_seq OWNED BY public.opportunities.id;


--
-- Name: tags; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tags (
    id integer NOT NULL,
    key text NOT NULL,
    name text NOT NULL
);


ALTER TABLE public.tags OWNER TO postgres;

--
-- Name: tags_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tags_id_seq OWNER TO postgres;

--
-- Name: tags_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tags_id_seq OWNED BY public.tags.id;


--
-- Name: upcoming_events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.upcoming_events (
    id integer NOT NULL,
    ngo_id integer,
    event_name text NOT NULL,
    event_date date NOT NULL,
    event_time time without time zone NOT NULL,
    location text NOT NULL,
    organizer text,
    description text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.upcoming_events OWNER TO postgres;

--
-- Name: upcoming_events_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.upcoming_events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.upcoming_events_id_seq OWNER TO postgres;

--
-- Name: upcoming_events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.upcoming_events_id_seq OWNED BY public.upcoming_events.id;


--
-- Name: wishlist_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.wishlist_items (
    id integer NOT NULL,
    ngo_id integer NOT NULL,
    title text NOT NULL,
    description text,
    quantity integer,
    unit text,
    priority text,
    needed_by date,
    status text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.wishlist_items OWNER TO postgres;

--
-- Name: wishlist_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.wishlist_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.wishlist_items_id_seq OWNER TO postgres;

--
-- Name: wishlist_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.wishlist_items_id_seq OWNED BY public.wishlist_items.id;


--
-- Name: wishlist_offers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.wishlist_offers (
    id integer NOT NULL,
    wishlist_id integer NOT NULL,
    donor_name text NOT NULL,
    donor_email text,
    quantity integer,
    message text,
    status text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.wishlist_offers OWNER TO postgres;

--
-- Name: wishlist_offers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.wishlist_offers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.wishlist_offers_id_seq OWNER TO postgres;

--
-- Name: wishlist_offers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.wishlist_offers_id_seq OWNED BY public.wishlist_offers.id;


--
-- Name: events id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events ALTER COLUMN id SET DEFAULT nextval('public.events_id_seq'::regclass);


--
-- Name: ngos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ngos ALTER COLUMN id SET DEFAULT nextval('public.ngos_id_seq'::regclass);


--
-- Name: opportunities id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.opportunities ALTER COLUMN id SET DEFAULT nextval('public.opportunities_id_seq'::regclass);


--
-- Name: tags id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tags ALTER COLUMN id SET DEFAULT nextval('public.tags_id_seq'::regclass);


--
-- Name: upcoming_events id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.upcoming_events ALTER COLUMN id SET DEFAULT nextval('public.upcoming_events_id_seq'::regclass);


--
-- Name: wishlist_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wishlist_items ALTER COLUMN id SET DEFAULT nextval('public.wishlist_items_id_seq'::regclass);


--
-- Name: wishlist_offers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wishlist_offers ALTER COLUMN id SET DEFAULT nextval('public.wishlist_offers_id_seq'::regclass);


--
-- Data for Name: events; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.events (id, event_type, payload, created_at) FROM stdin;
\.


--
-- Data for Name: ngo_tags; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ngo_tags (ngo_id, tag_id) FROM stdin;
1	4
1	5
2	1
2	5
3	2
3	5
4	6
4	3
5	4
5	5
6	6
6	5
7	20
7	21
8	5
8	2
9	5
9	2
10	5
10	21
11	5
11	2
12	22
12	23
13	5
13	2
14	6
14	24
15	6
15	22
16	6
16	25
17	5
17	25
18	6
18	22
21	4
21	5
22	26
22	5
23	5
23	2
\.


--
-- Data for Name: ngos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ngos (id, name, short_desc, full_desc, website, phone, email, city, district, latitude, longitude, verified, created_at, updated_at, logo_url) FROM stdin;
2	Green Brunei	Environmental education and community cleanups.	\N	https://www.green-brunei.org	\N	\N	Bandar Seri Begawan	Brunei-Muara	\N	\N	t	2025-09-16 22:40:27.765684	2025-09-16 22:40:27.765684	\N
3	Society for Community Outreach and Training (SCOT)	Youth empowerment and social innovation.	\N	https://scotbrunei.org	\N	\N	Bandar Seri Begawan	Brunei-Muara	\N	\N	t	2025-09-16 22:40:27.765684	2025-09-16 22:40:27.765684	\N
4	SMARTER Brunei	Supporting individuals with autism and their families.	\N	https://smarterbrunei.org	\N	\N	Bandar Seri Begawan	Brunei-Muara	\N	\N	t	2025-09-16 22:40:27.765684	2025-09-16 22:40:27.765684	\N
5	Care and Action for Strays (CAS)	Animal rescue and adoption.	\N	https://www.facebook.com/casbrunei	\N	\N	Bandar Seri Begawan	Brunei-Muara	\N	\N	t	2025-09-16 22:40:27.765684	2025-09-16 22:40:27.765684	\N
6	Persatuan KACA (Pusat Bahagia)	Support services for disabled children.	\N	https://kaca.org.bn	\N	\N	Bandar Seri Begawan	Brunei-Muara	\N	\N	t	2025-09-16 22:40:27.765684	2025-09-16 22:40:27.765684	\N
1	Brunei Animal Care	Animal rescue and welfare.	A community-driven NGO advocating for animal rescue, adoption and welfare.	https://example.org	\N	\N	Bandar Seri Begawan	Brunei-Muara	\N	\N	t	2025-09-16 12:39:38.715024	2025-09-17 22:19:58.796275	\N
7	Hand4HandBN	community-driven NGO in Brunei that focuses on helping underprivileged families and frontliners through donation drives, charity events, and relief efforts, especially during festive seasons.	\N	https://www.instagram.com/hand4handbn?igsh=YjB1dndweXlrNTR0	\N	\N	Bandar Seri Begawan	Brunei-Muara	\N	\N	t	2025-09-18 02:41:44.693494	2025-09-18 02:41:44.693494	\N
8	La Vida	brunei-based non-profit that empowers families and individuals, especially those with special needs. Located in Kg Sungai Hanching, it provides education, start-up training, and community programs while fostering advocacy, inclusion, and volunteerism.	\N	https://www.instagram.com/lavidabrunei?igsh=MThqcDN2NG55aXFyZQ==	\N	\N	Bandar Seri Begawan	Brunei-Muara	\N	\N	t	2025-09-18 02:41:44.771627	2025-09-18 02:41:44.771627	\N
9	Majlis Belia Brunei	Brunei’s national youth council, established in 1959 to represent and empower young people. It focuses on leadership, welfare, and youth development through programmes, events, and policy engagement, serving as the main platform for youth voices in the country.	\N	http://www.bruneiyouthcouncil.com	\N	\N	Bandar Seri Begawan	Brunei-Muara	\N	\N	t	2025-09-18 02:41:44.841486	2025-09-18 02:41:44.841486	\N
10	Majlis Kesejahteraan Masyarakat	Brunei NGO that helps underprivileged families, children, elderly, and persons with disabilities through food aid, education support, and welfare programs.	\N	https://mkmbrunei.org/	\N	\N	Bandar Seri Begawan	Brunei-Muara	\N	\N	t	2025-09-18 02:41:44.909468	2025-09-18 02:41:44.909468	\N
11	Persatuan KESAN	a registered youth NGO in Brunei dedicated to leadership development, character building, and volunteerism.	\N	https://persatuankesanblog.wordpress.com/	\N	\N	Bandar Seri Begawan	Brunei-Muara	\N	\N	t	2025-09-18 02:41:44.976492	2025-09-18 02:41:44.976492	\N
12	Special Olympics Brunei	Sports & inclusion for intellectual disability	\N	https://www.specialolympics.org/programs/asia-pacific/brunei-darussalam	\N	\N	Bandar Seri Begawan	Brunei-Muara	\N	\N	t	2025-09-18 02:41:45.043318	2025-09-18 02:41:45.043318	\N
13	Projek Bina Ukhwah	a youth-led initiative in Brunei founded in 2017 that supports underprivileged families through community service, livelihood training, home improvement, and disaster relief.	\N	https://projekbinaukhwah.mystrikingly.com/	\N	\N	Bandar Seri Begawan	Brunei-Muara	\N	\N	t	2025-09-18 02:41:45.112462	2025-09-18 02:41:45.112462	\N
14	YASKA (Children's Cancer Foundation)	Support children diagnosed with cancer and families	\N	https://www.facebook.com/YASKABrunei2012	\N	\N	Bandar Seri Begawan	Brunei-Muara	\N	\N	t	2025-09-18 02:41:45.180094	2025-09-18 02:41:45.180094	\N
15	ABLE (Down Syndrome Association)	Support for individuals with Down Syndrome	\N	https://www.instagram.com/ablebrunei/	\N	\N	Bandar Seri Begawan	Brunei-Muara	\N	\N	t	2025-09-18 02:41:45.247752	2025-09-18 02:41:45.247752	\N
16	Brunei Darussalam AIDS Council (BDAC)	At Brunei Darussalam AIDS Council (BDAIDSCOUNCIL) we aim to educate the public about HIV & AIDS related issues in order to be well informed and live a healthier lifestyle.	\N	http://www.bdaidscouncil.org/	\N	\N	Bandar Seri Begawan	Brunei-Muara	\N	\N	t	2025-09-18 02:41:45.315851	2025-09-18 02:41:45.315851	\N
17	WeCareBN	Brunei-based NGO founded in 2016 that provides humanitarian and poverty relief.	\N	https://www.wecare.org.bn/	\N	\N	Bandar Seri Begawan	Brunei-Muara	\N	\N	t	2025-09-18 02:41:45.384624	2025-09-18 02:41:45.384624	\N
18	Brunei Darussalam National Association of the Blind	a non-profit established in 2001 to empower blind and visually impaired people in Brunei.	\N	https://bdnab.org/	\N	\N	Bandar Seri Begawan	Brunei-Muara	\N	\N	t	2025-09-18 02:41:45.453204	2025-09-18 02:41:45.453204	\N
19	Learning Ladders	a Brunei non-profit dedicated to supporting children with autism and developmental delays.	\N	http://learningladderssociety.weebly.com	\N	\N	Bandar Seri Begawan	Brunei-Muara	\N	\N	t	2025-09-18 02:41:45.522043	2025-09-18 02:41:45.522043	\N
20	Pusat Ehsan	a non-profit charitable organization in Brunei that provides education, training, and rehabilitation for people with special needs, aiming to empower them for independent and inclusive living.	\N	http://www.pusatehsan.org.bn/index.html	\N	\N	Bandar Seri Begawan	Brunei-Muara	\N	\N	t	2025-09-18 02:41:45.588282	2025-09-18 02:41:45.588282	\N
21	BruWILD	a registered NGO founded in 2013 that focuses on biodiversity conservation, wildlife rescue, and environmental education in Brunei Darussalam.	\N	https://www.bruwild.org/	\N	\N	Bandar Seri Begawan	Brunei-Muara	\N	\N	t	2025-09-18 02:41:45.654123	2025-09-18 02:41:45.654123	\N
22	HEART Volunteers Group	a volunteer-driven NGO in Brunei focused on providing emergency relief during crises and disasters	\N	https://heartbrunei.gbs2u.com/bd/index3.asp?userid=GBS2U&idno=836	\N	\N	Bandar Seri Begawan	Brunei-Muara	\N	\N	t	2025-09-18 02:41:45.723126	2025-09-18 02:41:45.723126	\N
23	Young Southeast Asian Leaders Initiative (YSEALI)	a U.S.-backed initiative that develops leadership skills among Southeast Asian youth, including Bruneians, through fellowships, workshops, and grants in areas like civic engagement, environment, education, and economic empowerment.	\N	https://asean.usmission.gov/yseali/	\N	\N	Bandar Seri Begawan	Brunei-Muara	\N	\N	t	2025-09-18 02:41:45.791737	2025-09-18 02:41:45.791737	\N
\.


--
-- Data for Name: opportunities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.opportunities (id, ngo_id, title, description, commitment, city, district, starts_on, ends_on, created_at) FROM stdin;
1	1	Weekend Shelter Volunteer	Help clean cages and feed animals.	weekly	Bandar Seri Begawan	Brunei-Muara	\N	\N	2025-09-16 12:39:38.715024
2	1	Weekend Animal Shelter Support	Help with feeding, cleaning and playtime for rescue animals.	Weekly 3–4 hours	Bandar Seri Begawan	Brunei-Muara	2025-09-24	2025-12-16	2025-09-17 22:19:58.796275
\.


--
-- Data for Name: tags; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tags (id, key, name) FROM stdin;
6	health	Health
1	environment	Environment
2	youth	Youth
3	education	Education
4	animal-welfare	Animal Welfare
5	community	Community
20	charity	Charity
21	welfare	Welfare
22	disability	Disability
23	sports	Sports
24	childcare	Childcare
25	awareness	Awareness
26	humanitarian	Humanitarian
\.


--
-- Data for Name: upcoming_events; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.upcoming_events (id, ngo_id, event_name, event_date, event_time, location, organizer, description, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: wishlist_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.wishlist_items (id, ngo_id, title, description, quantity, unit, priority, needed_by, status, created_at, updated_at) FROM stdin;
1	1	Dog & Cat Food (10kg bags)	Dry food preferred; sealed & within expiry.	10	bag	high	2025-10-17	open	2025-09-17 22:19:58.796275	2025-09-17 22:19:58.796275
2	1	Cleaning Supplies	Bleach, gloves, mops, detergent.	20	unit	normal	\N	open	2025-09-17 22:19:58.796275	2025-09-17 22:19:58.796275
\.


--
-- Data for Name: wishlist_offers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.wishlist_offers (id, wishlist_id, donor_name, donor_email, quantity, message, status, created_at, updated_at) FROM stdin;
1	1	Sample Donor	donor@example.com	2	Happy to contribute two bags.	pending	2025-09-17 22:19:58.796275	2025-09-17 22:19:58.796275
\.


--
-- Name: events_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.events_id_seq', 1, false);


--
-- Name: ngos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ngos_id_seq', 23, true);


--
-- Name: opportunities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.opportunities_id_seq', 2, true);


--
-- Name: tags_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tags_id_seq', 26, true);


--
-- Name: upcoming_events_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.upcoming_events_id_seq', 1, false);


--
-- Name: wishlist_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.wishlist_items_id_seq', 2, true);


--
-- Name: wishlist_offers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.wishlist_offers_id_seq', 1, true);


--
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);


--
-- Name: ngo_tags ngo_tags_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ngo_tags
    ADD CONSTRAINT ngo_tags_pkey PRIMARY KEY (ngo_id, tag_id);


--
-- Name: ngos ngos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ngos
    ADD CONSTRAINT ngos_pkey PRIMARY KEY (id);


--
-- Name: opportunities opportunities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.opportunities
    ADD CONSTRAINT opportunities_pkey PRIMARY KEY (id);


--
-- Name: tags tags_key_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_key_key UNIQUE (key);


--
-- Name: tags tags_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);


--
-- Name: upcoming_events upcoming_events_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.upcoming_events
    ADD CONSTRAINT upcoming_events_pkey PRIMARY KEY (id);


--
-- Name: wishlist_items wishlist_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wishlist_items
    ADD CONSTRAINT wishlist_items_pkey PRIMARY KEY (id);


--
-- Name: wishlist_offers wishlist_offers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wishlist_offers
    ADD CONSTRAINT wishlist_offers_pkey PRIMARY KEY (id);


--
-- Name: events trg_events_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: ngo_tags ngo_tags_ngo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ngo_tags
    ADD CONSTRAINT ngo_tags_ngo_id_fkey FOREIGN KEY (ngo_id) REFERENCES public.ngos(id);


--
-- Name: ngo_tags ngo_tags_tag_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ngo_tags
    ADD CONSTRAINT ngo_tags_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.tags(id);


--
-- Name: opportunities opportunities_ngo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.opportunities
    ADD CONSTRAINT opportunities_ngo_id_fkey FOREIGN KEY (ngo_id) REFERENCES public.ngos(id);


--
-- Name: upcoming_events upcoming_events_ngo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.upcoming_events
    ADD CONSTRAINT upcoming_events_ngo_id_fkey FOREIGN KEY (ngo_id) REFERENCES public.ngos(id) ON DELETE SET NULL;


--
-- Name: wishlist_items wishlist_items_ngo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wishlist_items
    ADD CONSTRAINT wishlist_items_ngo_id_fkey FOREIGN KEY (ngo_id) REFERENCES public.ngos(id);


--
-- Name: wishlist_offers wishlist_offers_wishlist_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wishlist_offers
    ADD CONSTRAINT wishlist_offers_wishlist_id_fkey FOREIGN KEY (wishlist_id) REFERENCES public.wishlist_items(id);


--
-- PostgreSQL database dump complete
--

\unrestrict dgWbH0Df8MaGQbOgj6LK0DXNXg7t7ZGjYnKfj0XeEYx5380dfcsiVBnFR6C14iL


/**
 * PRINCEFILMS catalogue.
 *
 * Titles are feature films and series dubbed into Kinyarwanda by resident
 * interpreters. Every fact the UI renders (runtime, seasons, episode counts,
 * views, ratings) is derived from this file — nothing is invented at render time.
 */

export type TitleKind = "movie" | "series";
export type Tone = "violet" | "gold" | "mint" | "rose" | "sky";

export interface Category {
  id: string;
  name: string;
  slug: string;
  blurb: string;
}

export interface Interpreter {
  id: string;
  name: string;
  slug: string;
  role: string;
  bio: string;
  since: number;
  avatar: string;
}

export interface Episode {
  id: string;
  seriesId: string;
  season: number;
  number: number;
  title: string;
  duration: number;
  synopsis: string;
  videoUrl: string;
}

export interface Season {
  number: number;
  episodes: Episode[];
}

interface TitleBase {
  id: string;
  slug: string;
  title: string;
  year: number;
  releasedAt: string;
  synopsis: string;
  genre: string;
  categoryIds: string[];
  interpreterId: string;
  rating: number;
  votes: number;
  views: number;
  image: string;
  imageCredit: string;
  tone: Tone;
  quality: "HD" | "4K";
  subtitles: string[];
  tags: string[];
  featured: boolean;
  videoUrl: string;
  downloadUrl: string;
}

export interface Movie extends TitleBase {
  kind: "movie";
  runtime: number;
}

export interface SeriesTitle extends TitleBase {
  kind: "series";
  seasons: Season[];
}

export type Title = Movie | SeriesTitle;

/**
 * Public, CORS-enabled sample streams. These replace the previous
 * commondatastorage bucket URLs, which now respond with 403.
 */
const SAMPLE_VIDEOS = [
  "https://media.w3.org/2010/05/sintel/trailer.mp4",
  "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4",
  "https://test-videos.co.uk/vids/sintel/mp4/h264/720/Sintel_720_10s_1MB.mp4",
  "https://test-videos.co.uk/vids/jellyfish/mp4/h264/720/Jellyfish_720_10s_1MB.mp4",
  "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_1MB.mp4",
];

const still = (path: string, width = 1400) =>
  `https://images.unsplash.com/${path}?auto=format&fit=crop&w=${width}&q=80`;

export const CATEGORIES: Category[] = [
  { id: "action", name: "Action", slug: "action", blurb: "Chases, fights and heists." },
  { id: "drama", name: "Drama", slug: "drama", blurb: "Families, work and hard choices." },
  { id: "comedy", name: "Comedy", slug: "comedy", blurb: "Kigali humour, subtitled." },
  { id: "thriller", name: "Thriller", slug: "thriller", blurb: "Night streets and close calls." },
  { id: "adventure", name: "Adventure", slug: "adventure", blurb: "Roads out of the city." },
  { id: "crime", name: "Crime", slug: "crime", blurb: "Cases, crews and consequences." },
  { id: "music", name: "Music", slug: "music", blurb: "Stages, studios and sound." },
  { id: "romance", name: "Romance", slug: "romance", blurb: "Love in the hills and the city." },
];

export const INTERPRETERS: Interpreter[] = [
  {
    id: "rocky",
    name: "Rocky Kimomo",
    slug: "rocky-kimomo",
    avatar: "https://i.pravatar.cc/200?u=rocky-kimomo",
    role: "Action and crime",
    bio: "Voices lead roles in action and crime titles. Recorded from the Remera studio.",
    since: 2018,
  },
  {
    id: "junior",
    name: "Junior Giti",
    slug: "junior-giti",
    avatar: "https://i.pravatar.cc/200?u=junior-giti",
    role: "Thrillers",
    bio: "Voices thrillers and night-city stories. Works mainly on series continuations.",
    since: 2019,
  },
  {
    id: "sankara",
    name: "Sankara Da Premier",
    slug: "sankara-da-premier",
    avatar: "https://i.pravatar.cc/200?u=sankara-da-premier",
    role: "Drama and crime",
    bio: "Family sagas and crime dramas, usually in long-form series.",
    since: 2016,
  },
  {
    id: "gaheza",
    name: "Gaheza Simba",
    slug: "gaheza-simba",
    avatar: "https://i.pravatar.cc/200?u=gaheza-simba",
    role: "Adventure",
    bio: "Voices adventure and travel titles, including the Simba Chronicles run.",
    since: 2019,
  },
  {
    id: "yanga",
    name: "Yanga",
    slug: "yanga",
    avatar: "https://i.pravatar.cc/200?u=yanga",
    role: "Drama and comedy",
    bio: "Voices domestic drama and comedy. Also voices the Yanga's Table series.",
    since: 2020,
  },
  {
    id: "bthegreat",
    name: "B The Great",
    slug: "b-the-great",
    avatar: "https://i.pravatar.cc/200?u=b-the-great",
    role: "Action",
    bio: "Sports and action titles, including the Second Round fight series.",
    since: 2017,
  },
  {
    id: "masterp",
    name: "Master P",
    slug: "master-p",
    avatar: "https://i.pravatar.cc/200?u=master-p",
    role: "Crime and drama",
    bio: "Long-form crime sagas and family dramas. Longest-serving voice in the roster.",
    since: 2014,
  },
  {
    id: "savimbi",
    name: "Savimbi",
    slug: "savimbi",
    avatar: "https://i.pravatar.cc/200?u=savimbi",
    role: "Thriller and action",
    bio: "Voices thrillers and road action. Works with the night-shift record crew.",
    since: 2019,
  },
  {
    id: "pk",
    name: "Pk The Sound",
    slug: "pk-the-sound",
    avatar: "https://i.pravatar.cc/200?u=pk-the-sound",
    role: "Music",
    bio: "Music titles and sound-led drama. Voices The Sound Booth series.",
    since: 2021,
  },
  {
    id: "senior",
    name: "Senior",
    slug: "senior",
    avatar: "https://i.pravatar.cc/200?u=senior",
    role: "Drama",
    bio: "Slow-burn drama and stage stories, including Senior Hours.",
    since: 2015,
  },
];

const episodeTitles = [
  "First call",
  "The short way home",
  "Two keys",
  "Paper trail",
  "A quiet hour",
  "What the landlord saw",
  "Crosswind",
  "The last fare",
  "Under the bridge",
  "Second statement",
  "No signal",
  "Day shift",
  "The long room",
  "Hillside",
  "One more night",
  "Closing time",
];

const buildSeasons = (
  seriesId: string,
  plan: number[],
  seed: number,
): Season[] =>
  plan.map((episodeCount, seasonIndex) => ({
    number: seasonIndex + 1,
    episodes: Array.from({ length: episodeCount }, (_, index) => {
      const number = index + 1;
      return {
        id: `${seriesId}-s${seasonIndex + 1}e${number}`,
        seriesId,
        season: seasonIndex + 1,
        number,
        title: episodeTitles[(seed + index + seasonIndex * 3) % episodeTitles.length],
        duration: 38 + ((seed + index * 7 + seasonIndex * 5) % 17),
        synopsis: `Season ${seasonIndex + 1}, episode ${number}.`,
        videoUrl: SAMPLE_VIDEOS[(seed + number + seasonIndex) % SAMPLE_VIDEOS.length],
      };
    }),
  }));

const movie = (
  input: Omit<Movie, "kind" | "quality" | "subtitles" | "downloadUrl" | "videoUrl"> & {
    videoIndex?: number;
  },
): Movie => {
  const { videoIndex = 0, ...rest } = input;
  return {
    ...rest,
    kind: "movie",
    quality: rest.year >= 2025 ? "4K" : "HD",
    subtitles: ["English", "French", "Swahili"],
    tags: rest.tags,
    videoUrl: SAMPLE_VIDEOS[videoIndex % SAMPLE_VIDEOS.length],
    downloadUrl: SAMPLE_VIDEOS[videoIndex % SAMPLE_VIDEOS.length],
  };
};

const series = (
  input: Omit<
    SeriesTitle,
    "kind" | "quality" | "subtitles" | "videoUrl" | "downloadUrl" | "seasons"
  > & { plan: number[]; seed: number },
): SeriesTitle => {
  const { plan, seed, ...rest } = input;
  return {
    ...rest,
    kind: "series",
    quality: "4K",
    subtitles: ["English", "French", "Swahili"],
    tags: rest.tags,
    videoUrl: SAMPLE_VIDEOS[seed % SAMPLE_VIDEOS.length],
    downloadUrl: SAMPLE_VIDEOS[seed % SAMPLE_VIDEOS.length],
    seasons: buildSeasons(rest.id, plan, seed),
  };
};

export const MOVIES: Movie[] = [
  movie({
    id: "midnight-shadows",
    slug: "midnight-shadows",
    title: "Midnight Shadows",
    year: 2025,
    releasedAt: "2026-10-24",
    synopsis:
      "A night-shift mechanic in Nyamirambo agrees to move one unmarked car and spends the rest of the week explaining it to three different people.",
    genre: "Crime / Thriller",
    categoryIds: ["crime", "thriller"],
    interpreterId: "rocky",
    rating: 4.8,
    votes: 3120,
    views: 284000,
    runtime: 118,
    image: still("photo-1490668219599-a79d4d90cf66"),
    imageCredit: "Chris Buckwald on Unsplash",
    tone: "violet",
    tags: ["Night", "Kigali", "Crime"],
    featured: true,
    videoIndex: 0,
  }),
  movie({
    id: "neon-nights",
    title: "Neon Nights",
    slug: "neon-nights",
    year: 2025,
    releasedAt: "2026-09-30",
    synopsis:
      "A club sound engineer is pulled into a debt dispute after a set that never happened.",
    genre: "Thriller",
    categoryIds: ["thriller", "music"],
    interpreterId: "junior",
    rating: 4.6,
    votes: 2140,
    views: 198000,
    runtime: 104,
    image: still("photo-1765154017463-5ca216ec2b67"),
    imageCredit: "Jim Luo on Unsplash",
    tone: "rose",
    tags: ["Night", "Music"],
    featured: true,
    videoIndex: 1,
  }),
  movie({
    id: "premier-cut",
    title: "The Premier Cut",
    slug: "premier-cut",
    year: 2025,
    releasedAt: "2026-08-15",
    synopsis:
      "A film editor re-cuts a case file for a client who wants the timeline to match a different story.",
    genre: "Crime",
    categoryIds: ["crime", "drama"],
    interpreterId: "sankara",
    rating: 4.9,
    votes: 4025,
    views: 341000,
    runtime: 126,
    image: still("photo-1650661926447-9efb2610f64c"),
    imageCredit: "Faraaz Zuberi on Unsplash",
    tone: "gold",
    tags: ["Kigali", "Crime"],
    featured: true,
    videoIndex: 2,
  }),
  movie({
    id: "simba-pride",
    title: "Simba Pride",
    slug: "simba-pride",
    year: 2024,
    releasedAt: "2026-06-02",
    synopsis:
      "A park guide crosses the eastern savannah to bring a stranded family back before the rains close the road.",
    genre: "Adventure",
    categoryIds: ["adventure", "drama"],
    interpreterId: "gaheza",
    rating: 4.7,
    votes: 1880,
    views: 156000,
    runtime: 110,
    image: still("photo-1595652974625-f01356aa9316"),
    imageCredit: "Eelco Böhtlingk on Unsplash",
    tone: "gold",
    tags: ["Savannah", "Road"],
    featured: false,
    videoIndex: 3,
  }),
  movie({
    id: "yanga-rising",
    title: "Yanga Rising",
    slug: "yanga-rising",
    year: 2026,
    releasedAt: "2026-11-06",
    synopsis:
      "A market trader takes over her mother's stall and the loan attached to it.",
    genre: "Drama",
    categoryIds: ["drama"],
    interpreterId: "yanga",
    rating: 4.5,
    votes: 960,
    views: 74000,
    runtime: 96,
    image: still("photo-1793653692772-61afabd378ed"),
    imageCredit: "Рома Морозов on Unsplash",
    tone: "mint",
    tags: ["Market", "Family"],
    featured: false,
    videoIndex: 4,
  }),
  movie({
    id: "greatness-unleashed",
    title: "Greatness Unleashed",
    slug: "greatness-unleashed",
    year: 2025,
    releasedAt: "2026-07-19",
    synopsis:
      "A gym trainer in Kimironko prepares a fighter who has already decided the outcome of the bout.",
    genre: "Action / Drama",
    categoryIds: ["action", "drama"],
    interpreterId: "bthegreat",
    rating: 4.8,
    votes: 2670,
    views: 211000,
    runtime: 121,
    image: still("photo-1737381371228-a3b99957cd1d"),
    imageCredit: "Amirr Zolfaghari on Unsplash",
    tone: "rose",
    tags: ["Sport", "Kigali"],
    featured: true,
    videoIndex: 0,
  }),
  movie({
    id: "master-p-legacy",
    title: "Master P Legacy",
    slug: "master-p-legacy",
    year: 2024,
    releasedAt: "2026-04-11",
    synopsis:
      "Three siblings share a house, a workshop and one unfinished agreement from their father.",
    genre: "Drama / Crime",
    categoryIds: ["drama", "crime"],
    interpreterId: "masterp",
    rating: 4.9,
    votes: 3890,
    views: 318000,
    runtime: 132,
    image: still("photo-1794947887846-17ea490eb8ac"),
    imageCredit: "Emmanuel Black on Unsplash",
    tone: "violet",
    tags: ["Family", "Estate"],
    featured: true,
    videoIndex: 1,
  }),
  movie({
    id: "savimbi-fire",
    title: "Savimbi Fire",
    slug: "savimbi-fire",
    year: 2025,
    releasedAt: "2026-09-12",
    synopsis:
      "A courier rides through a closed district on a delivery that was booked twice.",
    genre: "Thriller",
    categoryIds: ["thriller", "action"],
    interpreterId: "savimbi",
    rating: 4.7,
    votes: 1720,
    views: 143000,
    runtime: 99,
    image: still("photo-1732442719156-99ecfcc5373a"),
    imageCredit: "Mustafa Turhan on Unsplash",
    tone: "rose",
    tags: ["Rain", "Night"],
    featured: false,
    videoIndex: 2,
  }),
  movie({
    id: "sound-waves",
    title: "Sound Waves",
    slug: "sound-waves",
    year: 2025,
    releasedAt: "2026-08-28",
    synopsis:
      "A singer and a studio engineer disagree about the mix on the album that is meant to restart both careers.",
    genre: "Music / Drama",
    categoryIds: ["music", "drama"],
    interpreterId: "pk",
    rating: 4.6,
    votes: 1340,
    views: 96000,
    runtime: 107,
    image: still("photo-1604277598647-eadc8645952c"),
    imageCredit: "Danny Lines on Unsplash",
    tone: "violet",
    tags: ["Studio", "Music"],
    featured: false,
    videoIndex: 3,
  }),
  movie({
    id: "senior-chapter",
    title: "Senior Chapter",
    slug: "senior-chapter",
    year: 2024,
    releasedAt: "2026-03-20",
    synopsis:
      "A retired teacher moves in with his daughter's family and reopens a class for the neighbourhood children.",
    genre: "Drama",
    categoryIds: ["drama", "comedy"],
    interpreterId: "senior",
    rating: 4.4,
    votes: 870,
    views: 68000,
    runtime: 112,
    image: still("photo-1617622180357-7ebba0982c45"),
    imageCredit: "ben frost on Unsplash",
    tone: "gold",
    tags: ["Family", "School"],
    featured: false,
    videoIndex: 4,
  }),
  movie({
    id: "kigali-nocturne",
    title: "Kigali Nocturne",
    slug: "kigali-nocturne",
    year: 2026,
    releasedAt: "2026-11-14",
    synopsis:
      "A radio host takes calls about a missing car while the car sits outside the studio.",
    genre: "Crime / Thriller",
    categoryIds: ["crime", "thriller"],
    interpreterId: "rocky",
    rating: 4.8,
    votes: 2105,
    views: 172000,
    runtime: 115,
    image: still("photo-1787692141412-9a0fb5202213"),
    imageCredit: "Alan Villegas on Unsplash",
    tone: "violet",
    tags: ["Night", "Radio"],
    featured: true,
    videoIndex: 0,
  }),
  movie({
    id: "the-last-fare",
    title: "The Last Fare",
    slug: "the-last-fare",
    year: 2024,
    releasedAt: "2026-05-09",
    synopsis:
      "A taxi driver accepts a cash trip to Musanze and spends the journey deciding whether to ask who is waiting at the other end.",
    genre: "Drama / Thriller",
    categoryIds: ["drama", "thriller"],
    interpreterId: "junior",
    rating: 4.7,
    votes: 1590,
    views: 128000,
    runtime: 103,
    image: still("photo-1624607391711-d95005e501ac"),
    imageCredit: "Christian Lue on Unsplash",
    tone: "sky",
    tags: ["Road", "Rain"],
    featured: false,
    videoIndex: 1,
  }),
  movie({
    id: "hillside-kings",
    title: "Hillside Kings",
    slug: "hillside-kings",
    year: 2023,
    releasedAt: "2026-01-27",
    synopsis:
      "Two brothers build a cinema out of a disused hall and discover that the projector is the easy part.",
    genre: "Drama",
    categoryIds: ["drama", "comedy"],
    interpreterId: "sankara",
    rating: 4.6,
    votes: 1240,
    views: 89000,
    runtime: 124,
    image: still("photo-1759103570737-8485420df3a5"),
    imageCredit: "Christine Zhang on Unsplash",
    tone: "gold",
    tags: ["Cinema", "Family"],
    featured: false,
    videoIndex: 2,
  }),
  movie({
    id: "umuganda",
    title: "Umuganda",
    slug: "umuganda",
    year: 2025,
    releasedAt: "2026-09-06",
    synopsis:
      "A community work day turns into a negotiation over a footpath, a fence and twenty years of neighbourly silence.",
    genre: "Comedy / Drama",
    categoryIds: ["comedy", "drama"],
    interpreterId: "yanga",
    rating: 4.5,
    votes: 1010,
    views: 81000,
    runtime: 101,
    image: still("photo-1686749143903-2da00ebf445c"),
    imageCredit: "Marea Wellness on Unsplash",
    tone: "mint",
    tags: ["Neighbourhood", "Kigali"],
    featured: false,
    videoIndex: 3,
  }),
  movie({
    id: "second-round",
    title: "Second Round",
    slug: "second-round",
    year: 2026,
    releasedAt: "2026-10-03",
    synopsis:
      "A boxer returns to the ring for one rematch and finds the purse was never the reason he left.",
    genre: "Action / Drama",
    categoryIds: ["action", "drama"],
    interpreterId: "bthegreat",
    rating: 4.8,
    votes: 2380,
    views: 194000,
    runtime: 119,
    image: still("photo-1632174400834-b816c09b8c37"),
    imageCredit: "Mathias Reding on Unsplash",
    tone: "rose",
    tags: ["Sport", "Rematch"],
    featured: true,
    videoIndex: 4,
  }),
  movie({
    id: "radio-silence",
    title: "Radio Silence",
    slug: "radio-silence",
    year: 2024,
    releasedAt: "2026-06-21",
    synopsis:
      "A night guard monitors a car park camera feed that shows yesterday's street.",
    genre: "Thriller",
    categoryIds: ["thriller", "crime"],
    interpreterId: "pk",
    rating: 4.6,
    votes: 890,
    views: 72000,
    runtime: 94,
    image: still("photo-1762100716015-413e2e9b8a44"),
    imageCredit: "Leyla M on Unsplash",
    tone: "sky",
    tags: ["Night", "Surveillance"],
    featured: false,
    videoIndex: 0,
  }),
  movie({
    id: "nyamirambo-blue",
    title: "Nyamirambo Blue",
    slug: "nyamirambo-blue",
    year: 2025,
    releasedAt: "2026-08-02",
    synopsis:
      "A photographer and a bus conductor keep meeting on the same twenty-minute route.",
    genre: "Romance / Drama",
    categoryIds: ["romance", "drama"],
    interpreterId: "masterp",
    rating: 4.5,
    votes: 1450,
    views: 118000,
    runtime: 106,
    image: still("photo-1704462782000-5a2b96b9b1c1"),
    imageCredit: "Valentin Lacoste on Unsplash",
    tone: "sky",
    tags: ["Kigali", "Romance"],
    featured: false,
    videoIndex: 1,
  }),
  movie({
    id: "umva",
    title: "Umva",
    slug: "umva",
    year: 2023,
    releasedAt: "2026-02-14",
    synopsis:
      "Finally, two estranged sisters share a house for three days of funeral arrangements.",
    genre: "Drama",
    categoryIds: ["drama"],
    interpreterId: "senior",
    rating: 4.7,
    votes: 1120,
    views: 93000,
    runtime: 108,
    image: still("photo-1674501679769-a56d5450df58"),
    imageCredit: "Ömer Gülcü on Unsplash",
    tone: "gold",
    tags: ["Family", "Quiet"],
    featured: false,
    videoIndex: 2,
  }),
  movie({
    id: "dust-and-chrome",
    title: "Dust & Chrome",
    slug: "dust-and-chrome",
    year: 2026,
    releasedAt: "2026-11-01",
    synopsis:
      "A motorcycle courier racing a closing border post takes a detour through the hills to shake off a tail.",
    genre: "Action / Adventure",
    categoryIds: ["action", "adventure"],
    interpreterId: "savimbi",
    rating: 4.7,
    votes: 1760,
    views: 151000,
    runtime: 113,
    image: still("photo-1701602060030-cc78ff8409ee"),
    imageCredit: "Tyler Delgado on Unsplash",
    tone: "gold",
    tags: ["Road", "Action"],
    featured: false,
    videoIndex: 3,
  }),
  movie({
    id: "the-long-take",
    title: "The Long Take",
    slug: "the-long-take",
    year: 2024,
    releasedAt: "2026-04-26",
    synopsis:
      "A projectionist in Huye tries to screen a film whose last reel was never delivered.",
    genre: "Drama",
    categoryIds: ["drama", "comedy"],
    interpreterId: "gaheza",
    rating: 4.4,
    votes: 640,
    views: 51000,
    runtime: 92,
    image: still("photo-1776538598033-e7d13f6ddc6e"),
    imageCredit: "Rafael Amaral on Unsplash",
    tone: "violet",
    tags: ["Cinema", "Huye"],
    featured: false,
    videoIndex: 4,
  }),
  movie({
    id: "kigali-night-bus",
    title: "Kigali Night Bus",
    slug: "kigali-night-bus",
    year: 2025,
    releasedAt: "2026-07-05",
    synopsis:
      "Eleven passengers, one broken-down bus and a driver who refuses to admit he has the wrong address.",
    genre: "Comedy",
    categoryIds: ["comedy", "adventure"],
    interpreterId: "gaheza",
    rating: 4.5,
    votes: 1230,
    views: 104000,
    runtime: 97,
    image: still("photo-1626406217034-ef645dfd96ee"),
    imageCredit: "Brandi Alexandra on Unsplash",
    tone: "mint",
    tags: ["Road", "Comedy"],
    featured: false,
    videoIndex: 0,
  }),
];

export const SERIES: SeriesTitle[] = [
  series({
    id: "city-of-shadows",
    slug: "city-of-shadows",
    title: "City of Shadows",
    year: 2026,
    releasedAt: "2026-10-17",
    synopsis:
      "A precinct desk team works the cases that arrive after midnight, one week at a time.",
    genre: "Crime / Drama",
    categoryIds: ["crime", "drama"],
    interpreterId: "rocky",
    rating: 4.9,
    votes: 5210,
    views: 486000,
    image: still("photo-1704462782000-5a2b96b9b1c1"),
    imageCredit: "Valentin Lacoste on Unsplash",
    tone: "violet",
    tags: ["Night", "Case"],
    featured: true,
    plan: [6, 6, 8],
    seed: 1,
  }),
  series({
    id: "neon-empire",
    slug: "neon-empire",
    title: "Neon Empire",
    year: 2025,
    releasedAt: "2026-09-20",
    synopsis:
      "Two rival promoters run competing club nights in the same building.",
    genre: "Thriller / Music",
    categoryIds: ["thriller", "music"],
    interpreterId: "junior",
    rating: 4.7,
    votes: 3180,
    views: 302000,
    image: still("photo-1780421908450-c528953306c8"),
    imageCredit: "Stefan Szankowski on Unsplash",
    tone: "rose",
    tags: ["Night", "Music"],
    featured: true,
    plan: [5, 7],
    seed: 3,
  }),
  series({
    id: "premier-dynasty",
    slug: "premier-dynasty",
    title: "Premier Dynasty",
    year: 2024,
    releasedAt: "2026-05-30",
    synopsis:
      "A transport family divides the routes, the yard and the name after the founder steps back.",
    genre: "Drama",
    categoryIds: ["drama", "crime"],
    interpreterId: "sankara",
    rating: 4.8,
    votes: 4460,
    views: 412000,
    image: still("photo-1791391279613-d5bafee671fa"),
    imageCredit: "Clara Dickieson on Unsplash",
    tone: "gold",
    tags: ["Family", "Business"],
    featured: true,
    plan: [7, 7, 8, 8],
    seed: 5,
  }),
  series({
    id: "simba-chronicles",
    slug: "simba-chronicles",
    title: "Simba Chronicles",
    year: 2025,
    releasedAt: "2026-08-09",
    synopsis:
      "A wildlife unit follows a pride across one dry season and the villages along its route.",
    genre: "Adventure / Drama",
    categoryIds: ["adventure", "drama"],
    interpreterId: "gaheza",
    rating: 4.6,
    votes: 2040,
    views: 187000,
    image: still("photo-1595652973888-c5677816f6f4"),
    imageCredit: "Eelco Böhtlingk on Unsplash",
    tone: "gold",
    tags: ["Savannah", "Wildlife"],
    featured: false,
    plan: [6, 6, 6],
    seed: 7,
  }),
  series({
    id: "master-p-kingdom",
    slug: "master-p-kingdom",
    title: "Master P Kingdom",
    year: 2024,
    releasedAt: "2026-03-08",
    synopsis:
      "A nightclub owner brokers peace between two crews while the licence renewal sits on his desk.",
    genre: "Crime / Action",
    categoryIds: ["crime", "action"],
    interpreterId: "masterp",
    rating: 4.9,
    votes: 4980,
    views: 455000,
    image: still("photo-1616140862003-2df5a7988fdf"),
    imageCredit: "Falaq Lazuardi on Unsplash",
    tone: "violet",
    tags: ["Night", "Crews"],
    featured: true,
    plan: [8, 8, 8, 8, 8],
    seed: 2,
  }),
  series({
    id: "the-sound-booth",
    slug: "the-sound-booth",
    title: "The Sound Booth",
    year: 2026,
    releasedAt: "2026-10-10",
    synopsis:
      "Inside the Kinyarwanda dubbing booth: four interpreters record a season in six weeks.",
    genre: "Music / Drama",
    categoryIds: ["music", "drama"],
    interpreterId: "pk",
    rating: 4.8,
    votes: 2870,
    views: 246000,
    image: still("photo-1553236152-72dd67ab92ed"),
    imageCredit: "Jacob Mejicanos on Unsplash",
    tone: "violet",
    tags: ["Studio", "Voices"],
    featured: true,
    plan: [6, 6],
    seed: 4,
  }),
  series({
    id: "senior-hours",
    slug: "senior-hours",
    title: "Senior Hours",
    year: 2023,
    releasedAt: "2026-01-19",
    synopsis:
      "A care home in Kacyiru opens a late-night radio hour run by its residents.",
    genre: "Drama / Comedy",
    categoryIds: ["drama", "comedy"],
    interpreterId: "senior",
    rating: 4.5,
    votes: 1520,
    views: 132000,
    image: still("photo-1679868053865-c062b1d7f34a"),
    imageCredit: "Gülendam Afra Akalan on Unsplash",
    tone: "gold",
    tags: ["Radio", "Family"],
    featured: false,
    plan: [5, 5],
    seed: 6,
  }),
  series({
    id: "yangas-table",
    slug: "yangas-table",
    title: "Yanga's Table",
    year: 2025,
    releasedAt: "2026-07-26",
    synopsis:
      "A Sunday lunch place in Kimisagara seats regulars who all want the same corner table.",
    genre: "Drama / Comedy",
    categoryIds: ["comedy", "drama"],
    interpreterId: "yanga",
    rating: 4.6,
    votes: 1890,
    views: 164000,
    image: still("photo-1792357485535-eb4f3d621b52"),
    imageCredit: "Clara Dickieson on Unsplash",
    tone: "mint",
    tags: ["Restaurant", "Kigali"],
    featured: false,
    plan: [6, 6],
    seed: 8,
  }),
  series({
    id: "fire-line",
    slug: "fire-line",
    title: "Fire Line",
    year: 2026,
    releasedAt: "2026-11-08",
    synopsis:
      "A hill-crew firefighting unit covers the ridge season with two trucks and one working radio.",
    genre: "Action / Drama",
    categoryIds: ["action", "adventure"],
    interpreterId: "savimbi",
    rating: 4.7,
    votes: 2210,
    views: 203000,
    image: still("photo-1667502245293-25668605cccb"),
    imageCredit: "Leo_Visions on Unsplash",
    tone: "rose",
    tags: ["Action", "Hills"],
    featured: false,
    plan: [5, 6],
    seed: 9,
  }),
];

export const TITLES: Title[] = [...MOVIES, ...SERIES];

export const isMovie = (title: Title): title is Movie => title.kind === "movie";
export const isSeries = (title: Title): title is SeriesTitle => title.kind === "series";

export const getTitleById = (id: string | undefined): Title | undefined =>
  TITLES.find((title) => title.id === id);

export const getInterpreterById = (id: string): Interpreter | undefined =>
  INTERPRETERS.find((interpreter) => interpreter.id === id);

export const getInterpreterBySlug = (slug: string): Interpreter | undefined =>
  INTERPRETERS.find((interpreter) => interpreter.slug === slug);

export const getCategory = (id: string): Category | undefined =>
  CATEGORIES.find((category) => category.id === id);

export const getCategoryBySlug = (slug: string): Category | undefined =>
  CATEGORIES.find((category) => category.slug === slug);

export const titlesByInterpreter = (interpreterId: string): Title[] =>
  TITLES.filter((title) => title.interpreterId === interpreterId);

export const titlesInCategory = (categoryId: string): Title[] =>
  TITLES.filter((title) => title.categoryIds.includes(categoryId));

export const interpreterCounts = (interpreterId: string) => {
  const titles = titlesByInterpreter(interpreterId);
  const movieCount = titles.filter(isMovie).length;
  return { movies: movieCount, series: titles.length - movieCount, total: titles.length };
};

export const categoryCount = (categoryId: string) => titlesInCategory(categoryId).length;

export const allEpisodes = (title: SeriesTitle): Episode[] =>
  title.seasons.flatMap((season) => season.episodes);

export const totalEpisodes = (title: SeriesTitle): number =>
  title.seasons.reduce((total, season) => total + season.episodes.length, 0);

export const getEpisode = (title: SeriesTitle, episodeId?: string): Episode | undefined => {
  if (!episodeId) return title.seasons[0]?.episodes[0];
  return title.seasons
    .flatMap((season) => season.episodes)
    .find((episode) => episode.id === episodeId);
};

export const nextEpisode = (series: SeriesTitle, episodeId: string): Episode | undefined => {
  const episodes = allEpisodes(series);
  const index = episodes.findIndex((episode) => episode.id === episodeId);
  if (index === -1) return undefined;
  return episodes[index + 1];
};

export const relatedTitles = (title: Title, limit = 6): Title[] => {
  const sameInterpreter = TITLES.filter(
    (candidate) => candidate.id !== title.id && candidate.interpreterId === title.interpreterId,
  );
  const sameCategory = TITLES.filter(
    (candidate) =>
      candidate.id !== title.id &&
      candidate.interpreterId !== title.interpreterId &&
      candidate.categoryIds.some((category) => title.categoryIds.includes(category)),
  );
  return [...sameInterpreter, ...sameCategory].slice(0, limit);
};

export const trendingTitles = (limit = 6): Title[] =>
  [...TITLES].sort((a, b) => b.views - a.views).slice(0, limit);

export const latestTitles = (limit = 8): Title[] =>
  [...TITLES].sort((a, b) => b.releasedAt.localeCompare(a.releasedAt)).slice(0, limit);

const HERO_PREFERENCE = ["kigali-nocturne", "greatness-unleashed", "midnight-shadows"];

export const featuredTitle = (): Title =>
  HERO_PREFERENCE.map((id) => getTitleById(id)).find((title): title is Title =>
    Boolean(title && title.featured),
  ) ?? TITLES[0];


export const searchCatalog = (query: string) => {
  const value = query.trim().toLowerCase();
  if (!value) return { titles: [] as Title[], interpreters: [] as Interpreter[] };

  const titles = TITLES.filter((title) => {
    const interpreter = getInterpreterById(title.interpreterId);
    return (
      title.title.toLowerCase().includes(value) ||
      title.genre.toLowerCase().includes(value) ||
      title.tags.some((tag) => tag.toLowerCase().includes(value)) ||
      Boolean(interpreter?.name.toLowerCase().includes(value))
    );
  }).sort((a, b) => a.title.localeCompare(b.title));

  const interpreters = INTERPRETERS.filter((interpreter) =>
    interpreter.name.toLowerCase().includes(value),
  );

  return { titles, interpreters };
};

export const TRENDING_SEARCHES = [
  "Rocky Kimomo",
  "City of Shadows",
  "Kigali",
  "Night",
  "Master P",
  "Comedy",
];



/**
 * gifzo.lol Main Application Logic
 * Implements masonry feed, search, category filters, detail modal, 
 * upload modal, local storage favorites, and article reader.
 */

// Global App State
const state = {
  activeTab: 'stories', // 'stories', 'gifs', 'stickers'
  activeCategory: 'All',
  searchQuery: '',
  favorites: JSON.parse(localStorage.getItem('gifzo_favorites') || localStorage.getItem('giphy_favorites') || '[]'),
  uploadedItems: JSON.parse(localStorage.getItem('gifzo_uploaded') || localStorage.getItem('giphy_uploaded') || '[]'),
  activeArticle: null,
  activeMediaModal: null
};

// Curated Initial Catalog of High-Quality Animated GIFs, Stickers, & Clips
const INITIAL_CATALOG = [
  // --- REACTION & TRENDING GIFS ---
  {
    id: "g1",
    type: "gifs",
    title: "Mind Blown Galaxy Explosion",
    category: "Reactions",
    user: "CosmicVisuals",
    userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&auto=format&fit=crop&q=80",
    url: "https://media.giphy.com/media/l0ErTYG23Hyn67Fxm/giphy.gif",
    width: 480,
    height: 360,
    tags: ["mind blown", "space", "galaxy", "wow", "explosion"]
  },
  {
    id: "g2",
    type: "gifs",
    title: "Cat Typing Fast on Laptop",
    category: "Memes",
    user: "PixelPaws",
    userAvatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=60&auto=format&fit=crop&q=80",
    url: "https://media.giphy.com/media/1SymAX7raq13OvyzLg/giphy.gif",
    width: 500,
    height: 280,
    tags: ["cat", "work", "typing", "coding", "fast"]
  },
  {
    id: "g3",
    type: "gifs",
    title: "Retro 80s Cyberpunk Highway Drive",
    category: "Gaming",
    user: "SynthwaveMaster",
    userAvatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=60&auto=format&fit=crop&q=80",
    url: "https://media.giphy.com/media/gv7OG450o4PeM/giphy.gif",
    width: 480,
    height: 360,
    tags: ["cyberpunk", "synthwave", "80s", "neon", "drive"]
  },
  {
    id: "g4",
    type: "gifs",
    title: "Popcorn Cheering Shock Reaction",
    category: "Entertainment",
    user: "CinemaLover",
    userAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=60&auto=format&fit=crop&q=80",
    url: "https://media.giphy.com/media/x0qP0643fys3wnt4uP/giphy.gif",
    width: 480,
    height: 270,
    tags: ["popcorn", "movie", "gasp", "drama", "shock"]
  },
  {
    id: "g5",
    type: "gifs",
    title: "Happy Dancing Dog Celebration",
    category: "Reactions",
    user: "PuppyParty",
    userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&auto=format&fit=crop&q=80",
    url: "https://media.giphy.com/media/nn2kmb1lRtpkY/giphy.gif",
    width: 450,
    height: 450,
    tags: ["happy", "dog", "dance", "celebrate", "cute"]
  },
  {
    id: "g6",
    type: "gifs",
    title: "Anime Rainy Night Coffee Shop",
    category: "Anime",
    user: "LoFiVibes",
    userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&auto=format&fit=crop&q=80",
    url: "https://media.giphy.com/media/kBYniXGn9rSn75AS3l/giphy.gif",
    width: 480,
    height: 270,
    tags: ["anime", "rain", "lofi", "coffee", "chill"]
  },
  {
    id: "g7",
    type: "gifs",
    title: "Dunk Slam Basketball Fire",
    category: "Sports",
    user: "HoopDreams",
    userAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&auto=format&fit=crop&q=80",
    url: "https://media.giphy.com/media/6u9t67tyN1mV6VMrf7/giphy.gif",
    width: 480,
    height: 360,
    tags: ["basketball", "dunk", "sports", "fire", "hype"]
  },
  {
    id: "g8",
    type: "gifs",
    title: "Neon Glitch Abstract Shapes",
    category: "Artists",
    user: "MotionLab",
    userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&q=80",
    url: "https://media.giphy.com/media/8PqTcO444vDj2/giphy.gif",
    width: 400,
    height: 400,
    tags: ["glitch", "abstract", "art", "neon", "loop"]
  },

  // --- STICKERS (Transparent Background Animation) ---
  {
    id: "s1",
    type: "stickers",
    title: "Sparkle Neon Heart Pulsing",
    category: "Stickers",
    user: "StickerCentral",
    userAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=60&auto=format&fit=crop&q=80",
    url: "https://media.giphy.com/media/X8YmZeoAmqRFK/giphy.gif",
    width: 350,
    height: 350,
    tags: ["heart", "sparkle", "love", "neon", "sticker"]
  },
  {
    id: "s2",
    type: "stickers",
    title: "Dancing Rainbow Pizza Slice",
    category: "Stickers",
    user: "FoodieArt",
    userAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=60&auto=format&fit=crop&q=80",
    url: "https://media.giphy.com/media/xUA7b9kNfcKICBrlks/giphy.gif",
    width: 400,
    height: 400,
    tags: ["pizza", "food", "dance", "fun", "sticker"]
  },
  {
    id: "s3",
    type: "stickers",
    title: "LOL Neon Text Glow",
    category: "Stickers",
    user: "TextFx",
    userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&auto=format&fit=crop&q=80",
    url: "https://media.giphy.com/media/OpYV9CBVZOb1S/giphy.gif",
    width: 400,
    height: 250,
    tags: ["lol", "laugh", "text", "neon", "sticker"]
  },

  // --- CLIPS (Short Sound/Video Loops) ---
  {
    id: "c1",
    type: "clips",
    title: "Epic Victory Concert Fireworks",
    category: "Entertainment",
    user: "StageLive",
    userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&auto=format&fit=crop&q=80",
    url: "https://media.giphy.com/media/WIwvGzMSd8jGU/giphy.gif",
    width: 500,
    height: 300,
    tags: ["clip", "concert", "fireworks", "music", "hype"]
  },
  {
    id: "c2",
    type: "clips",
    title: "Futuristic Speeder Racing Track",
    category: "Gaming",
    user: "CyberRacer",
    userAvatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=60&auto=format&fit=crop&q=80",
    url: "https://media.giphy.com/media/HyOOyynWxMxig/giphy.gif",
    width: 480,
    height: 270,
    tags: ["clip", "racing", "speed", "scifi", "gaming"]
  },
  {
    id: "g9",
    type: "gifs",
    title: "Super Saiyan Power Up Transformation",
    category: "Anime",
    user: "DBZFanatic",
    userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&q=80",
    url: "https://media.giphy.com/media/xTiTnBMEz7zAKs57LG/giphy.gif",
    width: 480,
    height: 360,
    tags: ["anime", "dbz", "powerup", "energy", "saiyan"]
  },
  {
    id: "g10",
    type: "gifs",
    title: "Mind Blown Fireworks Brain Explosion",
    category: "Reactions",
    user: "BrainMelt",
    userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&auto=format&fit=crop&q=80",
    url: "https://media.giphy.com/media/fqhKXT4turqxq8NaCs/giphy.gif",
    width: 480,
    height: 360,
    tags: ["mindblown", "fireworks", "boom", "wow", "reaction"]
  },
  {
    id: "g11",
    type: "gifs",
    title: "Hilarious Cat Keyboard Coding Sprint",
    category: "Memes",
    user: "DevCat",
    userAvatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=60&auto=format&fit=crop&q=80",
    url: "https://media.giphy.com/media/lcwrrsfs4Px6w/giphy.gif",
    width: 500,
    height: 300,
    tags: ["cat", "coding", "keyboard", "meme", "work"]
  },
  {
    id: "g12",
    type: "gifs",
    title: "Grumpy Cat Judgmental Stare",
    category: "Reactions",
    user: "GrumpyCat",
    userAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=60&auto=format&fit=crop&q=80",
    url: "https://media.giphy.com/media/3o7TKJLO3D4kUgpa6I/giphy.gif",
    width: 450,
    height: 320,
    tags: ["grumpy", "cat", "stare", "disapproval", "reaction"]
  },
  {
    id: "s4",
    type: "stickers",
    title: "Glowing Neon Heart Pulse",
    category: "Stickers",
    user: "StickerWiz",
    userAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=60&auto=format&fit=crop&q=80",
    url: "https://media.giphy.com/media/t6JFpRFhBTkVib7ju1/giphy.gif",
    width: 350,
    height: 350,
    tags: ["heart", "neon", "sticker", "love", "glow"]
  },
  {
    id: "s5",
    type: "stickers",
    title: "Dancing Rainbow Taco",
    category: "Stickers",
    user: "TacoLovers",
    userAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=60&auto=format&fit=crop&q=80",
    url: "https://media.giphy.com/media/11shDO8NnZDYpa/giphy.gif",
    width: 400,
    height: 400,
    tags: ["taco", "dance", "rainbow", "food", "sticker"]
  },
  {
    id: "s6",
    type: "stickers",
    title: "Neon Basketball Fire Flame Loop",
    category: "Stickers",
    user: "FlameArt",
    userAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&auto=format&fit=crop&q=80",
    url: "https://media.giphy.com/media/7iTz3LdCBJJ1C/giphy.gif",
    width: 400,
    height: 400,
    tags: ["basketball", "fire", "flame", "sports", "sticker"]
  },
  {
    id: "c3",
    type: "clips",
    title: "Ultra Neon Cyber City Flyby",
    category: "Gaming",
    user: "FutureVibes",
    userAvatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=60&auto=format&fit=crop&q=80",
    url: "https://media.giphy.com/media/XfT1Xb2O2ShHy/giphy.gif",
    width: 500,
    height: 280,
    tags: ["clip", "cyberpunk", "city", "synthwave", "scifi"]
  },
  {
    id: "c4",
    type: "clips",
    title: "Stadium Fireworks Celebration",
    category: "Entertainment",
    user: "LiveConcerts",
    userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&auto=format&fit=crop&q=80",
    url: "https://media.giphy.com/media/hXD3cypLkycW1hQTFz/giphy.gif",
    width: 480,
    height: 270,
    tags: ["clip", "fireworks", "stadium", "party", "celebration"]
  },
  {
    id: "g13",
    type: "gifs",
    title: "Rickroll Dance Classic Loop",
    category: "Memes",
    user: "MemeLegens",
    userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&auto=format&fit=crop&q=80",
    url: "https://media.giphy.com/media/fallYu2VWPHZC/giphy.gif",
    width: 480,
    height: 360,
    tags: ["rickroll", "dance", "meme", "classic", "music"]
  },
  {
    id: "g14",
    type: "gifs",
    title: "Futuristic Hologram Grid Spin",
    category: "Artists",
    user: "HoloArtist",
    userAvatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=60&auto=format&fit=crop&q=80",
    url: "https://media.giphy.com/media/pt0EKLDJmVvlS/giphy.gif",
    width: 450,
    height: 350,
    tags: ["hologram", "future", "spin", "artist", "3d"]
  },
  {
    id: "s7",
    type: "stickers",
    title: "Party Confetti Explosion Sticker",
    category: "Stickers",
    user: "PartyStudio",
    userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&auto=format&fit=crop&q=80",
    url: "https://media.giphy.com/media/Af7ap9r7NzJJe/giphy.gif",
    width: 400,
    height: 400,
    tags: ["confetti", "party", "celebrate", "sticker", "joy"]
  },
  {
    id: "s8",
    type: "stickers",
    title: "Neon LoFi Chill Stars Sticker",
    category: "Stickers",
    user: "LoFiSpace",
    userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&auto=format&fit=crop&q=80",
    url: "https://media.giphy.com/media/xoRaAV8X227rG/giphy.gif",
    width: 380,
    height: 380,
    tags: ["stars", "lofi", "chill", "neon", "sticker"]
  },
  {
    id: "c5",
    type: "clips",
    title: "Power Energy Pulse Clip",
    category: "Anime",
    user: "AnimePower",
    userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&q=80",
    url: "https://media.giphy.com/media/3oKIP8kNuTJJL3zT0I/giphy.gif",
    width: 480,
    height: 270,
    tags: ["clip", "anime", "energy", "power", "saiyan"]
  },
  {
    id: "g15",
    type: "gifs",
    title: "Think Smart Big Brain Guy Meme",
    category: "Reactions",
    user: "BrainVibes",
    userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&auto=format&fit=crop&q=80",
    url: "https://media.giphy.com/media/d3mlE7uhX8KFgEmY/giphy.gif",
    width: 480,
    height: 270,
    tags: ["think", "smart", "brain", "meme", "reaction"]
  },
  {
    id: "g16",
    type: "gifs",
    title: "Excited Popcorn Movie Night",
    category: "Entertainment",
    user: "PopcornCinema",
    userAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=60&auto=format&fit=crop&q=80",
    url: "https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif",
    width: 480,
    height: 270,
    tags: ["popcorn", "movie", "entertainment", "fun", "excited"]
  },
  {
    id: "g17",
    type: "gifs",
    title: "Golden Trophy Applause Celebration",
    category: "Entertainment",
    user: "ShowtimeAwards",
    userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&auto=format&fit=crop&q=80",
    url: "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif",
    width: 480,
    height: 360,
    tags: ["awards", "celebration", "entertainment", "applause", "cheering"]
  },
  {
    id: "g18",
    type: "gifs",
    title: "Endzone Touchdown Victory Dance",
    category: "Sports",
    user: "TouchdownClub",
    userAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&auto=format&fit=crop&q=80",
    url: "https://media.giphy.com/media/26u4cqiYI30juCOGY/giphy.gif",
    width: 480,
    height: 270,
    tags: ["football", "touchdown", "sports", "celebration", "dance"]
  },
  {
    id: "g19",
    type: "gifs",
    title: "Steph Curry 3-Point Celebration",
    category: "Sports",
    user: "HoopsMaster",
    userAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&auto=format&fit=crop&q=80",
    url: "https://media.giphy.com/media/l0MYEqEzwMWFCg8rm/giphy.gif",
    width: 480,
    height: 270,
    tags: ["basketball", "curry", "sports", "celebration", "hype"]
  },
  {
    id: "g26",
    type: "gifs",
    title: "Lightning Fast Basketball Crossover",
    category: "Sports",
    user: "AnkleBreaker",
    userAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&auto=format&fit=crop&q=80",
    url: "https://media.giphy.com/media/l46CqLVMWzaJUFPLW/giphy.gif",
    width: 480,
    height: 268,
    tags: ["basketball", "crossover", "sports", "skills", "dribble"]
  },
  {
    id: "g27",
    type: "gifs",
    title: "World Cup Soccer Goal Slide",
    category: "Sports",
    user: "GoalZone",
    userAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&auto=format&fit=crop&q=80",
    url: "https://media.giphy.com/media/d2Z4NRCUxsxZBvag/giphy.gif",
    width: 480,
    height: 360,
    tags: ["soccer", "goal", "sports", "slide", "worldcup"]
  },
  {
    id: "g20",
    type: "gifs",
    title: "Kinetic Liquid Chrome 3D Sphere",
    category: "Artists",
    user: "LiquidForm",
    userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&q=80",
    url: "https://media.giphy.com/media/26AHONQ79FdWZhAI0/giphy.gif",
    width: 480,
    height: 360,
    tags: ["chrome", "liquid", "art", "3d", "render"]
  },
  {
    id: "g21",
    type: "gifs",
    title: "Retro 16-Bit Pixel Arcade Battle",
    category: "Gaming",
    user: "PixelKnight",
    userAvatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=60&auto=format&fit=crop&q=80",
    url: "https://media.giphy.com/media/3ohzdIuqJoo8QdKlnW/giphy.gif",
    width: 480,
    height: 270,
    tags: ["pixel", "arcade", "gaming", "retro", "16bit"]
  },
  {
    id: "g22",
    type: "gifs",
    title: "Cyberpunk Pixel Metropolis Downpour",
    category: "Gaming",
    user: "NeoTokyoArt",
    userAvatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=60&auto=format&fit=crop&q=80",
    url: "https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/giphy.gif",
    width: 480,
    height: 270,
    tags: ["cyberpunk", "gaming", "city", "pixelart", "rain"]
  },
  {
    id: "g23",
    type: "gifs",
    title: "Lo-Fi Anime Sunset Skyline Breeze",
    category: "Anime",
    user: "TokyoLoFi",
    userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&auto=format&fit=crop&q=80",
    url: "https://media.giphy.com/media/3o7TKMt1VVNkHV2PaE/giphy.gif",
    width: 480,
    height: 270,
    tags: ["anime", "lofi", "sunset", "aesthetic", "peaceful"]
  },
  {
    id: "g24",
    type: "gifs",
    title: "Dramatic Chipmunk Zoom Meme",
    category: "Memes",
    user: "ViralVault",
    userAvatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=60&auto=format&fit=crop&q=80",
    url: "https://media.giphy.com/media/Nm8ZPAGOwZUQM/giphy.gif",
    width: 480,
    height: 360,
    tags: ["chipmunk", "dramatic", "meme", "classic", "funny"]
  },
  {
    id: "g25",
    type: "gifs",
    title: "Never Gonna Give You Up Dance Loop",
    category: "Memes",
    user: "RickVault",
    userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&auto=format&fit=crop&q=80",
    url: "https://media.giphy.com/media/Ju7l5y9osyymQ/giphy.gif",
    width: 480,
    height: 360,
    tags: ["rickroll", "meme", "dance", "classic", "music"]
  }
];

// DOM Element References
let searchInput, searchBtn, searchClearBtn, suggestionsBox;
let navTabs, trendingTagsBar, mediaMasonryGrid, storiesGrid, articleReaderView;
let modalBackdrop, modalContent, uploadModalBackdrop, toastContainer;

// --- SEO & Structured Data Management ---

function updatePageSEO(title, description, canonicalUrl) {
  if (title) {
    document.title = title;
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.content = title;
    const twTitle = document.querySelector('meta[name="twitter:title"]');
    if (twTitle) twTitle.content = title;
  }

  if (description) {
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = description;

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.content = description;
    const twDesc = document.querySelector('meta[name="twitter:description"]');
    if (twDesc) twDesc.content = description;
  }

  if (canonicalUrl) {
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.rel = 'canonical';
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.href = canonicalUrl;

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.content = canonicalUrl;
  }
}

function refreshCurrentPageSEO() {
  if (state.activeArticle) {
    updatePageSEO(
      `${state.activeArticle.title} | gifzo.lol`,
      state.activeArticle.subtitle,
      `https://gifzo.lol/articles/${state.activeArticle.slug}.html`
    );
    return;
  }

  if (state.activeMediaModal) {
    updatePageSEO(
      `${state.activeMediaModal.title} - Animated ${state.activeMediaModal.category} Loop | gifzo.lol`,
      `Watch, copy and share "${state.activeMediaModal.title}" loop created by @${state.activeMediaModal.user || 'GifzoArtist'}. Category: ${state.activeMediaModal.category}.`,
      `https://gifzo.lol/?gif=${state.activeMediaModal.id}`
    );
    return;
  }

  if (state.activeTab === 'stories') {
    updatePageSEO(
      "gifzo.lol - Be Animated | GIFs, Stickers & Visual Culture Stories",
      "Search, discover, and share animated GIFs and transparent stickers on gifzo.lol. Explore in-depth stories on internet visual culture, digital semiotics, and loop art.",
      "https://gifzo.lol/"
    );
  } else if (state.activeTab === 'stickers') {
    updatePageSEO(
      "Trending Transparent Animated Stickers | gifzo.lol",
      "Explore transparent background animated stickers for messaging, reaction loops, and visual expression on gifzo.lol.",
      "https://gifzo.lol/?tab=stickers"
    );
  } else if (state.activeTab === 'favorites') {
    updatePageSEO(
      "Your Favorite Animated Loops | gifzo.lol",
      "Saved favorite animated GIFs and looping clips on gifzo.lol.",
      "https://gifzo.lol/?tab=favorites"
    );
  } else {
    // 'gifs'
    if (state.searchQuery) {
      updatePageSEO(
        `Search: "${state.searchQuery}" Animated GIFs | gifzo.lol`,
        `Search results for "${state.searchQuery}" animated GIFs and motion clips on gifzo.lol.`,
        `https://gifzo.lol/?q=${encodeURIComponent(state.searchQuery)}`
      );
    } else if (state.activeCategory && state.activeCategory !== 'All') {
      updatePageSEO(
        `${state.activeCategory} Animated GIFs & Highlights | gifzo.lol`,
        `Explore the freshest curated ${state.activeCategory} animated GIFs, high-speed clips, and viral loops on gifzo.lol.`,
        `https://gifzo.lol/?tab=gifs&category=${state.activeCategory.toLowerCase()}`
      );
    } else {
      updatePageSEO(
        "Trending Animated GIFs & High-Speed Loops | gifzo.lol",
        "Search, discover, and share animated GIFs and transparent stickers on gifzo.lol. Explore in-depth stories on internet visual culture.",
        "https://gifzo.lol/?tab=gifs"
      );
    }
  }
}

function updateImageGalleryJsonLd(items, galleryTitle) {
  let scriptTag = document.getElementById('schema-media-gallery');
  if (!scriptTag) {
    scriptTag = document.createElement('script');
    scriptTag.id = 'schema-media-gallery';
    scriptTag.type = 'application/ld+json';
    document.head.appendChild(scriptTag);
  }

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    "name": `${galleryTitle} - gifzo.lol`,
    "url": window.location.href,
    "description": `Curated collection of ${items.length} animated loops and digital motion clips on gifzo.lol.`,
    "itemListElement": items.slice(0, 30).map((item, idx) => ({
      "@type": "ImageObject",
      "position": idx + 1,
      "name": item.title,
      "caption": `${item.title} - ${item.category} Animated GIF`,
      "contentUrl": item.url,
      "thumbnailUrl": item.url,
      "width": `${item.width || 480} px`,
      "height": `${item.height || 270} px`,
      "keywords": (item.tags || []).join(', '),
      "author": {
        "@type": "Person",
        "name": item.user || "GIFZO Creator"
      }
    }))
  };

  scriptTag.textContent = JSON.stringify(schemaData, null, 2);
}

function updateUrlParams(updateUrl = true) {
  if (!updateUrl || !window.history || !window.history.replaceState) return;
  const params = new URLSearchParams();

  if (state.activeArticle) {
    params.set('article', state.activeArticle.slug);
  } else if (state.activeMediaModal) {
    params.set('gif', state.activeMediaModal.id);
  } else {
    if (state.activeTab && state.activeTab !== 'stories') {
      params.set('tab', state.activeTab);
    }
    if (state.activeCategory && state.activeCategory !== 'All') {
      params.set('category', state.activeCategory.toLowerCase());
    }
    if (state.searchQuery) {
      params.set('q', state.searchQuery);
    }
  }

  const queryString = params.toString();
  const newUrl = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname;
  window.history.replaceState({}, '', newUrl);
}

function handleInitialUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const tab = params.get('tab');
  const cat = params.get('category');
  const q = params.get('q');
  const gifId = params.get('gif');
  const articleSlug = params.get('article');

  if (articleSlug && typeof ARTICLES_DATA !== 'undefined') {
    const art = ARTICLES_DATA.find(a => a.slug === articleSlug);
    if (art) {
      switchTab('stories', false);
      renderArticleReader(art);
      return;
    }
  }

  if (q) {
    if (searchInput) searchInput.value = q;
    state.searchQuery = q;
    if (searchClearBtn) searchClearBtn.style.display = 'block';
    switchTab('gifs', false);
    return;
  }

  if (cat) {
    const validCats = ["All", "Reactions", "Entertainment", "Sports", "Stickers", "Artists", "Gaming", "Anime", "Memes"];
    const matched = validCats.find(c => c.toLowerCase() === cat.toLowerCase());
    if (matched) {
      state.activeCategory = matched;
      if (matched === 'Stickers') {
        switchTab('stickers', false);
      } else {
        switchTab('gifs', false);
      }
      return;
    }
  }

  if (tab) {
    if (['stories', 'gifs', 'stickers', 'favorites'].includes(tab)) {
      switchTab(tab, false);
      return;
    }
  }

  // Default to stories
  switchTab('stories', false);

  if (gifId) {
    const item = getCombinedMedia().find(i => i.id === gifId);
    if (item) {
      openDetailModal(item);
    }
  }
}

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  cacheDOMElements();
  bindEvents();
  renderTrendingTags();
  handleInitialUrlParams();
});

// Cache References
function cacheDOMElements() {
  searchInput = document.getElementById('search-input');
  searchBtn = document.getElementById('search-btn');
  searchClearBtn = document.getElementById('search-clear-btn');
  suggestionsBox = document.getElementById('search-suggestions');
  navTabs = document.querySelectorAll('.tab-btn');
  trendingTagsBar = document.getElementById('trending-tags-bar');
  mediaMasonryGrid = document.getElementById('media-masonry-grid');
  storiesGrid = document.getElementById('stories-grid');
  articleReaderView = document.getElementById('article-reader-view');
  modalBackdrop = document.getElementById('modal-backdrop');
  modalContent = document.getElementById('modal-card-body');
  uploadModalBackdrop = document.getElementById('upload-modal-backdrop');
  toastContainer = document.getElementById('toast-container');
}

// Bind Event Listeners
function bindEvents() {
  // Search Events
  if (searchInput) {
    searchInput.addEventListener('input', handleSearchInput);
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        executeSearch();
        suggestionsBox?.classList.remove('active');
      }
    });
  }
  searchBtn?.addEventListener('click', executeSearch);
  searchClearBtn?.addEventListener('click', clearSearch);

  // Browser History Navigation (Back / Forward SEO support)
  window.addEventListener('popstate', () => {
    handleInitialUrlParams();
  });

  // Tab Switching
  navTabs?.forEach(tab => {
    tab.addEventListener('click', (e) => {
      const targetTab = tab.dataset.tab;
      if (targetTab === 'stories') {
        state.activeCategory = 'All';
      }
      switchTab(targetTab);
    });
  });

  // Category Pills delegation
  trendingTagsBar?.addEventListener('click', (e) => {
    const pill = e.target.closest('.tag-pill');
    if (!pill) return;

    const cat = pill.dataset.category;
    state.activeCategory = cat;

    // Update active visual state across all trending pills
    document.querySelectorAll('.tag-pill').forEach(p => {
      p.classList.toggle('active', p.dataset.category === cat);
    });

    if (cat === 'Stickers') {
      switchTab('stickers');
    } else if (cat === 'All') {
      refreshCurrentPageSEO();
      updateUrlParams();
      renderActiveView();
    } else {
      // Media categories: Reactions, Entertainment, Sports, Artists, Gaming, Anime, Memes
      if (state.activeTab !== 'gifs') {
        switchTab('gifs');
      } else {
        refreshCurrentPageSEO();
        updateUrlParams();
        renderActiveView();
      }
    }

    // Smoothly bring the active content section into clear view
    const targetSection = state.activeTab === 'stories' 
      ? document.getElementById('stories-view') 
      : document.getElementById('media-view');
    targetSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // Logo Navigation (Home)
  document.getElementById('logo-home-link')?.addEventListener('click', (e) => {
    e.preventDefault();
    state.searchQuery = '';
    state.activeCategory = 'All';
    if (searchInput) searchInput.value = '';
    if (searchClearBtn) searchClearBtn.style.display = 'none';
    switchTab('stories');
  });

  // Open Upload Modal
  const btnCreateGif = document.getElementById('btn-create-gif');
  if (btnCreateGif) btnCreateGif.addEventListener('click', openUploadModal);
  document.getElementById('close-upload-modal')?.addEventListener('click', closeUploadModal);

  // Close Detail Modal
  document.getElementById('close-detail-modal')?.addEventListener('click', closeModal);
  modalBackdrop?.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeModal();
  });

  uploadModalBackdrop?.addEventListener('click', (e) => {
    if (e.target === uploadModalBackdrop) closeUploadModal();
  });

  // Upload Form Listener (guarded)
  const uploadForm = document.getElementById('upload-form');
  if (uploadForm) {
    uploadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('upload-title')?.value.trim();
      const url = document.getElementById('upload-url')?.value.trim();
      const category = document.getElementById('upload-category')?.value || 'Reactions';
      const tags = document.getElementById('upload-tags')?.value.split(',').map(t => t.trim()) || [];

      if (!title || !url) return;

      const newGif = {
        id: `custom_${Date.now()}`,
        type: 'gifs',
        title,
        category,
        user: 'MyUploadedGifs',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&q=80',
        url,
        width: 480,
        height: 360,
        tags
      };

      state.uploadedItems.unshift(newGif);
      localStorage.setItem('gifzo_uploaded', JSON.stringify(state.uploadedItems));

      closeUploadModal();
      uploadForm.reset();
      showToast('🎉 Custom GIF successfully uploaded and published!');
      switchTab('gifs');
    });
  }
}

// Synchronize Trending Pills with Current State
function syncTrendingPills() {
  document.querySelectorAll('.tag-pill').forEach(pill => {
    const cat = pill.dataset.category;
    if (state.activeTab === 'stickers') {
      pill.classList.toggle('active', cat === 'Stickers');
    } else if (state.activeTab === 'stories') {
      pill.classList.toggle('active', cat === (state.activeCategory || 'All'));
    } else {
      pill.classList.toggle('active', cat === state.activeCategory);
    }
  });
}

// Render Trending Category Pills
function renderTrendingTags() {
  const categories = ["All", "Reactions", "Entertainment", "Sports", "Stickers", "Artists", "Gaming", "Anime", "Memes"];
  trendingTagsBar.replaceChildren();

  const label = document.createElement('span');
  label.className = 'trending-label';
  label.textContent = '🔥 Trending:';
  trendingTagsBar.appendChild(label);

  categories.forEach(cat => {
    const pill = document.createElement('button');
    pill.className = `tag-pill ${cat === state.activeCategory ? 'active' : ''}`;
    pill.dataset.category = cat;
    pill.textContent = cat;
    trendingTagsBar.appendChild(pill);
  });

  syncTrendingPills();
}

// Switch Active View Tab
function switchTab(tabName, updateUrl = true) {
  state.activeTab = tabName;

  navTabs.forEach(t => {
    t.classList.toggle('active', t.dataset.tab === tabName);
  });

  document.querySelectorAll('.view-section').forEach(sec => {
    sec.classList.remove('active');
  });

  if (tabName === 'stories') {
    document.getElementById('stories-view').classList.add('active');
  } else {
    document.getElementById('media-view').classList.add('active');
  }

  syncTrendingPills();
  refreshCurrentPageSEO();
  if (updateUrl) updateUrlParams();
  renderActiveView();
}

// Search Input Handler & Autocomplete
function handleSearchInput(e) {
  const query = e.target.value.trim();
  searchClearBtn.style.display = query.length > 0 ? 'block' : 'none';

  if (query.length > 1) {
    const matches = getCombinedMedia().filter(item => 
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
    ).slice(0, 5);

    if (matches.length > 0) {
      suggestionsBox.replaceChildren();
      matches.forEach(item => {
        const div = document.createElement('div');
        div.className = 'suggestion-item';
        div.textContent = `🔍 ${item.title}`;
        div.addEventListener('click', () => {
          searchInput.value = item.title;
          executeSearch();
          suggestionsBox.classList.remove('active');
        });
        suggestionsBox.appendChild(div);
      });
      suggestionsBox.classList.add('active');
    } else {
      suggestionsBox.classList.remove('active');
    }
  } else {
    suggestionsBox.classList.remove('active');
  }
}

function executeSearch() {
  state.searchQuery = searchInput.value.trim();
  suggestionsBox.classList.remove('active');
  if (state.activeTab === 'stories') switchTab('gifs', false);
  refreshCurrentPageSEO();
  updateUrlParams();
  renderActiveView();
}

function clearSearch() {
  searchInput.value = '';
  state.searchQuery = '';
  searchClearBtn.style.display = 'none';
  suggestionsBox.classList.remove('active');
  refreshCurrentPageSEO();
  updateUrlParams();
  renderActiveView();
}

// Get Combined Media (Initial Catalog + Uploads)
function getCombinedMedia() {
  return [...state.uploadedItems, ...INITIAL_CATALOG];
}

// Main Render Dispatcher
function renderActiveView() {
  if (state.activeTab === 'stories') {
    renderArticlesGrid();
  } else {
    renderMediaGrid();
  }
}

// Render Media Masonry Grid (GIFs / Stickers / Clips / Favorites)
function renderMediaGrid() {
  mediaMasonryGrid.replaceChildren();

  let items = getCombinedMedia();

  // Filter by Tab Type
  if (state.activeTab === 'favorites') {
    items = items.filter(item => state.favorites.includes(item.id));
  } else if (state.activeTab === 'stickers') {
    items = items.filter(item => item.type === 'stickers');
  } else if (state.activeTab === 'clips') {
    items = items.filter(item => item.type === 'clips');
  } else { // 'gifs'
    items = items.filter(item => item.type === 'gifs' || !item.type);
  }

  // Filter by Category
  if (state.activeCategory !== 'All' && state.activeTab !== 'stickers') {
    items = items.filter(item => (item.category || '').toLowerCase() === state.activeCategory.toLowerCase());
  }

  // Filter by Search Query
  if (state.searchQuery) {
    const q = state.searchQuery.toLowerCase();
    items = items.filter(item => 
      item.title.toLowerCase().includes(q) || 
      item.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  // Section Header Update
  const titleElem = document.getElementById('view-section-title');
  if (titleElem) {
    if (state.activeTab === 'favorites') {
      titleElem.textContent = `❤️ FAVORITE LOOPS (${items.length})`;
    } else if (state.searchQuery) {
      titleElem.textContent = `🔍 SEARCH RESULTS FOR "${state.searchQuery.toUpperCase()}" (${items.length})`;
    } else if (state.activeTab === 'stickers') {
      titleElem.textContent = `✨ TRENDING STICKERS (${items.length} STICKERS)`;
    } else if (state.activeTab === 'clips') {
      titleElem.textContent = `🎬 VIDEO CLIPS (${items.length} CLIPS)`;
    } else {
      if (state.activeCategory === 'All') {
        titleElem.textContent = `🔥 TRENDING GIFS (${items.length} LOOPS)`;
      } else {
        titleElem.textContent = `🔥 ${state.activeCategory.toUpperCase()} GIFS (${items.length} LOOPS)`;
      }
    }
  }

  if (items.length === 0) {
    renderEmptyState(mediaMasonryGrid, `No GIF loops found in ${state.activeCategory}. Try selecting 'All' or another category.`);
    return;
  }

  // Inject/Update Schema.org ImageGallery Structured Data for SEO
  updateImageGalleryJsonLd(items, state.activeCategory === 'All' ? 'Trending Animated GIFs' : `${state.activeCategory} Animated GIFs`);

  items.forEach(item => {
    const card = createGifCard(item);
    mediaMasonryGrid.appendChild(card);
  });
}

// Create Card Element for GIF Masonry (Semantic & SEO Microdata)
function createGifCard(item) {
  const card = document.createElement('figure');
  card.className = 'gif-card';
  card.setAttribute('itemscope', '');
  card.setAttribute('itemtype', 'https://schema.org/ImageObject');

  const img = document.createElement('img');
  img.src = item.url;
  img.alt = `${item.title} - ${item.category} Animated GIF Loop`;
  img.title = item.title;
  img.width = item.width || 480;
  img.height = item.height || 270;
  img.loading = 'lazy';
  img.decoding = 'async';
  img.setAttribute('itemprop', 'contentUrl');
  card.appendChild(img);

  // Hidden Schema.org Microdata for SEO Crawlers
  const metaName = document.createElement('meta');
  metaName.setAttribute('itemprop', 'name');
  metaName.content = item.title;
  card.appendChild(metaName);

  const metaKeywords = document.createElement('meta');
  metaKeywords.setAttribute('itemprop', 'keywords');
  metaKeywords.content = (item.tags || []).join(', ');
  card.appendChild(metaKeywords);

  const metaAuthor = document.createElement('meta');
  metaAuthor.setAttribute('itemprop', 'author');
  metaAuthor.content = item.user || 'GifzoCreator';
  card.appendChild(metaAuthor);

  const overlay = document.createElement('figcaption');
  overlay.className = 'gif-card-overlay';

  // Top Actions (Fav & Copy)
  const topActions = document.createElement('div');
  topActions.className = 'gif-card-top-actions';

  const favBtn = document.createElement('button');
  const isFav = state.favorites.includes(item.id);
  favBtn.className = `card-action-btn ${isFav ? 'active-fav' : ''}`;
  favBtn.innerHTML = isFav ? '❤️' : '🤍';
  favBtn.title = isFav ? 'Remove Favorite' : 'Save Favorite';
  favBtn.setAttribute('aria-label', isFav ? 'Remove Favorite' : 'Save Favorite');
  favBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleFavorite(item.id);
    favBtn.className = `card-action-btn ${state.favorites.includes(item.id) ? 'active-fav' : ''}`;
    favBtn.innerHTML = state.favorites.includes(item.id) ? '❤️' : '🤍';
  });

  const copyBtn = document.createElement('button');
  copyBtn.className = 'card-action-btn';
  copyBtn.innerHTML = '🔗';
  copyBtn.title = 'Copy Direct URL';
  copyBtn.setAttribute('aria-label', 'Copy Direct URL');
  copyBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(item.url);
    showToast('Direct GIF URL copied to clipboard!');
  });

  topActions.appendChild(copyBtn);
  topActions.appendChild(favBtn);
  overlay.appendChild(topActions);

  // Bottom Info
  const info = document.createElement('div');
  info.className = 'gif-card-info';

  const title = document.createElement('div');
  title.className = 'gif-card-title';
  title.setAttribute('itemprop', 'caption');
  title.textContent = item.title;

  const user = document.createElement('div');
  user.className = 'gif-card-user';
  user.textContent = `@${item.user || 'GifzoCreator'}`;

  info.appendChild(title);
  info.appendChild(user);
  overlay.appendChild(info);

  card.appendChild(overlay);

  // Card Click -> Open Detail Lightbox
  card.addEventListener('click', () => openDetailModal(item));

  return card;
}

// Render Articles Grid
function renderArticlesGrid() {
  storiesGrid.replaceChildren();
  articleReaderView.style.display = 'none';
  storiesGrid.style.display = 'grid';

  if (typeof ARTICLES_DATA === 'undefined') return;

  const standardArticles = ARTICLES_DATA.filter(art => !art.isAd);
  const storiesTabBadge = document.querySelector('.tab-btn[data-tab="stories"] .tab-badge');
  if (storiesTabBadge) {
    storiesTabBadge.textContent = `${standardArticles.length} Articles`;
  }

  ARTICLES_DATA.forEach(art => {
    const card = document.createElement('article');
    card.className = 'story-card';
    card.setAttribute('itemscope', '');
    card.setAttribute('itemtype', 'https://schema.org/Article');

    const cover = document.createElement('div');
    cover.className = 'story-card-cover';
    
    const img = document.createElement('img');
    img.src = art.coverImage;
    img.alt = `${art.title} - Visual Culture Essay`;
    img.width = 600;
    img.height = 340;
    img.loading = 'lazy';
    img.setAttribute('itemprop', 'image');
    cover.appendChild(img);

    const badge = document.createElement('span');
    badge.className = 'story-category-badge';
    badge.textContent = art.category;
    cover.appendChild(badge);

    card.appendChild(cover);

    const content = document.createElement('div');
    content.className = 'story-card-content';

    const title = document.createElement('h3');
    title.className = 'story-card-title';
    title.setAttribute('itemprop', 'headline');
    title.textContent = art.title;

    const subtitle = document.createElement('p');
    subtitle.className = 'story-card-subtitle';
    subtitle.setAttribute('itemprop', 'description');
    subtitle.textContent = art.subtitle;

    content.appendChild(title);
    content.appendChild(subtitle);

    const footer = document.createElement('div');
    footer.className = 'story-card-footer';

    const authorInfo = document.createElement('div');
    authorInfo.className = 'story-author-info';
    authorInfo.setAttribute('itemprop', 'author');
    authorInfo.setAttribute('itemscope', '');
    authorInfo.setAttribute('itemtype', 'https://schema.org/Person');

    const avatar = document.createElement('img');
    avatar.className = 'story-author-avatar';
    avatar.src = art.avatar;
    avatar.alt = art.author;
    avatar.width = 36;
    avatar.height = 36;
    avatar.loading = 'lazy';

    const name = document.createElement('span');
    name.className = 'story-author-name';
    name.setAttribute('itemprop', 'name');
    name.textContent = art.author;

    authorInfo.appendChild(avatar);
    authorInfo.appendChild(name);

    const readTime = document.createElement('span');
    readTime.className = 'story-read-time';
    readTime.textContent = art.readTime;

    footer.appendChild(authorInfo);
    footer.appendChild(readTime);
    content.appendChild(footer);

    card.appendChild(content);

    if (art.isAd || art.externalUrl) {
      card.classList.add('story-card-ad');
      badge.style.background = 'var(--gradient-cyan)';
      badge.style.color = '#121212';
      badge.style.fontWeight = '800';
      readTime.style.color = 'var(--neon-cyan)';
      readTime.style.fontWeight = '700';
      card.addEventListener('click', () => {
        window.open(art.externalUrl, '_blank', 'noopener,noreferrer');
      });
    } else {
      card.addEventListener('click', () => renderArticleReader(art));
    }
    storiesGrid.appendChild(card);
  });
}

// Render Full Article Reader View
function renderArticleReader(article) {
  state.activeArticle = article;
  storiesGrid.style.display = 'none';
  articleReaderView.style.display = 'block';
  articleReaderView.replaceChildren();

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Update SEO for article reader
  updatePageSEO(
    `${article.title} | gifzo.lol`,
    article.subtitle,
    `https://gifzo.lol/articles/${article.slug}.html`
  );
  updateUrlParams();

  const container = document.createElement('div');
  container.className = 'article-reader-container';

  // Back Button
  const backBtn = document.createElement('button');
  backBtn.className = 'btn btn-secondary btn-back-stories';
  backBtn.textContent = '← Back to All Stories';
  backBtn.addEventListener('click', () => {
    state.activeArticle = null;
    articleReaderView.style.display = 'none';
    storiesGrid.style.display = 'grid';
    refreshCurrentPageSEO();
    updateUrlParams();
  });
  container.appendChild(backBtn);

  // Header
  const header = document.createElement('div');
  header.className = 'article-header';

  const catTag = document.createElement('span');
  catTag.className = 'article-cat-tag';
  catTag.textContent = article.category;
  header.appendChild(catTag);

  const title = document.createElement('h1');
  title.className = 'article-main-title';
  title.textContent = article.title;
  header.appendChild(title);

  const subtitle = document.createElement('p');
  subtitle.className = 'article-main-subtitle';
  subtitle.textContent = article.subtitle;
  header.appendChild(subtitle);

  // Meta Bar
  const metaBar = document.createElement('div');
  metaBar.className = 'article-meta-bar';

  const authorBlock = document.createElement('div');
  authorBlock.className = 'article-author-block';

  const avatar = document.createElement('img');
  avatar.className = 'article-author-avatar-lg';
  avatar.src = article.avatar;
  avatar.alt = article.author;

  const authorDetails = document.createElement('div');
  authorDetails.className = 'article-author-details';

  const authorName = document.createElement('span');
  authorName.className = 'article-author-name-lg';
  authorName.textContent = article.author;

  const authorTitle = document.createElement('span');
  authorTitle.className = 'article-author-title';
  authorTitle.textContent = article.authorTitle;

  authorDetails.appendChild(authorName);
  authorDetails.appendChild(authorTitle);
  authorBlock.appendChild(avatar);
  authorBlock.appendChild(authorDetails);

  const stats = document.createElement('div');
  stats.className = 'article-stats';
  stats.textContent = `📅 ${article.date} • ⏱️ ${article.readTime}`;

  metaBar.appendChild(authorBlock);
  metaBar.appendChild(stats);
  header.appendChild(metaBar);

  container.appendChild(header);

  // Cover Image
  const coverImg = document.createElement('img');
  coverImg.className = 'article-cover-banner';
  coverImg.src = article.coverImage;
  coverImg.alt = article.title;
  container.appendChild(coverImg);

  // Embedded GIF Box
  if (article.embeddedGif) {
    const gifBox = document.createElement('div');
    gifBox.className = 'article-embedded-gif-box';

    const gifImg = document.createElement('img');
    gifImg.src = article.embeddedGif;
    gifImg.alt = "Embedded Article GIF Loop";

    const caption = document.createElement('p');
    caption.className = 'article-gif-caption';
    caption.textContent = `⚡ Featured Loop: ${article.tags[0]} & Visual Culture`;

    gifBox.appendChild(gifImg);
    gifBox.appendChild(caption);
    container.appendChild(gifBox);
  }

  // Article Content Paragraphs
  const body = document.createElement('div');
  body.className = 'article-body';

  const paragraphs = article.content.split('\n\n');

  paragraphs.forEach(pText => {
    const p = document.createElement('p');
    p.textContent = pText;
    body.appendChild(p);
  });

  container.appendChild(body);

  // Article Tags Footer
  const tagsFooter = document.createElement('div');
  tagsFooter.className = 'article-tags-footer';

  article.tags.forEach(t => {
    const tagBtn = document.createElement('span');
    tagBtn.className = 'tag-pill';
    tagBtn.textContent = `#${t}`;
    tagsFooter.appendChild(tagBtn);
  });

  container.appendChild(tagsFooter);
  articleReaderView.appendChild(container);
}

// Open Detail Lightbox Modal
function openDetailModal(item, updateUrl = true) {
  state.activeMediaModal = item;
  modalContent.replaceChildren();

  if (updateUrl) updateUrlParams();
  refreshCurrentPageSEO();

  // Media Side
  const mediaSide = document.createElement('div');
  mediaSide.className = 'modal-media-side';

  const img = document.createElement('img');
  img.src = item.url;
  img.alt = `${item.title} - ${item.category} Animated GIF Loop`;
  img.title = item.title;
  img.width = item.width || 480;
  img.height = item.height || 360;
  mediaSide.appendChild(img);

  // Info Side
  const infoSide = document.createElement('div');
  infoSide.className = 'modal-info-side';

  const title = document.createElement('h2');
  title.className = 'modal-title';
  title.textContent = item.title;
  infoSide.appendChild(title);

  const userRow = document.createElement('div');
  userRow.className = 'modal-user-row';

  const avatar = document.createElement('img');
  avatar.className = 'modal-user-avatar';
  avatar.src = item.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&auto=format&fit=crop&q=80';
  avatar.alt = item.user || 'GifzoArtist';
  avatar.width = 40;
  avatar.height = 40;

  const userName = document.createElement('span');
  userName.className = 'modal-user-name';
  userName.textContent = `@${item.user || 'GifzoArtist'}`;

  userRow.appendChild(avatar);
  userRow.appendChild(userName);
  infoSide.appendChild(userRow);

  // Share & Embed Action Buttons
  const shareBox = document.createElement('div');
  shareBox.className = 'modal-share-box';

  const shareLabel = document.createElement('label');
  shareLabel.className = 'form-label';
  shareLabel.textContent = 'Share & Export Loop';

  const actionsGroup = document.createElement('div');
  actionsGroup.style.display = 'flex';
  actionsGroup.style.gap = '10px';
  actionsGroup.style.marginTop = '8px';

  const copyLinkBtn = document.createElement('button');
  copyLinkBtn.className = 'btn btn-gradient btn-sm';
  copyLinkBtn.style.flex = '1';
  copyLinkBtn.style.justifyContent = 'center';
  copyLinkBtn.textContent = '🔗 Copy Share Link';
  copyLinkBtn.setAttribute('aria-label', 'Copy Shareable Link');
  copyLinkBtn.addEventListener('click', () => {
    const shareableUrl = `https://gifzo.lol/?gif=${item.id}`;
    navigator.clipboard.writeText(shareableUrl);
    showToast('Direct shareable link copied to clipboard!');
  });

  const embedCode = `<iframe src="${item.url}" width="480" height="360" frameBorder="0" class="gifzo-embed" allowFullScreen title="${item.title}"></iframe>`;
  const copyEmbedBtn = document.createElement('button');
  copyEmbedBtn.className = 'btn btn-secondary btn-sm';
  copyEmbedBtn.style.flex = '1';
  copyEmbedBtn.style.justifyContent = 'center';
  copyEmbedBtn.textContent = '💻 Copy Embed Code';
  copyEmbedBtn.setAttribute('aria-label', 'Copy Embed Code');
  copyEmbedBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(embedCode);
    showToast('Iframe embed code copied!');
  });

  actionsGroup.appendChild(copyLinkBtn);
  actionsGroup.appendChild(copyEmbedBtn);
  shareBox.appendChild(shareLabel);
  shareBox.appendChild(actionsGroup);
  infoSide.appendChild(shareBox);

  // Favorite Button
  const isFav = state.favorites.includes(item.id);
  const favBtn = document.createElement('button');
  favBtn.className = `btn ${isFav ? 'btn-gradient' : 'btn-secondary'}`;
  favBtn.textContent = isFav ? '❤️ Remove from Favorites' : '🤍 Add to Favorites';
  favBtn.setAttribute('aria-label', isFav ? 'Remove from Favorites' : 'Add to Favorites');
  favBtn.addEventListener('click', () => {
    toggleFavorite(item.id);
    const nowFav = state.favorites.includes(item.id);
    favBtn.className = `btn ${nowFav ? 'btn-gradient' : 'btn-secondary'}`;
    favBtn.textContent = nowFav ? '❤️ Remove from Favorites' : '🤍 Add to Favorites';
    renderActiveView();
  });

  infoSide.appendChild(favBtn);

  modalContent.appendChild(mediaSide);
  modalContent.appendChild(infoSide);

  modalBackdrop.classList.add('active');
}

function closeModal() {
  modalBackdrop.classList.remove('active');
  state.activeMediaModal = null;
  updateUrlParams();
  refreshCurrentPageSEO();
}

// Upload / Create GIF Modal
function openUploadModal() {
  uploadModalBackdrop?.classList.add('active');
}

function closeUploadModal() {
  uploadModalBackdrop?.classList.remove('active');
}

// Favorites Manager
function toggleFavorite(id) {
  const index = state.favorites.indexOf(id);
  if (index > -1) {
    state.favorites.splice(index, 1);
    showToast('Removed from favorites');
  } else {
    state.favorites.push(id);
    showToast('Added to your favorite loops! ❤️');
  }
  localStorage.setItem('gifzo_favorites', JSON.stringify(state.favorites));
}

// Toast Notifications
function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    setTimeout(() => toast.remove(), 300);
  }, 2800);
}

// Render Empty State
function renderEmptyState(container, message) {
  container.replaceChildren();
  const empty = document.createElement('div');
  empty.className = 'empty-state';

  const title = document.createElement('h3');
  title.textContent = "No Loops Found";

  const desc = document.createElement('p');
  desc.textContent = message;

  empty.appendChild(title);
  empty.appendChild(desc);
  container.appendChild(empty);
}
